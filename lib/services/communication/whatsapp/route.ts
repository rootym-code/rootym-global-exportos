/**
 * ============================================================================
 * ROOTYM GLOBAL EXPORT PLATFORM
 * ============================================================================
 * File: app/api/admin/communication/whatsapp/route.ts
 * Module: Admin Communication API
 *
 * Description:
 * Thin API route for WhatsApp communication management.
 *
 * Responsibilities:
 * - Authenticate administrator
 * - Retrieve WhatsApp messages for an inquiry
 * - Create WhatsApp draft messages
 * - Delegate business logic to WhatsAppService
 *
 * Architecture:
 * Admin UI
 *      │
 *      ▼
 * API Route (this file)
 *      │
 *      ▼
 * WhatsAppService
 *      │
 *      ▼
 * Prisma
 * ============================================================================
 */

import { NextRequest } from "next/server";

import ApiResponse from "@/lib/api/api-response";
import handleApiError from "@/lib/api/handle-api-error";

import { authenticateAdmin } from "@/lib/auth";

import whatsappService from "@/lib/services/communication/whatsapp.service";

/**
 * ---------------------------------------------------------------------------
 * GET
 * ---------------------------------------------------------------------------
 * Returns all WhatsApp messages associated with an inquiry.
 *
 * Query Parameters:
 *   inquiryId=<Inquiry ID>
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        status: 401,
      });
    }

    const inquiryId = request.nextUrl.searchParams.get("inquiryId")?.trim();

    if (!inquiryId) {
      return ApiResponse.error({
        message: "Inquiry ID is required.",
        status: 400,
      });
    }

    const messages = await whatsappService.getMessages(inquiryId);

    return ApiResponse.success({
      message: "WhatsApp messages retrieved successfully.",
      data: messages,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * ---------------------------------------------------------------------------
 * POST
 * ---------------------------------------------------------------------------
 * Creates a new WhatsApp draft.
 *
 * Request Body:
 * {
 *   inquiryId: string;
 *   message: string;
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateAdmin(request);

    if (!auth.authenticated) {
      return ApiResponse.error({
        message: auth.error ?? "Unauthorized.",
        status: 401,
      });
    }

    const body = await request.json();

    const inquiryId =
      typeof body?.inquiryId === "string"
        ? body.inquiryId.trim()
        : "";

    const message =
      typeof body?.message === "string"
        ? body.message.trim()
        : "";

    if (!inquiryId) {
      return ApiResponse.error({
        message: "Inquiry ID is required.",
        status: 400,
      });
    }

    if (!message) {
      return ApiResponse.error({
        message: "Message is required.",
        status: 400,
      });
    }

    const draft = await whatsappService.createDraft(
      inquiryId,
      message,
    );

    return ApiResponse.success({
      message: "WhatsApp draft created successfully.",
      data: draft,
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

// END OF FILE