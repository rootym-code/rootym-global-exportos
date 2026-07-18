import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InquiryStatus } from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  const auth = await authenticateAdmin(request);

  if (!auth.authenticated) {
    return NextResponse.json(
      {
        success: false,
        message: auth.error,
      },
      {
        status: auth.status,
      }
    );
  }

  try {
    const [
      totalInquiries,
      newInquiries,
      contactedInquiries,
      quotationSentInquiries,
      negotiationInquiries,
      confirmedInquiries,
      rejectedInquiries,
      recentInquiries,
    ] = await Promise.all([
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
    ]);

    return NextResponse.json({
      success: true,
      admin: auth.admin,

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

        recentInquiries,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard.",
      },
      {
        status: 500,
      }
    );
  }
}