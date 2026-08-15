import { PublicKey } from "@solana/web3.js";

// Base58 encoding of 32 bytes set to 0x01.
export const DOMAIN_OWNER = new PublicKey(
  "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
);

// Base58 encoding of 32 bytes set to 0x02.
export const AUTHORITY = new PublicKey(
  "8qbHbw2BbbTHBW1sbeqakYXVKRQM8Ne7pLK7m6CVfeR",
);

// Base58 encoding of 32 bytes set to 0x03.
export const FEE_PAYER = new PublicKey(
  "CktRuQ2mttgRGkXJtyksdKHjUdc2C4TgDzyB98oEzy8",
);

// Base58 encoding of 32 bytes set to 0x04.
export const MINT = new PublicKey(
  "GgBaCs3NCBuZN12kCJgAW63ydqohFkHEdfdEXBPzLHq",
);

// Base58 encoding of 32 bytes set to 0x05.
export const FEE_ACCOUNT = new PublicKey(
  "LbUiWL3xVV8hTFYBVdbTNrpDo41NKS6o3LHHuDzjfcY",
);

// Base58 encoding of 32 bytes set to 0x06.
export const NFT_COLLECTION = new PublicKey(
  "QWmroo4YnnMqYW3cnxWkFdaTxGD3P7vMSzwMHGbUzwF",
);

// Mainnet SNS sub-registrar program ID from the repository README.
export const PROGRAM_ID = new PublicKey(
  "2KkyPzjaAYaz2ojQZ9P3xYakLd96B5UH6a2isLaZ4Cgs",
);

// getSnsDomainKeySync("example").pubkey in SNS SDK v4.
export const DOMAIN_KEY = new PublicKey(
  "3hAeKRCU9LMrnHZBzJ8YzbHSjJXEV73oaW8s81MWpY95",
);

// Base58 encoding of 32 bytes set to 0x07.
export const FIXTURE_REGISTRAR = new PublicKey(
  "US517G5965aydkZ46HS38QLi7UQiSojurfbQfKCELFx",
);

// Base58 encoding of 32 bytes set to 0x08.
export const FIXTURE_SUB_KEY = new PublicKey(
  "YMN9Qj5jPNp7j14VPcML1B6xGgcPWVZUGLFU3Mnyfaf",
);

// Base58 encoding of 32 bytes set to 0x09.
export const FIXTURE_MINT_RECORD = new PublicKey(
  "cGfHiC6Kgg3FpFZvgwGcswsCRtp4aBP2fzuXRQPizuN",
);

// Base58 encoding of 32 bytes set to 0x0a.
export const FIXTURE_ALLOCATOR = new PublicKey(
  "gBxS1f6uyyGPuW5MzGBukidSb71jdsCb5fZaoSzULE5",
);

// Base58 encoding of 32 bytes set to 0x0b.
export const FIXTURE_SUB_KEY_WITHOUT_MINT = new PublicKey(
  "k7FaK87WHGVXzkaoHb7CdVPgkKDQhZ29VLDeBVbDfYn",
);

// Base58 encoding of 32 bytes set to 0x0c.
export const FIXTURE_ALLOCATOR_WITHOUT_MINT = new PublicKey(
  "p2Yicb86aZig616Eav2VWG9vuXR5mEqhtzshZYBxzsV",
);

// findProgramAddressSync(["registrar", DOMAIN_KEY], PROGRAM_ID).
export const EXPECTED_REGISTRAR_PDA = new PublicKey(
  "fC13vEtRgriJKTj5QCDMLNh5hUWV5ATnT9h6vDVfLsm",
);

// findProgramAddressSync(["subrecord", DOMAIN_KEY], PROGRAM_ID).
export const EXPECTED_SUBRECORD_PDA = new PublicKey(
  "jA4AEWri3SPJ3sQd26FfGGQGgj8TLtmQBafdmivSPaY",
);

// findProgramAddressSync(["nft_mint_record", EXPECTED_REGISTRAR_PDA, MINT], PROGRAM_ID).
export const EXPECTED_MINT_RECORD_PDA = new PublicKey(
  "F21Z28wc5uqWNZ8PRw2XmeGhmMetEkX9p6hTjnqRp9xT",
);

// getMetadataKeyFromMint(MINT) in src/utils.ts.
export const EXPECTED_METADATA_PDA = new PublicKey(
  "D2eo93GYk9WuXBycmNb2fZsnjsadhNWzsgCcNcgiqHSo",
);
