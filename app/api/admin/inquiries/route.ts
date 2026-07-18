import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import {
  InquiryPriority,
  InquiryStatus,
} from "@/lib/generated/prisma";

export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") ?? "1");
    const limit = Number(searchParams.get("limit") ?? "10");

    const search = searchParams.get("search") ?? "";
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const where: any = {};

    if (search) {
      where.OR = [
        {
          companyName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          contactPerson: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          inquiryNumber: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (
      status &&
      Object.values(InquiryStatus).includes(
        status as InquiryStatus
      )
    ) {
      where.status = status;
    }

    if (
      priority &&
      Object.values(InquiryPriority).includes(
        priority as InquiryPriority
      )
    ) {
      where.priority = priority;
    }

    const total = await prisma.inquiry.count({
      where,
    });

    const inquiries = await prisma.inquiry.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json({
      success: true,
      inquiries,
      pagination: {
        page,
        limit,
        totalRecords: total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}