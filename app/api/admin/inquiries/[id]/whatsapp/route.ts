/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : WhatsApp Approval Workflow Foundation
 *
 * Module          : Admin WhatsApp API
 *
 * Description
 * ------------------------------------------------------------
 * Handles WhatsApp message drafts linked to inquiries.
 *
 * Responsibilities:
 *
 * • Create WhatsApp draft
 * • Fetch WhatsApp history
 * • Maintain approval workflow foundation
 *
 * Meta WhatsApp API integration
 * will be added in later sprint.
 *
 * ============================================================
 */


import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  
  import prisma from "@/lib/prisma";
  
  import whatsappService from "@/lib/services/communication/whatsapp.service";

  import {
    authenticateAdmin,
  } from "@/lib/auth";
  
  
  import {
    WhatsAppMessageStatus,
  } from "@/lib/generated/prisma";
  
  
  
  interface RouteContext {
  
    params: Promise<{
      id: string;
    }>;
  
  }
  
  
  
  /**
   * GET
   *
   * Fetch WhatsApp messages
   * for an inquiry
   */
  export async function GET(
    request: NextRequest,
    context: RouteContext
  ) {
  
    try {
  
  
      const auth =
        await authenticateAdmin(request);
  
  
  
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
  
  
  
      const {
        id,
      } = await context.params;
  
  
  
const messages =
  await whatsappService.getMessages(id);
  
  
  
      return NextResponse.json({
  
        success: true,
  
        messages,
  
      });
  
  
  
    } catch (error) {
  
  
      console.error(
        "WhatsApp GET Error:",
        error
      );
  
  
      return NextResponse.json(
  
        {
          success:false,
          message:
            "Internal Server Error",
        },
  
        {
          status:500,
        }
  
      );
  
    }
  
  }
  
  
  
  
  
  
  /**
   * POST
   *
   * Create WhatsApp draft
   */
  export async function POST(
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
            success:false,
            message:auth.error,
          },
          {
            status:auth.status,
          }
        );
  
  
      }
  
  
  
  
      const {
        id,
      } = await context.params;
  
  
  
      const body =
        await request.json();
  
  
  
      if (
        !body.message ||
        !body.message.trim()
      ) {
  
  
        return NextResponse.json(
          {
            success:false,
            message:
              "Message is required.",
          },
          {
            status:400,
          }
        );
  
  
      }
  
  
  
  
      const whatsappMessage =
      await whatsappService.createDraft(
        id,
        body.message
      );
  
  
  
  
  
      return NextResponse.json({
  
        success:true,
  
        message:
          whatsappMessage,
  
      });
  
  
  
    } catch(error){
  
  
      console.error(
        "WhatsApp POST Error:",
        error
      );
  
  
      return NextResponse.json(
  
        {
          success:false,
          message:
            "Internal Server Error",
        },
  
        {
          status:500,
        }
  
      );
  
  
    }
  
  }