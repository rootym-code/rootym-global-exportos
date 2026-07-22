/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : WhatsApp Approval Workflow
 *
 * Module          : WhatsApp Message Approval API
 *
 * Description
 * ------------------------------------------------------------
 * Handles admin approval and rejection of WhatsApp drafts.
 *
 * Responsibilities:
 *
 * • Approve WhatsApp draft
 * • Reject WhatsApp draft
 * • Store approval audit information
 *
 * Meta WhatsApp sending will be added later.
 *
 * ============================================================
 */

import {
  NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";

import {
  authenticateAdmin,
} from "@/lib/auth";

import {
  WhatsAppMessageStatus,
} from "@/lib/generated/prisma";

interface RouteContext {

  params: Promise<{
    id: string;
    messageId: string;
  }>;

}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {

  try {

    const auth =
      await authenticateAdmin(request);

    if (
      !auth.authenticated ||
      !auth.admin
    ) {

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

    const {
      id,
      messageId,
    } = await context.params;

    const body =
      await request.json();

    const action =
      body.action;

    if (
      ![
        "APPROVE",
        "REJECT",
      ].includes(action)
    ) {

      return NextResponse.json(
        {
          success: false,
          message: "Invalid action.",
        },
        {
          status: 400,
        }
      );

    }

    const whatsappMessage =
      await prisma.whatsAppMessage.findUnique({

        where: {
          id: messageId,
        },

      });

    if (!whatsappMessage) {

      return NextResponse.json(
        {
          success: false,
          message:
            "WhatsApp message not found.",
        },
        {
          status: 404,
        }
      );

    }

    const status:
      WhatsAppMessageStatus =
        action === "APPROVE"
          ? WhatsAppMessageStatus.APPROVED
          : WhatsAppMessageStatus.REJECTED;

    /**
     * Resolve the authenticated admin
     * from the database.
     *
     * We intentionally use email instead
     * of auth.admin.adminId because the
     * JWT may contain an older ID while
     * the database record has changed.
     */

    const realAdmin =
    await prisma.admin.findUnique({
  
      where: {
        email: auth.admin.email,
      },
  
      select: {
        id: true,
        email: true,
      },
  
    });
  
  
  console.log(
    "================================="
  );
  

  console.log("AUTH ADMIN:", auth.admin);



  
  console.log(
    "================================="
  );
  
  
  if (!realAdmin) {
  
    return NextResponse.json(
      {
        success: false,
        message:
          "Admin record not found.",
      },
      {
        status: 404,
      }
    );
  
  }




    const updated =
    await prisma.whatsAppMessage.update({

      where: {

        id: messageId,

      },

      data: {
        status,
      
        approvedBy:
          action === "APPROVE"
            ? realAdmin.id
            : null,
      
        approvedAt:
          action === "APPROVE"
            ? new Date()
            : null,
      },

    });

  return NextResponse.json({

    success: true,

    message: updated,

  });

} catch (error) {

  console.error(
    "WhatsApp approval error:",
    error
  );

  return NextResponse.json(
    {
      success: false,
      message:
        "Internal Server Error",
    },
    {
      status: 500,
    }
  );

}

}

// END OF FILE