/**
 * Author: Prem Singh
 * Purpose: Provide a Website-scoped R-CAPTAIN summary of customer follow-ups without exposing buyer PII.
 */

import { prisma } from "@/lib/prisma";
import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";

export interface FollowUpsSummary {
  website: {
    id: string;
    name: string;
    slug: string;
  };
  totals: {
    total: number;
    pending: number;
    completed: number;
    rescheduled: number;
    closed: number;
  };
  attention: {
    overdue: number;
    dueToday: number;
    dueNext7Days: number;
  };
  recent: {
    last7Days: number;
    last30Days: number;
  };
  readiness: {
    blockers: string[];
    warnings: string[];
  };
}

/**
 * Returns only aggregate follow-up information for the authenticated
 * customer's Website.
 *
 * Security boundary:
 * customer auth -> tenant -> Website -> Inquiry -> FollowUps.
 * Buyer contact details and other PII are never returned.
 */
export async function getFollowUpsSummary(): Promise<FollowUpsSummary> {
  const context = await resolveRCaptainContext({ mode: "WORKSPACE" });

  if (!context.website || !context.tenant) {
    throw new Error("Workspace Website context is required.");
  }

  const websiteId = context.website.id;

  const followUps = await prisma.followUp.findMany({
    where: {
      inquiry: {
        websiteId,
      },
    },
    select: {
      id: true,
      status: true,
      dueAt: true,
      createdAt: true,
    },
    orderBy: {
      dueAt: "asc",
    },
  });

  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);

  const sevenDaysFromToday = new Date(endOfToday);
  sevenDaysFromToday.setDate(sevenDaysFromToday.getDate() + 7);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  let pending = 0;
  let completed = 0;
  let rescheduled = 0;
  let closed = 0;

  let overdue = 0;
  let dueToday = 0;
  let dueNext7Days = 0;

  let last7Days = 0;
  let last30Days = 0;

  for (const followUp of followUps) {
    switch (followUp.status) {
      case "PENDING":
        pending++;
        break;
      case "COMPLETED":
        completed++;
        break;
      case "RESCHEDULED":
        rescheduled++;
        break;
      case "CLOSED":
        closed++;
        break;
      default:
        break;
    }

    if (
      followUp.status === "PENDING" &&
      followUp.dueAt &&
      followUp.dueAt < now
    ) {
      overdue++;
    }

    if (
      followUp.status === "PENDING" &&
      followUp.dueAt &&
      followUp.dueAt >= startOfToday &&
      followUp.dueAt < endOfToday
    ) {
      dueToday++;
    }

    if (
      followUp.status === "PENDING" &&
      followUp.dueAt &&
      followUp.dueAt >= endOfToday &&
      followUp.dueAt < sevenDaysFromToday
    ) {
      dueNext7Days++;
    }

    if (followUp.createdAt >= sevenDaysAgo) {
      last7Days++;
    }

    if (followUp.createdAt >= thirtyDaysAgo) {
      last30Days++;
    }
  }

  const blockers: string[] = [];
  const warnings: string[] = [];

  if (overdue > 0) {
    warnings.push(
      `${overdue} follow-up(s) are overdue and require attention.`
    );
  }

  if (dueToday > 0) {
    warnings.push(
      `${dueToday} follow-up(s) are due today.`
    );
  }

  if (pending === 0 && followUps.length > 0) {
    warnings.push("There are no pending follow-ups currently scheduled.");
  }

  if (followUps.length === 0) {
    warnings.push("No follow-ups have been created for this Website yet.");
  }

  return {
    website: {
      id: context.website.id,
      name: context.website.name,
      slug: context.website.slug,
    },
    totals: {
      total: followUps.length,
      pending,
      completed,
      rescheduled,
      closed,
    },
    attention: {
      overdue,
      dueToday,
      dueNext7Days,
    },
    recent: {
      last7Days,
      last30Days,
    },
    readiness: {
      blockers,
      warnings,
    },
  };
}
