/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace Proforma Invoice creation endpoint
 *          for an approved quotation. Enforces Website ownership
 *          before delegating to the shared commercial adapter.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { createWorkspaceInquiryProformaInvoice } from "@/app/lib/workspace/inquiries/workspace-commercial-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const proformaInvoice =
      await createWorkspaceInquiryProformaInvoice(id);

    return NextResponse.json(
      {
        success: true,
        message:
          "Proforma Invoice created successfully.",
        proformaInvoice,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/workspace/quotes/[id]/proforma",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create Proforma Invoice.";

    let status = 500;

    if (
      message === "Quote not found." ||
      message === "Inquiry not found."
    ) {
      status = 404;
    }

    if (
      message.startsWith(
        "A Proforma Invoice can only be created",
      )
    ) {
      status = 400;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
