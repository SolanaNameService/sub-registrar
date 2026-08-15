import { PublicKey } from "@solana/web3.js";
import { getMetadataKeyFromMint } from "../src/utils";
import { EXPECTED_METADATA_PDA, MINT } from "./fixtures/keys";

describe("metadata PDA helper", () => {
  it("derives the fixed Metaplex metadata PDA", () => {
    const metadata = getMetadataKeyFromMint(MINT);

    expect(metadata).toBeInstanceOf(PublicKey);
    expect(metadata.toBase58()).toBe(EXPECTED_METADATA_PDA.toBase58());
  });
});
