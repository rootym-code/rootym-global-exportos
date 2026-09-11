/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Website-scoped R-CAPTAIN intelligence for
 *          the authenticated Customer Workspace.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import {
  FollowUpActionType,
  FollowUpStatus,
  InquiryStatus,
  QuoteStatus,
} from "@/lib/generated/prisma";

import { requireWorkspaceWebsite } from "../website/website-context.service";

import type {
  FollowUpIntelligence,
  Recommendation,
} from "@/lib/services/intelligence/intelligence.types";

import type { RCaptainData } from "@/lib/services/dashboard/dashboard.types";

import {
  buildPriorityQueue,
  buildProductivityScore,
} from "@/lib/services/dashboard/dashboard.presenter";

import { analyzePriorityQueue } from "@/lib/services/dashboard/dashboard.engine";
import { analyzeProductivity } from "@/lib/services/dashboard/productivity.engine";
import { analyzeCaptain } from "@/lib/services/dashboard/captain.engine";
import { buildCaptain } from "@/lib/services/dashboard/captain.presenter";
import { analyzeBusinessHealth } from "@/lib/services/dashboard/business-health.engine";
import { buildBusinessHealth } from "@/lib/services/dashboard/business-health.presenter";

/**
 * Builds the complete R-CAPTAIN payload for the authenticated
 * Customer Workspace.
 *
 * Security boundary:
 * - Website identity comes only from requireWorkspaceWebsite().
 * - Inquiry queries are restricted by websiteId.
 * - Quote queries are restricted by websiteId.
 * - FollowUp queries are restricted through inquiry.websiteId.
 * - No client-supplied websiteId is accepted.
 */
