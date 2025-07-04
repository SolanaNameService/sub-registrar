import { NextRequest, NextResponse } from "next/server";

import { SUBREGISTRAR_MODE } from "@/config";
import {
  getCreateSubdomainForSubregistrarIxs,
  getCreateSubdomainIxs,
} from "@/utils/instructions";
import { sendAndConfirmTxWithRetry } from "@/utils/send-and-confirm-tx-with-retry";
import { isValidSubdomain } from "@/utils/string";

/**
 * Registers a subdomain and transfer it to the target account
 * @api {post} /api/register
 * @apiBody {String} publicKey    Target account public key
 * @apiBody {String} subdomain    Subdomain to be registered
 * @apiSuccess {String} txid      Transaction ID
 * @apiError {String} error       Error detail
 */
export const POST = async (request: NextRequest) => {
  const { publicKey: targetPublicKey, subdomain } = await request.json();

  // TODO: Implement additional validation/filtering as needed, such as
  // - signature validation
  // - publicKey filtering
  // - IP filtering
  // - language checks
  // - admin account balance check
  // - rate limiting

  if (!isValidSubdomain(subdomain)) {
    return NextResponse.json(
      { success: false, error: "Invalid subdomain" },
      { status: 400 }
    );
  }

  try {
    const instructions = await (
      SUBREGISTRAR_MODE
        ? getCreateSubdomainForSubregistrarIxs
        : getCreateSubdomainIxs
    )({ subdomain, targetPublicKey });

    const txid = await sendAndConfirmTxWithRetry({
      instructions,
      maxRetry: 3,
      retryDelay: 2500,
    });

    return NextResponse.json({ success: true, txid });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: (e as Error).message },
      { status: 400 }
    );
  }
};
