import prisma from "@/lib/prisma";

import { analyzeCaptain } from "./captain.engine";
import { buildCaptain } from "./captain.presenter";

import { analyzeBusinessHealth } from "./business-health.engine";
import { buildBusinessHealth } from "./business-health.presenter";

import {
  InquiryStatus,
  QuoteStatus,
  FollowUpActionType,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import { DashboardResponse } from "./dashboard.types";

import { getFollowUpIntelligence } from "../intelligence/followup.engine";

import {
  buildPriorityQueue,
  buildProductivityScore,
} from "./dashboard.presenter";

import { analyzePriorityQueue } from "./dashboard.engine";
import { analyzeProductivity } from "./productivity.engine";

/**
 * ============================================================
 * ROOTYM Admin Dashboard Service
 * ============================================================
 *
 * Optional tenantId allows the Admin Dashboard to operate in
 * either:
 *
 * 1. Global Admin mode
 *    getDashboardData()
 *
 * 2. Tenant-scoped Admin mode
 *    getDashboardData(tenantId)
 *
 * Tenant ownership is resolved through:
 *
 * Tenant
 *   ↓
 * Website
 *   ↓
 * Inquiry / Quote
 *   ↓
 * FollowUp
 *
 * Existing global behavior is preserved when tenantId is not
 * supplied.
 * ============================================================
 */

export async function getDashboardData(
  tenantId?: string,
): Promise<DashboardResponse> {
  const today = new Date();

  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  /**
   * ------------------------------------------------------------
   * Resolve Tenant → Website
   * ------------------------------------------------------------
   *
   * Website is the ownership boundary for inquiries, quotes,
   * products and related operational data.
   *
   * If a tenantId is explicitly supplied but the tenant has
   * no website, fail rather than accidentally returning global
   * data.
   * ------------------------------------------------------------
   */

  let websiteId: string | undefined;

  if (tenantId) {
    const tenant = await prisma.tenant.findUnique({
      where: {
        id: tenantId,
      },

      select: {
        id: true,

        website: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!tenant) {
      throw new Error(
        `Tenant not found: ${tenantId}`,
      );
    }

    if (!tenant.website) {
      throw new Error(
        `Tenant ${tenantId} does not have a website.`,
      );
    }

    websiteId = tenant.website.id;
  }

  /**
   * ------------------------------------------------------------
   * Website-scoped query helpers
   * ------------------------------------------------------------
   *
   * Inquiry directly owns websiteId.
   *
   * FollowUp and Quote inherit website ownership through
   * their related Inquiry.
   * ------------------------------------------------------------
   */

  const inquiryScope = websiteId
    ? {
        websiteId,
      }
    : {};

  const followUpScope = websiteId
    ? {
        inquiry: {
          websiteId,
        },
      }
    : {};

  const quoteScope = websiteId
    ? {
        inquiry: {
          websiteId,
        },
      }
    : {};

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
    /**
     * ----------------------------------------------------------
     * Follow-up Intelligence
     * ----------------------------------------------------------
     */

    getFollowUpIntelligence(websiteId),

    /**
     * ----------------------------------------------------------
     * Inquiry Counts
     * ----------------------------------------------------------
     */

    prisma.inquiry.count({
      where: {
        ...inquiryScope,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.NEW,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.CONTACTED,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.QUOTATION_SENT,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.NEGOTIATION,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.CONFIRMED,
      },
    }),

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

        status: InquiryStatus.REJECTED,
      },
    }),

    /**
     * ----------------------------------------------------------
     * Recent Inquiries
     * ----------------------------------------------------------
     */

    prisma.inquiry.findMany({
      where: {
        ...inquiryScope,
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

    /**
     * ----------------------------------------------------------
     * Priority Queue
     * ----------------------------------------------------------
     *
     * Active inquiries with their latest quote.
     * ----------------------------------------------------------
     */

    prisma.inquiry.findMany({
      where: {
        ...inquiryScope,

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

    /**
     * ----------------------------------------------------------
     * Quote Statistics
     * ----------------------------------------------------------
     */

    prisma.quote.aggregate({
      where: {
        ...quoteScope,

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

    /**
     * ----------------------------------------------------------
     * Going Cold
     * ----------------------------------------------------------
     *
     * Active inquiries that have not had a recent follow-up.
     * ----------------------------------------------------------
     */

    prisma.inquiry.count({
      where: {
        ...inquiryScope,

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
                    Date.now() -
                      10 *
                        24 *
                        60 *
                        60 *
                        1000,
                  ),
                },
              },

              {
                completedAt: {
                  gte: new Date(
                    Date.now() -
                      10 *
                        24 *
                        60 *
                        60 *
                        1000,
                  ),
                },
              },
            ],
          },
        },
      },
    }),

    /**
     * ----------------------------------------------------------
     * Today's Calls
     * ----------------------------------------------------------
     */

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.CALL,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.CALL,

        status:
          FollowUpStatus.COMPLETED,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    /**
     * ----------------------------------------------------------
     * Today's WhatsApp Activities
     * ----------------------------------------------------------
     */

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.WHATSAPP,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.WHATSAPP,

        status:
          FollowUpStatus.COMPLETED,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    /**
     * ----------------------------------------------------------
     * Today's Quotations
     * ----------------------------------------------------------
     */

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.QUOTATION,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.QUOTATION,

        status:
          FollowUpStatus.COMPLETED,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    /**
     * ----------------------------------------------------------
     * Today's Meetings
     * ----------------------------------------------------------
     */

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.MEETING,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),

    prisma.followUp.count({
      where: {
        ...followUpScope,

        actionType:
          FollowUpActionType.MEETING,

        status:
          FollowUpStatus.COMPLETED,

        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    }),
  ]);

  /**
   * ------------------------------------------------------------
   * Revenue / Opportunity Values
   * ------------------------------------------------------------
   */

  const opportunityValue =
    quoteStatistics._sum.grandTotal ?? 0;

  const highestRevenue =
    quoteStatistics._max.grandTotal ?? 0;

  const currency = "USD";

  /**
   * ------------------------------------------------------------
   * Priority Queue Analysis
   * ------------------------------------------------------------
   */

  const analyzedPriorityQueue =
    analyzePriorityQueue(priorityQueue);

  const sortedPriorityQueue =
    analyzedPriorityQueue.sort((a, b) => {
      const revA =
        a.quotes.length > 0
          ? Number(
              a.quotes[0].grandTotal.toString(),
            )
          : 0;

      const revB =
        b.quotes.length > 0
          ? Number(
              b.quotes[0].grandTotal.toString(),
            )
          : 0;

      return revB - revA;
    });

  /**
   * ------------------------------------------------------------
   * Today's Mission
   * ------------------------------------------------------------
   */

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

  /**
   * ------------------------------------------------------------
   * Productivity
   * ------------------------------------------------------------
   */

  const productivityAnalysis =
    analyzeProductivity(
      todaysMission,
    );

  const productivity =
    buildProductivityScore(
      todaysMission,
      productivityAnalysis,
    );

  /**
   * ------------------------------------------------------------
   * R-CAPTAIN
   * ------------------------------------------------------------
   */

  const captainAnalysis =
    analyzeCaptain({
      pendingAttention:
        newInquiries +
        negotiationInquiries,

      negotiations:
        negotiationInquiries,

      productivityScore:
        productivity.score,
    });

  const captain =
    buildCaptain(captainAnalysis);

  /**
   * ------------------------------------------------------------
   * Business Health
   * ------------------------------------------------------------
   */

  const businessHealthAnalysis =
    analyzeBusinessHealth({
      productivityScore:
        productivity.score,

      pendingAttention:
        newInquiries +
        negotiationInquiries,

      readyToClose:
        negotiationInquiries,

      goingCold:
        goingColdCount,

      confirmedDeals:
        confirmedInquiries,
    });

  const businessHealth =
    buildBusinessHealth(
      businessHealthAnalysis,
    );

  /**
   * ------------------------------------------------------------
   * Final Dashboard Response
   * ------------------------------------------------------------
   */

  return {
    dashboard: {
      counts: {
        total: totalInquiries,
        new: newInquiries,
        contacted: contactedInquiries,
        quotationSent:
          quotationSentInquiries,
        negotiation:
          negotiationInquiries,
        confirmed:
          confirmedInquiries,
        rejected:
          rejectedInquiries,
      },

      followUp,

      recentInquiries,
    },

    rCaptain: {
      morningBrief: {
        greeting: "Good Morning",

        pendingAttention:
          newInquiries +
          negotiationInquiries,

        quotationsExpiring:
          quotationSentInquiries,

        opportunityValue:
          `${currency} ${opportunityValue}`,
      },

      priorityQueue:
        buildPriorityQueue(
          sortedPriorityQueue,
        ),

      opportunityRadar: {
        readyToClose:
          negotiationInquiries,

        goingCold:
          goingColdCount,

        highestRevenue:
          `${currency} ${highestRevenue}`,
      },

      todaysMission,

      productivity,

      businessHealth,

      captain,
    },
  };
}