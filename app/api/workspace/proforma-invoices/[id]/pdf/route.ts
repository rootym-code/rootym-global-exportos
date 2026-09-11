/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Generates and downloads a Website-scoped Proforma
 *          Invoice PDF from Customer Workspace using the same
 *          shared commercial records and seller identity.
 * ============================================================
 */

import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

import { ProformaInvoiceTemplate } from "@/lib/pdf/proforma-invoice-template";

import { getCommercialSellerProfile } from "@/lib/services/commercial-document-profile.service";

import { requireWorkspaceWebsite } from "@/app/lib/workspace/website/website-context.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

function formatPdfDate(value: Date): string {
  return value.toISOString().split("T")[0];
}

function formatOptionalPdfDate(
  value: Date | null | undefined,
): string | undefined {
  if (!value) {
    return undefined;
  }

  return formatPdfDate(value);
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const workspace = await requireWorkspaceWebsite();

    const proformaInvoice =
      await prisma.proformaInvoice.findFirst({
        where: {
          id,
          websiteId: workspace.website.id,
        },
        include: {
          quote: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });

    if (!proformaInvoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Proforma Invoice not found.",
        },
        { status: 404 },
      );
    }

    const seller =
      await getCommercialSellerProfile(
        workspace.website.id,
      );

    const template =
      new ProformaInvoiceTemplate();

    const pdf = await template.render({
      piNumber: proformaInvoice.piNumber,

      issueDate: formatPdfDate(
        proformaInvoice.issueDate,
      ),

      paymentDueDate:
        formatOptionalPdfDate(
          proformaInvoice.paymentDueDate,
        ),

      quoteNumber:
        proformaInvoice.quote?.quoteNumber ??
        undefined,

      buyerName:
        proformaInvoice.contactPerson,

      buyerCompany:
        proformaInvoice.companyName,

      buyerAddress:
        proformaInvoice.buyerAddress ??
        "",

      buyerCountry:
        proformaInvoice.country,

      buyerGstin:
        proformaInvoice.buyerGstin ??
        "",

      seller,

      currency:
        proformaInvoice.currency,

      subtotal:
        Number(proformaInvoice.subtotal),

      discount:
        Number(proformaInvoice.discount),

      freight:
        Number(proformaInvoice.freight),

      insurance:
        Number(proformaInvoice.insurance),

      tax:
        Number(proformaInvoice.tax),

      grandTotal:
        Number(proformaInvoice.grandTotal),

      notes:
        proformaInvoice.notes ??
        "",

      items:
        proformaInvoice.items.map(
          (item) => ({
            description:
              item.product?.name ??
              item.description ??
              "Product",

            quantity:
              Number(item.quantity),

            unit:
              item.unit,

            unitPrice:
              Number(item.unitPrice),

            lineTotal:
              Number(item.lineTotal),
          }),
        ),
    });

    return new NextResponse(pdf as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${proformaInvoice.piNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(
      "GET /api/workspace/proforma-invoices/[id]/pdf",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate Proforma Invoice PDF.",
      },
      { status: 500 },
    );
  }
}
