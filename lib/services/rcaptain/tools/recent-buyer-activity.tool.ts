/**
 * ============================================================
 * Author          : Prem Singh
 * Purpose         : Provide a Website-scoped, privacy-safe
 *                   summary of recent buyer activity for
 *                   R-CAPTAIN without exposing internal IDs.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export interface RecentBuyerActivityItem {
  type:
    | "INQUIRY_CREATED"
    | "INQUIRY_UPDATED"
    | "QUOTE_CREATED"
    | "FOLLOWUP_CREATED";
  occurredAt: Date;
  inquiryStatus?: string;
  salesStage?: string | null;
}

export interface RecentBuyerActivitySummary {
  website: { id: string; name: string; slug: string };
  windowDays: number;
  totalEvents: number;
  counts: {
    inquiriesCreated: number;
    inquiriesUpdated: number;
    quotesCreated: number;
    followUpsCreated: number;
  };
  recentActivity: RecentBuyerActivityItem[];
  readiness: { blockers: string[]; warnings: string[] };
}

export async function getRecentBuyerActivity(
  windowDays = 7,
  limit = 20
): Promise<RecentBuyerActivitySummary> {
  const context = await resolveRCaptainContext({ mode: "WORKSPACE" });
  if (!context.website || !context.tenant) {
    throw new Error("Workspace Website context is required.");
  }

  const websiteId = context.website.id;
  const safeWindowDays = Math.min(Math.max(Math.floor(windowDays), 1), 30);
  const safeLimit = Math.min(Math.max(Math.floor(limit), 1), 50);
  const since = new Date();
  since.setDate(since.getDate() - safeWindowDays);

  const inquiries = await prisma.inquiry.findMany({
    where: { websiteId, createdAt: { gte: since } },
    select: { createdAt: true, updatedAt: true, status: true, salesStage: true },
    orderBy: { updatedAt: "desc" },
    take: safeLimit,
  });

  const quotes = await prisma.quote.findMany({
    where: { inquiry: { websiteId }, createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });

  const followUps = await prisma.followUp.findMany({
    where: { inquiry: { websiteId }, createdAt: { gte: since } },
    select: { createdAt: true },
    orderBy: { createdAt: "desc" },
    take: safeLimit,
  });

  const events: RecentBuyerActivityItem[] = [];
  let inquiriesCreated = 0;
  let inquiriesUpdated = 0;

  for (const inquiry of inquiries) {
    inquiriesCreated++;
    events.push({
      type: "INQUIRY_CREATED",
      occurredAt: inquiry.createdAt,
      inquiryStatus: inquiry.status,
      salesStage: inquiry.salesStage,
    });

    if (inquiry.updatedAt > inquiry.createdAt) {
      inquiriesUpdated++;
      events.push({
        type: "INQUIRY_UPDATED",
        occurredAt: inquiry.updatedAt,
        inquiryStatus: inquiry.status,
        salesStage: inquiry.salesStage,
      });
    }
  }

  for (const quote of quotes) {
    events.push({ type: "QUOTE_CREATED", occurredAt: quote.createdAt });
  }

  for (const followUp of followUps) {
    events.push({ type: "FOLLOWUP_CREATED", occurredAt: followUp.createdAt });
  }

  events.sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime());
  const recentActivity = events.slice(0, safeLimit);
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (recentActivity.length === 0) {
    warnings.push(`No buyer activity was recorded in the last ${safeWindowDays} day(s).`);
  }

  if (inquiriesCreated > 0 && quotes.length === 0) {
    warnings.push("Recent inquiries do not yet have newly created quotes in this activity window.");
  }

  return {
    website: {
      id: context.website.id,
      name: context.website.name,
      slug: context.website.slug,
    },
    windowDays: safeWindowDays,
    totalEvents: recentActivity.length,
    counts: {
      inquiriesCreated,
      inquiriesUpdated,
      quotesCreated: quotes.length,
      followUpsCreated: followUps.length,
    },
    recentActivity,
    readiness: { blockers, warnings },
  };
}
