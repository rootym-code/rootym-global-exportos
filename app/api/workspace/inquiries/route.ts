/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace API for listing and creating
 *          Website-scoped Inquiries.
 *
 * Architecture:
 * - Customer Workspace authentication is mandatory.
 * - Website is derived from the authenticated Tenant.
 * - Inquiry creation uses the existing shared Inquiry creation
 *   workflow so automatic FollowUp creation is preserved.
 * - Inquiry listing uses the shared Website-scoped management
 *   service.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  listWorkspaceInquiries,
} from "@/app/lib/workspace/inquiries/inquiry-context.service";

import {
  createInquiry,
} from "@/lib/services/inquiry.service";

import {
  inquirySchema,
} from "@/lib/validations/inquiry";

import {
  requireWorkspaceWebsite,
} from "@/app/lib/workspace/website/website-context.service";

/**
 * ============================================================
 * Workspace authentication error handling
 * ============================================================
 *
 * requireWorkspaceAccess() is intentionally page-oriented and
 * uses redirect() when the customer session is missing/invalid.
 * API routes must not convert that NEXT_REDIRECT control-flow
 * signal into a generic HTTP 500.
 *
 * Return a normal 401 response so the browser can handle the
 * authentication failure correctly.
 * ============================================================
 */
function isWorkspaceAuthRedirect(error: unknown): boolean {
  return (
    error instanceof Error &&
    "digest" in error &&
    typeof error.digest === "string" &&
    error.digest.startsWith("NEXT_REDIRECT")
  );
}

/**
 * ============================================================
 * GET /api/workspace/inquiries
 * ============================================================
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(
      request.url,
    );

    const page = Math.max(
      1,
      Number(searchParams.get("page") ?? "1") || 1,
    );

    const pageSize = Math.min(
      100,
      Math.max(
        1,
        Number(searchParams.get("pageSize") ?? "20") || 20,
      ),
    );

    const search =
      searchParams.get("search")?.trim() || undefined;

    const status =
      searchParams.get("status")?.trim() || undefined;

    const priority =
      searchParams.get("priority")?.trim() || undefined;

    const salesStage =
      searchParams.get("salesStage")?.trim() || undefined;

    const country =
      searchParams.get("country")?.trim() || undefined;

    const result = await listWorkspaceInquiries({
      search,
      status: status as never,
      priority: priority as never,
      salesStage: salesStage as never,
      country,
      page,
      pageSize,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    if (isWorkspaceAuthRedirect(error)) {
      console.warn(
        "Workspace inquiries GET rejected: customer authentication required.",
      );

      return NextResponse.json(
        {
          success: false,
          message: "Customer Workspace authentication required.",
          code: "AUTHENTICATION_REQUIRED",
        },
        {
          status: 401,
        },
      );
    }

    console.error(
      "Workspace inquiries GET failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load inquiries.",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * ============================================================
 * POST /api/workspace/inquiries
 *
 * Uses the existing Inquiry creation service.
 *
 * This is important because inquiry.service.ts owns the existing
 * automatic FollowUp workflow and inquiry-number generation.
 * ============================================================
 */
export async function POST(request: NextRequest) {
  try {
    const context =
      await requireWorkspaceWebsite();

    const body = await request.json();

    const parsed = inquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid inquiry data.",
          errors: parsed.error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    /**
     * --------------------------------------------------------
     * Workspace owns the Website.
     *
     * Do not allow the browser to select another Website.
     * --------------------------------------------------------
     */
    const input = {
      ...parsed.data,
      websiteId: context.website.id,
    };

    /**
     * --------------------------------------------------------
     * Preserve existing Inquiry creation workflow.
     *
     * This continues to:
     * - generate the Inquiry number
     * - validate Product relationship
     * - persist the Inquiry
     * - create the automatic FollowUp
     * --------------------------------------------------------
     */
    const inquiry = await createInquiry(
      input,
      {},
    );

    return NextResponse.json(
      {
        success: true,
        inquiry,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (isWorkspaceAuthRedirect(error)) {
      console.warn(
        "Workspace inquiries POST rejected: customer authentication required.",
      );

      return NextResponse.json(
        {
          success: false,
          message: "Customer Workspace authentication required.",
          code: "AUTHENTICATION_REQUIRED",
        },
        {
          status: 401,
        },
      );
    }

    console.error(
      "Workspace inquiries POST failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create inquiry.",
      },
      {
        status: 500,
      },
    );
  }
}
