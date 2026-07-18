import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";
import {
  InquiryPriority,
  InquiryStatus,
} from "@/lib/generated/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id,
      },
      include: {
        notes: {
          include: {
            createdBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },

        statusHistory: {
          include: {
            changedBy: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      inquiry,
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated || !auth.admin) {
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

    const { id } = await params;

    const body = await request.json();

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id,
      },
    });

    if (!inquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry not found.",
        },
        {
          status: 404,
        }
      );
    }

    const updateData: {
      status?: InquiryStatus;
      priority?: InquiryPriority;
    } = {};
    
    const adminId = auth.admin.adminId;

    if (
      body.status &&
      Object.values(InquiryStatus).includes(body.status)
    ) {
      updateData.status = body.status;
    }

    if (
      body.priority &&
      Object.values(InquiryPriority).includes(body.priority)
    ) {
      updateData.priority = body.priority;
    }

    const updated = await prisma.$transaction(
      async (tx) => {
        const inquiryUpdated = await tx.inquiry.update({
          where: {
            id,
          },
          data: updateData,
        });

        if (
          updateData.status &&
          updateData.status !== inquiry.status
        ) {
          await tx.inquiryStatusHistory.create({
            data: {
              inquiryId: inquiry.id,
              oldStatus: inquiry.status,
              newStatus: updateData.status,
              changedById: adminId,
            },
          });
        }

        return inquiryUpdated;
      }
    );

    return NextResponse.json({
      success: true,
      inquiry: updated,
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