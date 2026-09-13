/**
 * Author: Prem Singh
 * Purpose: Provide a Website-scoped R-CAPTAIN summary of customer quotes without exposing buyer PII.
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export interface QuotesSummary {
  website: {
    id: string;
    name: string;
    slug: string;
  };
  totals: {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    expired: number;
    cancelled: number;
  };
  recent: {
    last7Days: number;
    last30Days: number;
  };
  conversion: {
    acceptanceRatePercent: number;
    acceptedWithProforma: number;
    acceptedWithoutProforma: number;
  };
  readiness: {
    blockers: string[];
    warnings: string[];
  };
}

/**
 * Returns only aggregate quote information for the authenticated customer's Website.
 *
 * Security boundary:
 * customer auth -> tenant -> Website -> Inquiry-scoped Quotes.
 * No buyer contact information, addresses, payment information, or financial
 * credentials are returned to R-CAPTAIN.
 */
export async function getQuotesSummary(): Promise<QuotesSummary> {
  const context = await resolveRCaptainContext({ mode: "WORKSPACE" });

  if (!context.website || !context.tenant) {
    throw new Error("Workspace Website context is required.");
  }

  const websiteId = context.website.id;

  const quotes = await prisma.quote.findMany({
    where: {
      inquiry: {
        websiteId,
      },
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let draft = 0;
  let sent = 0;
  let accepted = 0;
  let rejected = 0;
  let expired = 0;
  let cancelled = 0;

  let last7Days = 0;
  let last30Days = 0;

  for (const quote of quotes) {
    switch (quote.status) {
      case "DRAFT":
        draft++;
        break;
      case "SENT":
        sent++;
        break;
      case "ACCEPTED":
        accepted++;
        break;
      case "REJECTED":
        rejected++;
        break;
      case "EXPIRED":
        expired++;
        break;
      case "CANCELLED":
        cancelled++;
        break;
      default:
        break;
    }

    if (quote.createdAt >= sevenDaysAgo) {
      last7Days++;
    }

    if (quote.createdAt >= thirtyDaysAgo) {
      last30Days++;
    }
  }

  const acceptedWithProformaIds =
    accepted > 0
      ? await prisma.proformaInvoice.findMany({
          where: {
            quote: {
              inquiry: {
                websiteId,
              },
              status: "ACCEPTED",
            },
          },
          select: {
            quoteId: true,
          },
        })
      : [];

  const acceptedWithProforma = new Set(
    acceptedWithProformaIds.map((item) => item.quoteId)
  ).size;

  const acceptanceRatePercent =
    quotes.length > 0
      ? Number(((accepted / quotes.length) * 100).toFixed(1))
      : 0;

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (accepted > acceptedWithProforma) {
    warnings.push(
      `${accepted - acceptedWithProforma} accepted quote(s) do not yet have a Proforma Invoice.`
    );
  }

  if (quotes.length === 0) {
    warnings.push("No quotes have been created for this Website yet.");
  }

  if (draft > 0) {
    warnings.push(`${draft} quote(s) are still in draft status.`);
  }

  if (sent > 0) {
    warnings.push(`${sent} quote(s) are currently awaiting buyer response.`);
  }

  return {
    website: {
      id: context.website.id,
      name: context.website.name,
      slug: context.website.slug,
    },
    totals: {
      total: quotes.length,
      draft,
      sent,
      accepted,
      rejected,
      expired,
      cancelled,
    },
    recent: {
      last7Days,
      last30Days,
    },
    conversion: {
      acceptanceRatePercent,
      acceptedWithProforma,
      acceptedWithoutProforma: accepted - acceptedWithProforma,
    },
    readiness: {
      blockers,
      warnings,
    },
  };
}
