/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace API for retrieving, updating,
 *          and deleting Website-scoped Inquiries.
 *
 * Architecture:
 * - Customer Workspace authentication is mandatory.
 * - Website is derived from the authenticated Tenant.
 * - Inquiry ownership is enforced by the shared Inquiry
 *   management service.
 * - No Workspace-specific Inquiry records are created.
 * - Admin and Workspace operate on the same Inquiry record.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  deleteWorkspaceInquiry,
  getWorkspaceInquiryById,
  updateWorkspaceInquiry,
} from "@/app/lib/workspace/inquiries/inquiry-context.service";

import {
  InquiryPriority,
  InquiryStatus,
  SalesStage,
} from "@/lib/generated/prisma";

/**
 * ============================================================
 * GET /api/workspace/inquiries/[id]
 * ============================================================
 */

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const inquiry =
      await getWorkspaceInquiryById(id);

    return NextResponse.json({
      success: true,
      inquiry,
    });
  } catch (error) {
    console.error(
      "Workspace inquiry GET failed:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to load inquiry.";

    const status =
      message === "Inquiry not found."
        ? 404
        : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      },
    );
  }
}

/**
 * ============================================================
 * PUT /api/workspace/inquiries/[id]
 *
 * Updates the shared Inquiry record.
 *
 * Website ownership is resolved from the authenticated
 * Customer Workspace and is never accepted from the request.
 * ============================================================
 */

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    const body = await request.json();

    /**
     * --------------------------------------------------------
     * Only allow fields supported by the shared Inquiry
     * management service.
     * --------------------------------------------------------
     */

    const updateData: {
      companyName?: string;
      contactPerson?: string;
      email?: string;
      phone?: string | null;
      country?: string;
      product?: string;
      quantity?: string | null;
      unit?: string | null;
      message?: string;
      status?: InquiryStatus;
      priority?: InquiryPriority;
      source?: string | null;
      salesStage?: SalesStage;
    } = {};

    if (typeof body.companyName === "string") {
      updateData.companyName =
        body.companyName.trim();
    }

    if (typeof body.contactPerson === "string") {
      updateData.contactPerson =
        body.contactPerson.trim();
    }

    if (typeof body.email === "string") {
      updateData.email =
        body.email.trim();
    }

    if (
      body.phone === null ||
      typeof body.phone === "string"
    ) {
      updateData.phone =
        typeof body.phone === "string"
          ? body.phone.trim() || null
          : null;
    }

    if (typeof body.country === "string") {
      updateData.country =
        body.country.trim();
    }

    if (typeof body.product === "string") {
      updateData.product =
        body.product.trim();
    }

    if (
      body.quantity === null ||
      typeof body.quantity === "string"
    ) {
      updateData.quantity =
        typeof body.quantity === "string"
          ? body.quantity.trim() || null
          : null;
    }

    if (
      body.unit === null ||
      typeof body.unit === "string"
    ) {
      updateData.unit =
        typeof body.unit === "string"
          ? body.unit.trim() || null
          : null;
    }

    if (typeof body.message === "string") {
      updateData.message =
        body.message.trim();
    }

    if (typeof body.source === "string") {
      updateData.source =
        body.source.trim() || null;
    }

    /**
     * --------------------------------------------------------
     * Enum validation
     * --------------------------------------------------------
     */

    if (body.status !== undefined) {
      if (
        !Object.values(InquiryStatus).includes(
          body.status,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid inquiry status.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.status = body.status;
    }

    if (body.priority !== undefined) {
      if (
        !Object.values(InquiryPriority).includes(
          body.priority,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid inquiry priority.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.priority =
        body.priority;
    }

    if (body.salesStage !== undefined) {
      if (
        !Object.values(SalesStage).includes(
          body.salesStage,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid sales stage.",
          },
          {
            status: 400,
          },
        );
      }

      updateData.salesStage =
        body.salesStage;
    }

    const inquiry =
      await updateWorkspaceInquiry(
        id,
        updateData,
      );

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully.",
      inquiry,
    });
  } catch (error) {
    console.error(
      "Workspace inquiry PUT failed:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to update inquiry.";

    const status =
      message === "Inquiry not found."
        ? 404
        : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      },
    );
  }
}

/**
 * ============================================================
 * DELETE /api/workspace/inquiries/[id]
 *
 * Deletes the shared Inquiry record after enforcing Website
 * ownership through the Workspace adapter.
 * ============================================================
 */

export async function DELETE(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Inquiry ID is required.",
        },
        {
          status: 400,
        },
      );
    }

    await deleteWorkspaceInquiry(id);

    return NextResponse.json({
      success: true,
      message: "Inquiry deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Workspace inquiry DELETE failed:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to delete inquiry.";

    const status =
      message === "Inquiry not found."
        ? 404
        : 400;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      {
        status,
      },
    );
  }
}