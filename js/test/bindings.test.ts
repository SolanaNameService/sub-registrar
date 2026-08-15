import { NAME_PROGRAM_ID } from "@bonfida/spl-name-service";
import { SystemProgram } from "@solana/web3.js";
import { createRegistrar } from "../src/bindings";
import { Schedule } from "../src/state";
import {
  AUTHORITY,
  DOMAIN_KEY,
  DOMAIN_OWNER,
  EXPECTED_REGISTRAR_PDA,
  FEE_ACCOUNT,
  FEE_PAYER,
  MINT,
  NFT_COLLECTION,
  PROGRAM_ID,
} from "./fixtures/keys";

describe("sub-registrar bindings", () => {
  it("creates a registrar instruction with the SNS v4 domain PDA", async () => {
    const [instruction] = await createRegistrar(
      "example",
      DOMAIN_OWNER,
      FEE_PAYER,
      MINT,
      AUTHORITY,
      [
        new Schedule({ length: 1n, price: 100n }),
        new Schedule({ length: 3n, price: 250n }),
      ],
      FEE_ACCOUNT,
      NFT_COLLECTION,
      3,
      true
    );

    expect(instruction.programId.equals(PROGRAM_ID)).toBe(true);
    expect(instruction.keys).toHaveLength(6);
    expect(instruction.keys[1].pubkey.toBase58()).toBe(
      EXPECTED_REGISTRAR_PDA.toBase58()
    );
    expect(instruction.keys[2].pubkey.toBase58()).toBe(
      DOMAIN_KEY.toBase58()
    );
    expect(instruction.keys).toEqual([
      {
        pubkey: SystemProgram.programId,
        isSigner: false,
        isWritable: false,
      },
      {
        pubkey: EXPECTED_REGISTRAR_PDA,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: DOMAIN_KEY,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: DOMAIN_OWNER,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: FEE_PAYER,
        isSigner: true,
        isWritable: true,
      },
      {
        pubkey: NAME_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ]);
    expect(instruction.data[0]).toBe(0);
    expect(instruction.data.length).toBeGreaterThan(1);
  });
});
