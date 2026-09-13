/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Controlled Live Data
 * Module          : Inquiries Summary Tool
 *
 * Author          : Prem Singh
 * Purpose         : Provide R-CAPTAIN with a safe, Website-scoped
 *                   summary of buyer inquiries.
 *
 * Security:
 * • Workspace authentication is mandatory.
 * • All inquiry queries are scoped to the authenticated Website.
 * • Buyer PII is never returned to the AI context.
 * • No unrestricted inquiry records are exposed.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export type RCaptainInquiriesSummary = {
  websiteId: string;
  totals: {
    total: number;
    new: number;
    inProgress: number;
    quoted: number;
    converted: number;
    closed: number;
  };
  activity: {
    recent7Days: number;
    recent30Days: number;
  };
  followUp: {
    pending: number;
    overdue: number;
  };
  readiness: {
    hasInquiries: boolean;
    requiresAttention: boolean;
    blockers: string[];
    warnings: string[];
  };
};

export async function getInquiriesSummary(): Promise<RCaptainInquiriesSummary> {
  const context = await resolveRCaptainContext({
    mode: "WORKSPACE",
  });

  if (!context.website) {
    throw new Error(
      "Authenticated customer Website context is required."
    );
  }

  const websiteId = context.website.id;
  const now = new Date();

  const recent7Days = new Date(now);
  recent7Days.setDate(recent7Days.getDate() - 7);

  const recent30Days = new Date(now);
  recent30Days.setDate(recent30Days.getDate() - 30);

  /*
   * InquiryStatus in the current Prisma client is:
   * NEW, CONTACTED, QUOTATION_SENT, NEGOTIATION,
   * CONFIRMED, REJECTED.
   *
   * The R-CAPTAIN summary intentionally maps these into
   * higher-level workflow buckets.
   */
  const [
    total,
    newCount,
    contactedCount,
    negotiationCount,
    quoted,
    converted,
    closed,
    recent7DaysCount,
    recent30DaysCount,
  ] = await Promise.all([
    prisma.inquiry.count({
      where: { websiteId },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "NEW",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "CONTACTED",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "NEGOTIATION",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "QUOTATION_SENT",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "CONFIRMED",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: "REJECTED",
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        createdAt: {
          gte: recent7Days,
        },
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        createdAt: {
          gte: recent30Days,
        },
      },
    }),
  ]);

  const [pending, overdue] = await Promise.all([
    prisma.followUp.count({
      where: {
        inquiry: {
          websiteId,
        },
        status: "PENDING",
      },
    }),

    prisma.followUp.count({
      where: {
        inquiry: {
          websiteId,
        },
        status: "PENDING",
        dueAt: {
          lt: now,
        },
      },
    }),
  ]);

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (total === 0) {
    warnings.push(
      "No buyer inquiries have been received yet."
    );
  }

  if (newCount > 0) {
    warnings.push(
      `${newCount} new inquiry/inquiries require processing.`
    );
  }

  if (negotiationCount > 0) {
    warnings.push(
      `${negotiationCount} inquiry/inquiries are in negotiation.`
    );
  }

  if (overdue > 0) {
    warnings.push(
      `${overdue} follow-up(s) are overdue.`
    );
  }

  if (quoted > 0) {
    warnings.push(
      `${quoted} inquiry/inquiries have quotations sent.`
    );
  }

  return {
    websiteId,

    totals: {
      total,
      new: newCount,
      inProgress: contactedCount + negotiationCount,
      quoted,
      converted,
      closed,
    },

    activity: {
      recent7Days: recent7DaysCount,
      recent30Days: recent30DaysCount,
    },

    followUp: {
      pending,
      overdue,
    },

    readiness: {
      hasInquiries: total > 0,
      requiresAttention:
        newCount > 0 ||
        negotiationCount > 0 ||
        overdue > 0,
      blockers,
      warnings,
    },
  };
}
