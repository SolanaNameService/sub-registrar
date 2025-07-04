import type { Connection, PublicKey } from "@solana/web3.js";

export const checkAccountExists = async (
  connection: Connection,
  address: PublicKey
) => {
  const accountInfo = await connection.getAccountInfo(address);

  return !!accountInfo?.data;
};
