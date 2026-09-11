/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Customer Workspace quotation creation endpoint for
 *          an Inquiry. Delegates to the shared Quote business
 *          service after enforcing Website ownership.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import {
  createWorkspaceInquiryQuote,
  type WorkspaceQuoteInput,
} from "@/app/lib/workspace/inquiries/workspace-commercial-context.service";

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
    const body = (await request.json()) as Partial<WorkspaceQuoteInput>;

    if (!body.companyName?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Company name is required.",
        },
        { status: 400 },
      );
    }

    if (!body.contactPerson?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Contact person is required.",
        },
        { status: 400 },
      );
    }

    if (!body.email?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        { status: 400 },
      );
    }

    if (!body.country?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Country is required.",
        },
        { status: 400 },
      );
    }

    if (!body.currency?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Currency is required.",
        },
        { status: 400 },
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one quotation item is required.",
        },
        { status: 400 },
      );
    }

    const input: WorkspaceQuoteInput = {
      companyName: body.companyName.trim(),
      contactPerson: body.contactPerson.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || undefined,
      buyerAddress: body.buyerAddress?.trim() || undefined,
      buyerGstin: body.buyerGstin?.trim().toUpperCase() || undefined,
      country: body.country.trim(),
      currency: body.currency.trim().toUpperCase(),
      items: body.items.map((item) => ({
        productId: item.productId,
        description: item.description?.trim() || undefined,
        quantity: Number(item.quantity),
        unit: item.unit?.trim() || "",
        unitPrice: Number(item.unitPrice),
      })),
      discount: Number(body.discount ?? 0),
      freight: Number(body.freight ?? 0),
      insurance: Number(body.insurance ?? 0),
      tax: Number(body.tax ?? 0),
      validityDays: Number(body.validityDays ?? 15),
      notes: body.notes?.trim() || undefined,
    };

    const invalidItem = input.items.some(
      (item) =>
        !item.productId ||
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0 ||
        !item.unit ||
        !Number.isFinite(item.unitPrice) ||
        item.unitPrice < 0,
    );

    if (invalidItem) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Each quotation item requires a valid product, quantity, unit and unit price.",
        },
        { status: 400 },
      );
    }

    const quote = await createWorkspaceInquiryQuote(
      id,
      input,
    );

    return NextResponse.json(
      {
        success: true,
        message: "Quotation created successfully.",
        quote,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "POST /api/workspace/inquiries/[id]/quotes",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Unable to create quotation.";

    const status =
      message === "Inquiry not found." ? 404 : 500;

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status },
    );
  }
}
