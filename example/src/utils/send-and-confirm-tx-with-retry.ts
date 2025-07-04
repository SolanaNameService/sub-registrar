import { ADMIN_KEYPAIR, CONNECTION } from "@/config";
import {
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

/**
 * Sends and confirms a Solana transaction with retry logic
 *
 * @param {Object} params - Parameters for sending the transaction.
 * @param {TransactionInstruction[]} params.instructions - The list of transaction instructions to include in the transaction.
 * @param {number} params.maxRetry - The maximum number of retry attempts.
 * @param {number} params.retryDelay - The delay in milliseconds between retry attempts.
 * @returns {Promise<string>} - A promise that resolves to the transaction ID if successful.
 * @throws {Error} - Throws an error if the transaction fails after all retry attempts.
 */
export const sendAndConfirmTxWithRetry = async ({
  instructions,
  maxRetry,
  retryDelay,
}: {
  instructions: TransactionInstruction[];
  maxRetry: number;
  retryDelay: number;
}) => {
  for (let attempt = 0; attempt < maxRetry; attempt++) {
    try {
      const latestBlockhash = await CONNECTION.getLatestBlockhash();

      const messageV0 = new TransactionMessage({
        payerKey: ADMIN_KEYPAIR.publicKey,
        recentBlockhash: latestBlockhash.blockhash,
        instructions,
      }).compileToV0Message();

      const versionedTransaction = new VersionedTransaction(messageV0);
      versionedTransaction.sign([ADMIN_KEYPAIR]);

      const txid = await CONNECTION.sendTransaction(versionedTransaction);
      const confirmation = await CONNECTION.confirmTransaction({
        signature: txid,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      });

      if (confirmation.value.err) {
        throw new Error("Transaction not confirmed");
      } else {
        return txid;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error(`Transaction failed after ${maxRetry} retries`);
};
