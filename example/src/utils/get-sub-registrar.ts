import { CONNECTION } from "@/config";
import { getSnsDomainKeySync } from "@bonfida/spl-name-service";
import { Registrar } from "@bonfida/sub-register";

export const getSubRegistrar = async () => {
  const registrars = await Registrar.findForDomain(
    CONNECTION,
    getSnsDomainKeySync(process.env.NEXT_PUBLIC_DOMAIN_NAME!).pubkey,
  );
  if (registrars.length === 0) {
    throw new Error("Subdomain registrar not found");
  }

  return registrars[0];
};
