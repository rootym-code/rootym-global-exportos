/**
 * Author: Prem Singh
 * Purpose: Admin-only endpoint for generating and downloading a GST billing invoice PDF.
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getBillingInvoiceForAdmin } from "@/lib/services/billing/billing-invoice-admin.service";
import { generateBillingInvoicePdf } from "@/lib/pdf/billing-invoice-generator";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext,
) {
  try {
    const admin = await authenticateAdmin(request);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        { status: 401 },
      );
    }

    const { id } = await context.params;

    const invoice = await getBillingInvoiceForAdmin(id);

    if (!invoice) {
      return NextResponse.json(
        {
          success: false,
          error: "Billing invoice not found.",
        },
        { status: 404 },
      );
    }

    const pdf = await generateBillingInvoicePdf(invoice);

    // A successfully generated PDF moves the invoice from PENDING to GENERATED.
    // It must not be marked SENT here because the Admin manually sends the PDF.
    if (invoice.status === "PENDING") {
      await prisma.billingInvoice.update({
        where: {
          id: invoice.id,
        },
        data: {
          status: "GENERATED",
          generatedAt: new Date(),
        },
      });
    }

    const filename = `${invoice.invoiceNumber}.pdf`;

    return new NextResponse(pdf as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    });
  } catch (error) {
    console.error("[Admin Billing Invoice PDF] GET error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate billing invoice PDF.",
      },
      { status: 500 },
    );
  }
}
