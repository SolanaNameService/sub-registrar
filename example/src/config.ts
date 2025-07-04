import bs58 from "bs58";

import { Connection, Keypair } from "@solana/web3.js";

export const ADMIN_KEYPAIR = Keypair.fromSecretKey(
  new Uint8Array(bs58.decode(process.env.PRIVATE_KEY!))
);

export const CONNECTION = new Connection(
  process.env.NEXT_PUBLIC_RPC!,
  "processed"
);

export const SUBREGISTRAR_MODE = process.env.SUBREGISTRAR_MODE === "true";
