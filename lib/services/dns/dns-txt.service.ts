/**
 * ============================================================
 * ROOTYM DNS Services
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves DNS TXT records using the system resolver
 *          with a controlled public-DNS fallback for reliable
 *          domain verification.
 * ============================================================
 */

import { promises as dns } from "node:dns";

const DEFAULT_FALLBACK_SERVERS = [
  "1.1.1.1",
  "8.8.8.8",
];

function getFallbackServers(): string[] {
  const configured = process.env.ROOTYM_DNS_FALLBACK_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  return configured && configured.length > 0
    ? configured
    : DEFAULT_FALLBACK_SERVERS;
}

/**
 * Resolve a DNS TXT record.
 *
 * The system resolver is always attempted first. If that resolver
 * fails, a dedicated Resolver instance uses the configured fallback
 * DNS servers without changing the process-wide DNS configuration.
 */
export async function resolveTxtRecord(
  name: string,
): Promise<string[][]> {
  const normalizedName = name.trim().replace(/\.$/, "");

  if (!normalizedName) {
    throw new Error("DNS record name is required.");
  }

  try {
    return await dns.resolveTxt(normalizedName);
  } catch (systemResolverError) {
    const fallbackServers = getFallbackServers();

    try {
      const fallbackResolver = new dns.Resolver();

      fallbackResolver.setServers(fallbackServers);

      return await fallbackResolver.resolveTxt(normalizedName);
    } catch (fallbackResolverError) {
      const systemMessage =
        systemResolverError instanceof Error
          ? systemResolverError.message
          : String(systemResolverError);

      const fallbackMessage =
        fallbackResolverError instanceof Error
          ? fallbackResolverError.message
          : String(fallbackResolverError);

      throw new Error(
        `DNS TXT lookup failed using the system resolver (${systemMessage}) and fallback resolvers (${fallbackMessage}).`,
      );
    }
  }
}