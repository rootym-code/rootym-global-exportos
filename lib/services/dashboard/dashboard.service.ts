import prisma from "@/lib/prisma";
import { InquiryStatus } from "@/lib/generated/prisma";
import { DashboardResponse } from "./dashboard.types";
import { getFollowUpIntelligence } from "../intelligence/followup.engine";
import { buildPriorityQueue } from "./dashboard.presenter";

export async function getDashboardData(): Promise<DashboardResponse> {
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

      orderBy: [
        {
          priority: "desc",
        },
        {
          createdAt: "desc",
        },
      ],

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
      },
    }),
  ]);

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
        opportunityValue: "USD 34,000",
      },
  
      priorityQueue: buildPriorityQueue(priorityQueue),
  
      opportunityRadar: {
        readyToClose: negotiationInquiries,
        goingCold: 2,
        highestRevenue: "USD 34,000",
      },
  
      todaysMission: {
        calls: {
          completed: 0,
          total: 5,
        },
  
        whatsapp: {
          completed: 0,
          total: 3,
        },
  
        quotations: {
          completed: 0,
          total: quotationSentInquiries,
        },
  
        meetings: {
          completed: 0,
          total: 1,
        },
      },
  
      captain: {
        status: "Pipeline analyzed",
        lastUpdated: new Date().toISOString(),
      },
    },
  };
  ;
}