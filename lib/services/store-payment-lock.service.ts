
import type { Prisma } from "@/lib/generated/prisma";

/**
 * Serializes payment-environment changes and checkout order creation
 * for a single website.
 *
 * Must be called inside a Prisma interactive transaction.
 * PostgreSQL releases the lock automatically when the transaction ends.
 */
export async function acquireStorePaymentLock(
  tx: Prisma.TransactionClient,
  websiteId: string,
): Promise<void> {
  // Hash the website ID to a stable PostgreSQL advisory-lock key.
  // Hash collisions can serialize unrelated websites, but cannot bypass
  // the lock for the same website.
  await tx.$executeRaw`
    SELECT pg_advisory_xact_lock(
      hashtext('rootym-store-payment'),
      hashtext(${websiteId})
    )
  `;
}
