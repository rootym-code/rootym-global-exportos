/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Quote Management
 * Feature      : Admin Quote API
 * File         : app/api/admin/quotes/route.ts
 * Version      : 1.0.0
 *
 * ============================================================================
 * DESCRIPTION
 * ============================================================================
 *
 * Administrative Quote Management API.
 *
 * Responsibilities
 * ----------------
 * • List Quotes
 * • Search Quotes
 * • Pagination
 * • Filtering
 * • Quote Creation
 *
 * Business logic is delegated to QuoteBusinessService.
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { Prisma, QuoteStatus } from "@/lib/generated/prisma";

import { prisma } from "@/lib/prisma";

import QuoteBusinessService from "@/lib/services/quote-business.service";

import { authenticateAdmin } from "@/lib/auth";

/* ============================================================================
 * GET
 * ========================================================================== */

export async function GET(request: NextRequest) {
    try {
      const auth = await authenticateAdmin(request);

      if (!auth.authenticated || !auth.admin) {
        return NextResponse.json(
          {
            success: false,
            message: auth.error ?? "Unauthorized",
          },
          {
            status: auth.status ?? 401,
          }
        );
      }

      const { searchParams } = new URL(request.url);

      const page = Math.max(
        1,
        Number(searchParams.get("page") ?? "1")
      );

      const pageSize = Math.max(
        1,
        Number(searchParams.get("pageSize") ?? "20")
      );

      const search = searchParams.get("search") ?? "";
      const status = searchParams.get("status");
      const country = searchParams.get("country");

      const where: Prisma.QuoteWhereInput = {};

      /* ============================================================
       * Search
       * ============================================================ */

      if (search) {
        where.OR = [
          {
            quoteNumber: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            companyName: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            contactPerson: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive",
            },
          },
        ];
      }

      /* ============================================================
       * Filters
       * ============================================================ */

      if (status) {
        where.status = status as QuoteStatus;
      }

      if (country) {
        where.country = country;
      }

      /* ============================================================
       * Fetch quotes + total count
       * ============================================================ */

      const [total, quotes] = await Promise.all([
        prisma.quote.count({
          where,
        }),

        prisma.quote.findMany({
          where,

          include: {
            inquiry: true,
            createdBy: true,
          },

          orderBy: {
            createdAt: "desc",
          },

          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
      ]);

      /* ============================================================
       * Map database Quote → QuoteRow
       *
       * Important:
       * - grandTotal becomes total
       * - Prisma Decimal values become numbers
       * - contactPerson becomes customerName
       * ============================================================ */

      const items = quotes.map((quote) => ({
        id: quote.id,

        quoteNumber: quote.quoteNumber,

        inquiryId: quote.inquiryId,

        customerName: quote.contactPerson,

        companyName: quote.companyName,

        country: quote.country,

        status: quote.status,

        currency: quote.currency,

        subtotal: Number(quote.subtotal),

        freight: Number(quote.freight),

        tax: Number(quote.tax),

        total: Number(quote.grandTotal),

        validUntil: quote.validUntil
          ? quote.validUntil.toISOString()
          : null,

        createdAt: quote.createdAt.toISOString(),

        updatedAt: quote.updatedAt.toISOString(),
      }));

      /* ============================================================
       * Summary
       * ============================================================ */

      const [draft, sent, approved, expired] =
        await Promise.all([
          prisma.quote.count({
            where: {
              ...where,
              status: QuoteStatus.DRAFT,
            },
          }),

          prisma.quote.count({
            where: {
              ...where,
              status: QuoteStatus.SENT,
            },
          }),

          prisma.quote.count({
            where: {
              ...where,
              status: QuoteStatus.ACCEPTED,
            },
          }),

          prisma.quote.count({
            where: {
              ...where,
              status: QuoteStatus.EXPIRED,
            },
          }),
        ]);

      /* ============================================================
       * Response expected by QuoteManagementPage
       * ============================================================ */

      return NextResponse.json({
        success: true,

        items,

        page,

        pageSize,

        total,

        summary: {
          draft,
          sent,
          approved,
          expired,
        },
      });
    } catch (error) {
      console.error(
        "GET /api/admin/quotes",
        error
      );

      return NextResponse.json(
        {
          success: false,

          message:
            error instanceof Error
              ? error.message
              : "Unable to fetch quotes.",
        },
        {
          status: 500,
        }
      );
    }
  }

  /* ============================================================================
   * POST
   * ============================================================================
   *
   * Creates a quotation.
   *
   * All business rules are delegated to QuoteBusinessService.
   * ========================================================================== */

  export async function POST(
      request: NextRequest
  ) {

      try {



        const auth =
        await authenticateAdmin(
            request
        );

    if (
        !auth.authenticated ||
        !auth.admin
    ) {

        return NextResponse.json(

            {

                success: false,

                message:
                    auth.error ??
                    "Unauthorized",

            },

            {

                status:
                    auth.status ??
                    401,

            },

        );

    }

    const admin =
        auth.admin;

          const body =
              await request.json();

          /* ============================================================
           * Required Fields
           * ============================================================ */

          if (!body.companyName) {

              return NextResponse.json(

                  {

                      success: false,

                      message:
                          "Company name is required.",

                  },

                  {

                      status: 400,

                  },

              );

          }

          if (!body.contactPerson) {

              return NextResponse.json(

                  {

                      success: false,

                      message:
                          "Contact person is required.",

                  },

                  {

                      status: 400,

                  },

              );

          }

          /*
           * Email is optional for quotations created from
           * WhatsApp-only inquiries.
           *
           * The current Quote schema still stores email as a
           * required String, so an unavailable email is persisted
           * as an empty string. A nullable schema migration can be
           * introduced later without blocking this workflow.
           */

          if (!body.country) {

              return NextResponse.json(

                  {

                      success: false,

                      message:
                          "Country is required.",

                  },

                  {

                      status: 400,

                  },

              );

          }

          if (!body.currency) {

              return NextResponse.json(

                  {

                      success: false,

                      message:
                          "Currency is required.",

                  },

                  {

                      status: 400,

                  },

              );

          }

          if (
              !Array.isArray(body.items) ||
              body.items.length === 0
          ) {

              return NextResponse.json(

                  {

                      success: false,

                      message:
                          "At least one quote item is required.",

                  },

                  {

                      status: 400,

                  },

              );

          }

          /* ============================================================
           * Create Quote
           * ============================================================ */

          const quote =
              await QuoteBusinessService.createQuote({

                  inquiryId:
                      body.inquiryId,

                  companyName:
                      body.companyName,

                  contactPerson:
                      body.contactPerson,

                  email:
                      typeof body.email === "string"
                          ? body.email.trim()
                          : "",

                  phone:
                      body.phone,

                  country:
                      body.country,

                  currency:
                      body.currency,

                  items:
                      body.items,

                  discount:
                      body.discount,

                  freight:
                      body.freight,

                  insurance:
                      body.insurance,

                  tax:
                      body.tax,

                  validityDays:
                      body.validityDays,

                  notes:
                      body.notes,

                  createdById:
                  admin.adminId,

              });

          return NextResponse.json(

              {

                  success: true,

                  message:
                      "Quotation created successfully.",

                  data: quote,

              },

              {

                  status: 201,

              },

          );

      } catch (error) {

          console.error(
              "POST /api/admin/quotes",
              error
          );

          return NextResponse.json(

              {

                  success: false,

                  message:
                      error instanceof Error
                          ? error.message
                          : "Unable to create quotation.",

              },

              {

                  status: 500,

              },

          );

      }

  }
  /* ============================================================================
 * PRIVATE HELPERS
 * ============================================================================
 */

function parsePositiveInteger(
  value: string | null,
  defaultValue: number
): number {

  if (!value) {

      return defaultValue;

  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {

      return defaultValue;

  }

  return Math.floor(parsed);

}

function buildPagination(

  page: number,

  pageSize: number,

  total: number,

) {

  return {

      page,

      pageSize,

      total,

      totalPages: Math.ceil(total / pageSize),

      hasNext: page * pageSize < total,

      hasPrevious: page > 1,

  };

}

function successResponse(

  data: unknown,

  message?: string,

  status: number = 200,

) {

  return NextResponse.json(

      {

          success: true,

          message,

          data,

      },

      {

          status,

      },

  );

}

function paginatedResponse(

  data: unknown,

  page: number,

  pageSize: number,

  total: number,

) {

  return NextResponse.json({

      success: true,

      data,

      pagination: buildPagination(

          page,

          pageSize,

          total,

      ),

  });

}

function errorResponse(

  message: string,

  status: number = 500,

) {

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

/* ============================================================================
* FUTURE ENDPOINTS
* ============================================================================
*
* This route intentionally supports only:
*
*      GET
*      POST
*
* Additional REST endpoints:
*
*      GET    /api/admin/quotes/[id]
*
*      PUT    /api/admin/quotes/[id]
*
*      DELETE /api/admin/quotes/[id]
*
*      POST   /api/admin/quotes/[id]/revision
*
*      POST   /api/admin/quotes/[id]/status
*
*      POST   /api/admin/quotes/[id]/send
*
*      GET    /api/admin/quotes/[id]/pdf
*
*      GET    /api/admin/quotes/[id]/timeline
*
* will each have their own dedicated route handler.
*
* Keeping each route focused makes the API easier to maintain,
* easier to test, and aligns with enterprise REST design.
* ============================================================================
*/

/* ============================================================================
* ROUTE SUMMARY
* ============================================================================
*
* GET
* ----
* • Search Quotes
* • Filter Quotes
* • Pagination
* • Sorting
*
* POST
* ----
* • Create Quote
*
* Business Rules
* --------------
* Delegated entirely to QuoteBusinessService.
*
* Authentication
* --------------
* Admin only.
*
* Response Format
* ---------------
* {
*   success,
*   message,
*   data,
*   pagination?
* }
*
* ============================================================================
*
* Sprint 9 Status
*
* ✅ Quote Listing
* ✅ Search
* ✅ Filters
* ✅ Pagination
* ✅ Quote Creation
* ✅ Authentication
* ✅ Business Layer Delegation
* ✅ Enterprise Ready
*
* ============================================================================
*/
