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

export async function getDashboardData(): Promise<DashboardResponse> {

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


    getFollowUpIntelligence(),
    prisma.inquiry.count(),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.NEW,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.CONTACTED,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.QUOTATION_SENT,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.NEGOTIATION,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.CONFIRMED,
      },
    }),

    prisma.inquiry.count({
      where: {
        status: InquiryStatus.REJECTED,
      },
    }),

    prisma.inquiry.findMany({
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
    
    prisma.quote.aggregate({
      where: {
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
      },
    }),
    
    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.WHATSAPP,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
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
      },
    }),
    
    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.QUOTATION,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
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
      },
    }),
    
    prisma.followUp.count({
      where: {
        actionType: FollowUpActionType.MEETING,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
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
      },
    }),

  ]);

  const opportunityValue =
  quoteStatistics._sum.grandTotal ?? 0;

const highestRevenue =
  quoteStatistics._max.grandTotal ?? 0;

const currency = "USD";

const analyzedPriorityQueue = analyzePriorityQueue(priorityQueue);

const sortedPriorityQueue = analyzedPriorityQueue.sort((a, b) => {
  const revA = a.quotes.length > 0 ? Number(a.quotes[0].grandTotal.toString()) : 0;
  const revB = b.quotes.length > 0 ? Number(b.quotes[0].grandTotal.toString()) : 0;
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

const productivityAnalysis =
  analyzeProductivity(todaysMission);

  const productivity = buildProductivityScore(
    todaysMission,
    productivityAnalysis
  );

  const captainAnalysis = analyzeCaptain({
    pendingAttention: newInquiries + negotiationInquiries,
    negotiations: negotiationInquiries,
    productivityScore: productivity.score,
  });
  
  const captain = buildCaptain(captainAnalysis);

const businessHealthAnalysis = analyzeBusinessHealth({
  productivityScore: productivity.score,
  pendingAttention: newInquiries + negotiationInquiries,
  readyToClose: negotiationInquiries,
  goingCold: goingColdCount,
  confirmedDeals: confirmedInquiries,
});

const businessHealth = buildBusinessHealth(
  businessHealthAnalysis
);
  


return {
    dashboard: {
      counts: {
        total: totalInquiries,
        new: newInquiries,
        contacted: contactedInquiries,
        quotationSent: quotationSentInquiries,
        negotiation: negotiationInquiries,
        confirmed: confirmedInquiries,
        rejected: rejectedInquiries,
      },
  
      followUp,
  
      recentInquiries,
    },
  
    rCaptain: {
      morningBrief: {
        greeting: "Good Morning",
        pendingAttention: newInquiries + negotiationInquiries,
        quotationsExpiring: quotationSentInquiries,
        opportunityValue: `${currency} ${opportunityValue}`,
      },
  
      priorityQueue: buildPriorityQueue(sortedPriorityQueue),
  
      opportunityRadar: {
        readyToClose: negotiationInquiries,
        goingCold: goingColdCount,
        highestRevenue: `${currency} ${highestRevenue}`,
      },
  
todaysMission,

productivity,

businessHealth,

captain,
    },
  };
  ;
}