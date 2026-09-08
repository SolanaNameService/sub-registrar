import { ADMIN_KEYPAIR, CONNECTION } from "@/config";
import {
  createNameRegistry,
  createReverse,
  getSnsDomainKeySync,
  getReverseKeySync,
  NAME_PROGRAM_ID,
  NameRegistryState,
  transferInstruction,
} from "@bonfida/spl-name-service";
import { adminRegister } from "@bonfida/sub-register";
import { PublicKey, TransactionInstruction } from "@solana/web3.js";

import { checkAccountExists } from "./check-account-exists";
import { getSubRegistrar } from "./get-sub-registrar";

/**
 * Generates transaction instructions to create a subdomain using a subregistrar.
 *
 * @param {Object} params - Parameters for subdomain creation.
 * @param {string} params.subdomain - The subdomain to be created.
 * @param {string} params.targetPublicKey - The public key of the target account to receive the subdomain.
 * @returns {Promise<TransactionInstruction[]>} - A promise that resolves to an array of transaction instructions.
 */
export const getCreateSubdomainForSubregistrarIxs = async ({
  subdomain,
  targetPublicKey,
}: {
  subdomain: string;
  targetPublicKey: string;
}): Promise<TransactionInstruction[]> => {
  const subRegistrar = await getSubRegistrar();
  const { pubkey: subKey, parent: parentKey } = getSnsDomainKeySync(
    `${subdomain}.${process.env.NEXT_PUBLIC_DOMAIN_NAME}`,
  );

  return [
    // Register subdomain as admin
    ...(await adminRegister(
      CONNECTION,
      subRegistrar.pubkey,
      subdomain,
      ADMIN_KEYPAIR.publicKey,
    )),
    // Sends registered subdomain to target account
    transferInstruction(
      NAME_PROGRAM_ID,
      subKey,
      new PublicKey(targetPublicKey),
      ADMIN_KEYPAIR.publicKey,
      undefined,
      parentKey,
      ADMIN_KEYPAIR.publicKey,
    ),
  ];
};

/**
 * Generates transaction instructions to create a subdomain.
 *
 * @param {Object} params - Parameters for subdomain creation.
 * @param {string} params.subdomain - The subdomain to be created.
 * @param {string} params.targetPublicKey - The public key of the target account to receive the subdomain.
 * @returns {Promise<TransactionInstruction[]>} - A promise that resolves to an array of transaction instructions.
 */
export const getCreateSubdomainIxs = async ({
  subdomain,
  targetPublicKey,
}: {
  subdomain: string;
  targetPublicKey: string;
}): Promise<TransactionInstruction[]> => {
  const instructions: TransactionInstruction[] = [];
  const parentDomain = process.env.NEXT_PUBLIC_DOMAIN_NAME;

  const { pubkey: subKey, parent: parentKey } = getSnsDomainKeySync(
    `${subdomain}.${parentDomain}`,
  );

  const reverseKey = getReverseKeySync(`${subdomain}.${parentDomain}`, true);

  if (!(await checkAccountExists(CONNECTION, subKey))) {
    const lamports = await CONNECTION.getMinimumBalanceForRentExemption(
      NameRegistryState.HEADER_LEN,
    );
    const createSubDomainIx = await createNameRegistry(
      CONNECTION,
      `\0${subdomain}`,
      0,
      ADMIN_KEYPAIR.publicKey,
      new PublicKey(targetPublicKey),
      lamports,
      undefined,
      parentKey,
    );
    instructions.push(createSubDomainIx);
  }

  if (!(await checkAccountExists(CONNECTION, reverseKey))) {
    const createReverseNameIxs = await createReverse(
      subKey,
      `\0${subdomain}`,
      ADMIN_KEYPAIR.publicKey,
      parentKey,
      ADMIN_KEYPAIR.publicKey,
    );
    instructions.push(...createReverseNameIxs);
  }

  return instructions;
};