export async function getWorkspaceRCaptainData(): Promise<RCaptainData> {
  const { website } = await requireWorkspaceWebsite();
  const websiteId = website.id;

  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const [
    followUp,
    totalInquiries,
    newInquiries,
    contactedInquiries,
    quotationSentInquiries,
    negotiationInquiries,
    confirmedInquiries,
    rejectedInquiries,
    recentInquiries,
    priorityQueue,
    quoteStatistics,
    goingColdCount,
    todayCalls,
    completedCalls,
    todayWhatsApp,
    completedWhatsApp,
    todayQuotations,
    completedQuotations,
    todayMeetings,
    completedMeetings,
  ] = await Promise.all([
    getWorkspaceFollowUpIntelligence(websiteId),

    prisma.inquiry.count({
      where: {
        websiteId,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.NEW,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.CONTACTED,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.QUOTATION_SENT,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.NEGOTIATION,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.CONFIRMED,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: InquiryStatus.REJECTED,
      },
    }),

    prisma.inquiry.findMany({
      where: {
        websiteId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
      select: {
        id: true,
        inquiryNumber: true,
        companyName: true,
        contactPerson: true,
        country: true,
        product: true,
        status: true,
        priority: true,
        createdAt: true,
      },
    }),

    prisma.inquiry.findMany({
      where: {
        websiteId,
        status: {
          notIn: [
            InquiryStatus.CONFIRMED,
            InquiryStatus.REJECTED,
          ],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        inquiryNumber: true,
        companyName: true,
        country: true,
        product: true,
        status: true,
        priority: true,
        createdAt: true,
        quotes: {
          where: {
            websiteId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            currency: true,
            grandTotal: true,
            createdAt: true,
          },
        },
      },
    }),

    prisma.quote.aggregate({
      where: {
        websiteId,
        status: {
          in: [
            QuoteStatus.SENT,
            QuoteStatus.ACCEPTED,
          ],
        },
      },
      _sum: {
        grandTotal: true,
      },
      _max: {
        grandTotal: true,
      },
    }),

    prisma.inquiry.count({
      where: {
        websiteId,
        status: {
          notIn: [
            InquiryStatus.CONFIRMED,
            InquiryStatus.REJECTED,
          ],
        },
        followUps: {
          none: {
            OR: [
              {
                scheduledAt: {
                  gte: new Date(
                    Date.now() - 10 * 24 * 60 * 60 * 1000
                  ),
                },
              },
              {
                completedAt: {
                  gte: new Date(
                    Date.now() - 10 * 24 * 60 * 60 * 1000
                  ),
                },
              },
            ],
          },
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.CALL,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.CALL,
        status: FollowUpStatus.COMPLETED,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.WHATSAPP,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.WHATSAPP,
        status: FollowUpStatus.COMPLETED,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.QUOTATION,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.QUOTATION,
        status: FollowUpStatus.COMPLETED,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.MEETING,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.MEETING,
        status: FollowUpStatus.COMPLETED,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        inquiry: {
          websiteId,
        },
      },
    }),
  ]);

  const opportunityValue = quoteStatistics._sum.grandTotal ?? 0;
  const highestRevenue = quoteStatistics._max.grandTotal ?? 0;
  const currency = "USD";

  const analyzedPriorityQueue = analyzePriorityQueue(priorityQueue);

  const sortedPriorityQueue = analyzedPriorityQueue.sort((a, b) => {
    const revA =
      a.quotes.length > 0
        ? Number(a.quotes[0].grandTotal.toString())
        : 0;

    const revB =
      b.quotes.length > 0
        ? Number(b.quotes[0].grandTotal.toString())
        : 0;

    return revB - revA;
  });

  const todaysMission = {
    calls: {
      completed: completedCalls,
      total: todayCalls,
    },

    whatsapp: {
      completed: completedWhatsApp,
      total: todayWhatsApp,
    },

    quotations: {
      completed: completedQuotations,
      total: todayQuotations,
    },

    meetings: {
      completed: completedMeetings,
      total: todayMeetings,
    },
  };

  const productivityAnalysis = analyzeProductivity(
    todaysMission
  );

  const productivity = buildProductivityScore(
    todaysMission,
    productivityAnalysis
  );

  const captainAnalysis = analyzeCaptain({
    pendingAttention:
      newInquiries + negotiationInquiries,
    negotiations: negotiationInquiries,
    productivityScore: productivity.score,
  });

  const captain = buildCaptain(captainAnalysis);

  const businessHealthAnalysis = analyzeBusinessHealth({
    productivityScore: productivity.score,
    pendingAttention:
      newInquiries + negotiationInquiries,
    readyToClose: negotiationInquiries,
    goingCold: goingColdCount,
    confirmedDeals: confirmedInquiries,
  });

  const businessHealth = buildBusinessHealth(
    businessHealthAnalysis
  );

  return {
    morningBrief: {
      greeting: "Good Morning",
      pendingAttention:
        newInquiries + negotiationInquiries,
      quotationsExpiring: quotationSentInquiries,
      opportunityValue: `${currency} ${opportunityValue}`,
    },

    priorityQueue: buildPriorityQueue(
      sortedPriorityQueue
    ),

    opportunityRadar: {
      readyToClose: negotiationInquiries,
      goingCold: goingColdCount,
      highestRevenue: `${currency} ${highestRevenue}`,
    },

    todaysMission,

    productivity,

    businessHealth,

    captain,
  };
}

/**
 * Website-scoped equivalent of the Admin Follow-Up Intelligence
 * calculation. The Admin engine remains unchanged.
 */
async function getWorkspaceFollowUpIntelligence(
  websiteId: string
): Promise<FollowUpIntelligence> {
  const now = new Date();
  const todayStart = startOfToday();
  const tomorrowStart = startOfTomorrow();

  const [
    overdue,
    dueToday,
    upcoming,
    urgent,
    completedToday,
  ] = await Promise.all([
    prisma.followUp.count({
      where: {
        dueAt: {
          not: null,
          lt: now,
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        dueAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        dueAt: {
          gte: tomorrowStart,
        },
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        priority: "URGENT",
        status: {
          notIn: [
            FollowUpStatus.COMPLETED,
            FollowUpStatus.CLOSED,
          ],
        },
        inquiry: {
          websiteId,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        completedAt: {
          gte: todayStart,
          lt: tomorrowStart,
        },
        inquiry: {
          websiteId,
        },
      },
    }),
  ]);

  const recommendations: Recommendation[] = [];

  if (overdue > 0) {
    recommendations.push({
      priority: "CRITICAL",
      title: "Overdue Follow-ups",
      description: `${overdue} follow-up(s) are overdue.`,
      action:
        "Review and contact the overdue buyers immediately.",
    });
  }

  if (urgent > 0) {
    recommendations.push({
      priority: "HIGH",
      title: "Urgent Follow-ups",
      description: `${urgent} urgent follow-up(s) require attention.`,
      action:
        "Prioritize urgent follow-ups before other activities.",
    });
  }

  if (dueToday > 0) {
    recommendations.push({
      priority: "MEDIUM",
      title: "Today's Schedule",
      description: `${dueToday} follow-up(s) are due today.`,
      action:
        "Complete today's scheduled follow-ups.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      priority: "LOW",
      title: "Everything is on track",
      description:
        "There are no urgent follow-up actions pending.",
      action:
        "Continue with planned customer engagement.",
    });
  }

  return {
    overdue,
    dueToday,
    upcoming,
    urgent,
    completedToday,
    assignedToMe: 0,
    recommendations,
  };
}

function startOfToday(): Date {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfTomorrow(): Date {
  const date = startOfToday();
  date.setDate(date.getDate() + 1);
  return date;
}

export default getWorkspaceRCaptainData;
