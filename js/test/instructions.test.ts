import {
  NAME_PROGRAM_ID,
  REGISTER_PROGRAM_ID,
  REVERSE_LOOKUP_CLASS,
  SNS_ROOT_DOMAIN_ACCOUNT,
} from "@bonfida/spl-name-service";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import {
  adminRevokeInstruction,
  registerInstruction,
} from "../src/raw_instructions";
import {
  AUTHORITY,
  DOMAIN_KEY,
  DOMAIN_OWNER,
  EXPECTED_SUBRECORD_PDA,
  FEE_ACCOUNT,
  FEE_PAYER,
  FIXTURE_MINT_RECORD,
  FIXTURE_REGISTRAR,
  FIXTURE_SUB_KEY,
  MINT,
  PROGRAM_ID,
} from "./fixtures/keys";

const summarizeAccounts = (
  accounts: Array<{
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
  }>
) =>
  accounts.map(({ pubkey, isSigner, isWritable }) => ({
    pubkey: pubkey.toBase58(),
    isSigner,
    isWritable,
  }));

describe("generated instruction ABI", () => {
  it("serializes register with the Rust tag, payload, and account table", () => {
    const instruction = new registerInstruction({
      domain: "\0abc",
    }).getInstruction(
      PROGRAM_ID,
      SystemProgram.programId,
      TOKEN_PROGRAM_ID,
      NAME_PROGRAM_ID,
      SYSVAR_RENT_PUBKEY,
      REGISTER_PROGRAM_ID,
      SNS_ROOT_DOMAIN_ACCOUNT,
      REVERSE_LOOKUP_CLASS,
      FEE_ACCOUNT,
      MINT,
      FIXTURE_REGISTRAR,
      DOMAIN_KEY,
      DOMAIN_OWNER,
      FIXTURE_SUB_KEY,
      FEE_PAYER,
      AUTHORITY,
      EXPECTED_SUBRECORD_PDA
    );

    expect(instruction.programId.toBase58()).toBe(PROGRAM_ID.toBase58());
    expect(Array.from(instruction.data)).toEqual([
      2, 4, 0, 0, 0, 0, 97, 98, 99,
    ]);
    expect(summarizeAccounts(instruction.keys)).toEqual([
      {
        pubkey: SystemProgram.programId.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: TOKEN_PROGRAM_ID.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: NAME_PROGRAM_ID.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SYSVAR_RENT_PUBKEY.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: REGISTER_PROGRAM_ID.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: SNS_ROOT_DOMAIN_ACCOUNT.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: REVERSE_LOOKUP_CLASS.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      { pubkey: FEE_ACCOUNT.toBase58(), isSigner: false, isWritable: true },
      { pubkey: MINT.toBase58(), isSigner: false, isWritable: true },
      {
        pubkey: FIXTURE_REGISTRAR.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: DOMAIN_KEY.toBase58(), isSigner: false, isWritable: true },
      { pubkey: DOMAIN_OWNER.toBase58(), isSigner: false, isWritable: true },
      { pubkey: FIXTURE_SUB_KEY.toBase58(), isSigner: false, isWritable: true },
      { pubkey: FEE_PAYER.toBase58(), isSigner: true, isWritable: true },
      { pubkey: AUTHORITY.toBase58(), isSigner: false, isWritable: true },
      {
        pubkey: EXPECTED_SUBRECORD_PDA.toBase58(),
        isSigner: false,
        isWritable: true,
      },
    ]);
  });

  it("handles the optional admin revoke mint record account", () => {
    const createInstruction = (mintRecord?: PublicKey) =>
      new adminRevokeInstruction().getInstruction(
        PROGRAM_ID,
        FIXTURE_REGISTRAR,
        DOMAIN_KEY,
        EXPECTED_SUBRECORD_PDA,
        DOMAIN_OWNER,
        MINT,
        AUTHORITY,
        PublicKey.default,
        NAME_PROGRAM_ID,
        mintRecord
      );

    const withoutMintRecord = createInstruction();
    const withMintRecord = createInstruction(FIXTURE_MINT_RECORD);

    expect(Array.from(withoutMintRecord.data)).toEqual([7]);
    expect(Array.from(withMintRecord.data)).toEqual([7]);
    expect(summarizeAccounts(withoutMintRecord.keys)).toHaveLength(8);
    expect(summarizeAccounts(withMintRecord.keys)).toEqual([
      {
        pubkey: FIXTURE_REGISTRAR.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: DOMAIN_KEY.toBase58(), isSigner: false, isWritable: true },
      {
        pubkey: EXPECTED_SUBRECORD_PDA.toBase58(),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: DOMAIN_OWNER.toBase58(), isSigner: false, isWritable: true },
      { pubkey: MINT.toBase58(), isSigner: false, isWritable: false },
      { pubkey: AUTHORITY.toBase58(), isSigner: true, isWritable: true },
      {
        pubkey: PublicKey.default.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: NAME_PROGRAM_ID.toBase58(),
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: FIXTURE_MINT_RECORD.toBase58(),
        isSigner: false,
        isWritable: true,
      },
    ]);
  });
});
