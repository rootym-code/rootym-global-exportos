import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

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

    const notes = await prisma.inquiryNote.findMany({
      where: {
        inquiryId: id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      notes,
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

export async function POST(
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

    if (!body.note?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Note is required.",
        },
        {
          status: 400,
        }
      );
    }

    const inquiry = await prisma.inquiry.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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

    const note = await prisma.inquiryNote.create({
      data: {
        inquiryId: id,
        note: body.note.trim(),
        createdById: auth.admin.adminId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      note,
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