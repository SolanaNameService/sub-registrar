import { Buffer } from "buffer";
import {
  AUTHORITY,
  DOMAIN_KEY,
  FEE_ACCOUNT,
  FIXTURE_ALLOCATOR,
  FIXTURE_ALLOCATOR_WITHOUT_MINT,
  FIXTURE_MINT_RECORD,
  FIXTURE_REGISTRAR,
  FIXTURE_SUB_KEY,
  FIXTURE_SUB_KEY_WITHOUT_MINT,
  MINT,
  NFT_COLLECTION,
} from "./keys";

const writeKey = (data: Buffer, offset: number, key: Buffer) => {
  key.copy(data, offset);
};

const writeU64 = (data: Buffer, offset: number, value: bigint) => {
  data.writeBigUInt64LE(value, offset);
};

const writeI64 = (data: Buffer, offset: number, value: bigint) => {
  data.writeBigInt64LE(value, offset);
};

// Rust Registrar layout:
// tag, nonce, authority, fee account, mint, domain, total, collection,
// max mint, allow revoke, price vector, revoke expiry time.
export const REGISTRAR_ACCOUNT_DATA = Buffer.alloc(217);
REGISTRAR_ACCOUNT_DATA[0] = 1;
REGISTRAR_ACCOUNT_DATA[1] = 7;
writeKey(REGISTRAR_ACCOUNT_DATA, 2, AUTHORITY.toBuffer());
writeKey(REGISTRAR_ACCOUNT_DATA, 34, FEE_ACCOUNT.toBuffer());
writeKey(REGISTRAR_ACCOUNT_DATA, 66, MINT.toBuffer());
writeKey(REGISTRAR_ACCOUNT_DATA, 98, DOMAIN_KEY.toBuffer());
writeU64(REGISTRAR_ACCOUNT_DATA, 130, 42n);
REGISTRAR_ACCOUNT_DATA[138] = 1;
writeKey(REGISTRAR_ACCOUNT_DATA, 139, NFT_COLLECTION.toBuffer());
REGISTRAR_ACCOUNT_DATA[171] = 3;
REGISTRAR_ACCOUNT_DATA[172] = 1;
REGISTRAR_ACCOUNT_DATA.writeUInt32LE(2, 173);
writeU64(REGISTRAR_ACCOUNT_DATA, 177, 1n);
writeU64(REGISTRAR_ACCOUNT_DATA, 185, 100n);
writeU64(REGISTRAR_ACCOUNT_DATA, 193, 3n);
writeU64(REGISTRAR_ACCOUNT_DATA, 201, 250n);
writeI64(REGISTRAR_ACCOUNT_DATA, 209, 604800n);

// Rust SubDomainRecord layout with an NFT mint record and a positive i64 expiry.
export const SUBRECORD_WITH_MINT_ACCOUNT_DATA = Buffer.alloc(138);
SUBRECORD_WITH_MINT_ACCOUNT_DATA[0] = 3;
writeKey(SUBRECORD_WITH_MINT_ACCOUNT_DATA, 1, FIXTURE_REGISTRAR.toBuffer());
writeKey(SUBRECORD_WITH_MINT_ACCOUNT_DATA, 33, FIXTURE_SUB_KEY.toBuffer());
SUBRECORD_WITH_MINT_ACCOUNT_DATA[65] = 1;
writeKey(SUBRECORD_WITH_MINT_ACCOUNT_DATA, 66, FIXTURE_MINT_RECORD.toBuffer());
writeI64(SUBRECORD_WITH_MINT_ACCOUNT_DATA, 98, 123456789n);
writeKey(SUBRECORD_WITH_MINT_ACCOUNT_DATA, 106, FIXTURE_ALLOCATOR.toBuffer());

// Rust RevokedSubRecord layout without a mint record and a negative i64 sentinel.
export const SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA = Buffer.alloc(106);
SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA[0] = 6;
writeKey(SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA, 1, FIXTURE_REGISTRAR.toBuffer());
writeKey(
  SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA,
  33,
  FIXTURE_SUB_KEY_WITHOUT_MINT.toBuffer()
);
SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA[65] = 0;
writeI64(SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA, 66, -42n);
writeKey(
  SUBRECORD_WITHOUT_MINT_ACCOUNT_DATA,
  74,
  FIXTURE_ALLOCATOR_WITHOUT_MINT.toBuffer()
);

// Rust MintRecord layout: tag, count, mint.
export const MINT_RECORD_ACCOUNT_DATA = Buffer.alloc(34);
MINT_RECORD_ACCOUNT_DATA[0] = 5;
MINT_RECORD_ACCOUNT_DATA[1] = 7;
writeKey(MINT_RECORD_ACCOUNT_DATA, 2, MINT.toBuffer());
