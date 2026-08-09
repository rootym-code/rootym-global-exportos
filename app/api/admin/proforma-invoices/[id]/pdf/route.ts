/**
 * ============================================================
 * ROOTYM
 * File: app/api/admin/proforma-invoices/[id]/pdf/route.ts
 * Sprint 8.1
 *
 * Generates and downloads the production ROOTYM
 * Proforma Invoice PDF.
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { authenticateAdmin } from "@/lib/auth";
import {
  proformaInvoiceRepository,
} from "@/lib/repositories/proforma-invoice.repository";
import {
  proformaInvoiceGenerator,
} from "@/lib/pdf";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * ============================================================
 * GET /api/admin/proforma-invoices/:id/pdf
 * ============================================================
 *
 * Generates the PDF for an existing Proforma Invoice.
 *
 * Business rules:
 *
 * 1. Admin must be authenticated.
 * 2. Proforma Invoice must exist.
 * 3. The PI is read-only for PDF generation.
 * 4. The original quotation is never modified.
 * ============================================================
 */

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    /* ==========================================================
     * Authentication
     * ======================================================== */

    const auth = await authenticateAdmin(request);

    if (!auth.authenticated || !auth.admin) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error ?? "Unauthorized.",
        },
        {
          status: auth.status ?? 401,
        }
      );
    }

    /* ==========================================================
     * PI ID
     * ======================================================== */

    const { id } = await params;

    if (!id?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Proforma Invoice ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* ==========================================================
     * Load Proforma Invoice
     *
     * Repository includes:
     * - PI details
     * - Original quotation
     * - Inquiry
     * - PI items
     * - Product details
     * ======================================================== */

    const proformaInvoice =
      await proformaInvoiceRepository.findById(id);

    if (!proformaInvoice) {
      return NextResponse.json(
        {
          success: false,
          message: "Proforma Invoice not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* ==========================================================
     * Map database PI → PDF ProformaInvoiceEntity
     *
     * The PDF generator deliberately uses its own entity shape
     * so the PDF engine remains independent from Prisma.
     * ======================================================== */

    const pdfProformaInvoice = {
      piNumber:
        proformaInvoice.piNumber,

      issueDate:
        proformaInvoice.issueDate,

      paymentDueDate:
        proformaInvoice.paymentDueDate,

      quoteNumber:
        proformaInvoice.quote?.quoteNumber ?? null,

      buyerName:
        proformaInvoice.contactPerson,

      buyerCompany:
        proformaInvoice.companyName,

      /*
       * Address is not currently stored on the
       * ProformaInvoice model.
       */
      buyerAddress:
        "",

      buyerCountry:
        proformaInvoice.country,

      currency:
        proformaInvoice.currency,

      subtotal:
        proformaInvoice.subtotal,

      discount:
        proformaInvoice.discount,

      freight:
        proformaInvoice.freight,

      insurance:
        proformaInvoice.insurance,

      tax:
        proformaInvoice.tax,

      grandTotal:
        proformaInvoice.grandTotal,

      notes:
        proformaInvoice.notes,

      items:
        proformaInvoice.items.map(
          (item) => ({
            description:
              item.description ??
              item.product?.name ??
              "Product",

            quantity:
              Number(item.quantity),

            unit:
              item.unit,

            unitPrice:
              item.unitPrice,

            lineTotal:
              item.lineTotal,
          })
        ),
    };

    /* ==========================================================
     * Generate PDF
     * ======================================================== */

    const pdf =
      await proformaInvoiceGenerator.generateBuffer(
        pdfProformaInvoice
      );

    /* ==========================================================
     * Return PDF Download
     * ======================================================== */

    return new NextResponse(
      pdf as unknown as BodyInit,
      {
        status: 200,

        headers: {
          "Content-Type":
            "application/pdf",

          "Content-Disposition":
            `attachment; filename="${proformaInvoice.piNumber}.pdf"`,

          "Content-Length":
            String(pdf.length),

          "Cache-Control":
            "no-store, no-cache, must-revalidate",

          Pragma: "no-cache",
        },
      }
    );
  } catch (error) {
    console.error(
      "GET /api/admin/proforma-invoices/[id]/pdf",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Unable to generate Proforma Invoice PDF.",
      },
      {
        status: 500,
      }
    );
  }
}