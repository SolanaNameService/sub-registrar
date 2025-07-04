import { Language, findLang } from "@bonfida/emojis";

/**
 * Checks if a subdomain name is valid
 * @param string Subdomain name
 * @returns boolean indicating if subdomain is valid
 */
export const isValidSubdomain = (subdomain: string) => {
  if (subdomain.includes(".")) {
    return false;
  }

  return findLang(subdomain) !== Language.Unauthorized;
};
