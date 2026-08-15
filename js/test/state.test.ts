import { Connection } from "@solana/web3.js";
import {
  formatSchedule,
  MintRecord,
  Registrar,
  Schedule,
  serializePriceSchedule,
  SubRecord,
} from "../src/state";
import { Tag } from "../src/state/tag";
import {
  AUTHORITY,
  DOMAIN_KEY,
  EXPECTED_MINT_RECORD_PDA,
  EXPECTED_REGISTRAR_PDA,
  EXPECTED_SUBRECORD_PDA,
  FEE_ACCOUNT,
  FIXTURE_ALLOCATOR,
  FIXTURE_ALLOCATOR_WITHOUT_MINT,
  FIXTURE_MINT_RECORD,
  FIXTURE_REGISTRAR,
  FIXTURE_SUB_KEY,
  FIXTURE_SUB_KEY_WITHOUT_MINT,
  MINT,
  PROGRAM_ID,
} from "./fixtures/keys";
import {
  MINT_RECORD_ACCOUNT_DATA,
  REGISTRAR_ACCOUNT_DATA,
  SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA,
  SUBRECORD_WITH_MINT_ACCOUNT_DATA,
} from "./fixtures/state-account-data";

describe("state", () => {
  it.each([
    [
      "Registrar",
      Registrar.findKey(DOMAIN_KEY, PROGRAM_ID),
      EXPECTED_REGISTRAR_PDA,
    ],
    [
      "SubRecord",
      SubRecord.findKey(DOMAIN_KEY, PROGRAM_ID),
      EXPECTED_SUBRECORD_PDA,
    ],
    [
      "MintRecord",
      MintRecord.findKey(EXPECTED_REGISTRAR_PDA, MINT, PROGRAM_ID),
      EXPECTED_MINT_RECORD_PDA,
    ],
  ])("derives the fixed %s PDA vector", (_name, result, expected) => {
    expect(result[0].toBase58()).toBe(expected.toBase58());
  });

  it("finds registrars for a domain using the Rust account filters", async () => {
    const getProgramAccounts = jest.fn().mockResolvedValue([
      {
        pubkey: EXPECTED_REGISTRAR_PDA,
        account: { data: REGISTRAR_ACCOUNT_DATA },
      },
    ]);
    const connection = { getProgramAccounts } as unknown as Connection;

    const result = await Registrar.findForDomain(
      connection,
      DOMAIN_KEY,
      PROGRAM_ID
    );

    expect(getProgramAccounts).toHaveBeenCalledWith(PROGRAM_ID, {
      filters: [
        { memcmp: { offset: 98, bytes: DOMAIN_KEY.toBase58() } },
        { memcmp: { offset: 0, bytes: "2" } },
      ],
    });
    expect(result).toHaveLength(1);
    expect(result[0].pubkey.toBase58()).toBe(EXPECTED_REGISTRAR_PDA.toBase58());
    expect(result[0].registrar.domain.toBase58()).toBe(DOMAIN_KEY.toBase58());
  });

  it("decodes the Rust state fixtures without using the JS schemas as input", () => {
    const registrar = Registrar.deserialize(REGISTRAR_ACCOUNT_DATA);
    expect(registrar.tag).toBe(Tag.Registrar);
    expect(registrar.nonce).toBe(7);
    expect(registrar.authority.toBase58()).toBe(AUTHORITY.toBase58());
    expect(registrar.feeAccount.toBase58()).toBe(FEE_ACCOUNT.toBase58());
    expect(registrar.mint.toBase58()).toBe(MINT.toBase58());
    expect(registrar.domain.toBase58()).toBe(DOMAIN_KEY.toBase58());
    expect(registrar.totalSubCreated).toBe(42n);
    expect(registrar.nftGatedCollection?.toBase58()).toBe(
      "QWmroo4YnnMqYW3cnxWkFdaTxGD3P7vMSzwMHGbUzwF"
    );
    expect(registrar.maxNftMint).toBe(3);
    expect(registrar.allowRevoke).toBe(true);
    expect(
      registrar.priceSchedule.map(({ length, price }) => [length, price])
    ).toEqual([
      [1n, 100n],
      [3n, 250n],
    ]);
    expect(registrar.revokeExpiryTime).toBe(604800n);

    const subrecordWithMint = SubRecord.deserialize(
      SUBRECORD_WITH_MINT_ACCOUNT_DATA
    );
    expect(subrecordWithMint.tag).toBe(Tag.SubRecord);
    expect(subrecordWithMint.registrar.toBase58()).toBe(
      FIXTURE_REGISTRAR.toBase58()
    );
    expect(subrecordWithMint.subKey.toBase58()).toBe(
      FIXTURE_SUB_KEY.toBase58()
    );
    expect(subrecordWithMint.mintRecord?.toBase58()).toBe(
      FIXTURE_MINT_RECORD.toBase58()
    );
    expect(subrecordWithMint.expiryTimestamp).toBe(123456789n);
    expect(subrecordWithMint.allocator.toBase58()).toBe(
      FIXTURE_ALLOCATOR.toBase58()
    );

    const subrecordWithoutMint = SubRecord.deserialize(
      SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA
    );
    expect(subrecordWithoutMint.tag).toBe(Tag.RevokedSubRecord);
    expect(subrecordWithoutMint.registrar.toBase58()).toBe(
      FIXTURE_REGISTRAR.toBase58()
    );
    expect(subrecordWithoutMint.subKey.toBase58()).toBe(
      FIXTURE_SUB_KEY_WITHOUT_MINT.toBase58()
    );
    expect(subrecordWithoutMint.mintRecord).toBeUndefined();
    expect(subrecordWithoutMint.expiryTimestamp).toBe(-42n);
    expect(subrecordWithoutMint.allocator.toBase58()).toBe(
      FIXTURE_ALLOCATOR_WITHOUT_MINT.toBase58()
    );

    const mintRecord = MintRecord.deserialize(MINT_RECORD_ACCOUNT_DATA);
    expect(mintRecord.tag).toBe(Tag.MintRecord);
    expect(mintRecord.count).toBe(7);
    expect(mintRecord.mint.toBase58()).toBe(MINT.toBase58());
    expect(Tag.RevokedSubRecord).toBe(6);
  });

  it.each([
    ["Registrar", Registrar.retrieve],
    ["SubRecord", SubRecord.retrieve],
    ["MintRecord", MintRecord.retrieve],
  ])("throws when a %s account is missing", async (_name, retrieve) => {
    const getAccountInfo = jest.fn().mockResolvedValue(null);
    const connection = { getAccountInfo } as unknown as Connection;

    await expect(retrieve(connection, EXPECTED_REGISTRAR_PDA)).rejects.toThrow(
      "State account not found"
    );
    expect(getAccountInfo).toHaveBeenCalledWith(EXPECTED_REGISTRAR_PDA);
  });

  it("formats and serializes price schedules as bigint pairs", () => {
    const schedule = [
      new Schedule({ length: 1n, price: 100n }),
      new Schedule({ length: 3n, price: 250n }),
    ];

    expect(formatSchedule(schedule)).toEqual([
      [1n, 100n],
      [3n, 250n],
    ]);
    expect(Array.from(serializePriceSchedule(schedule))).toEqual([
      2, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 100, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0,
      0, 0, 0, 0, 250, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});
