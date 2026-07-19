/**
 * ============================================================================
 * Project      : ROOTYM Global Export Platform
 * Organization : ROOTYM AGRO HARVEST PRIVATE LIMITED
 * Module       : Quote Management
 * Feature      : Single Quote API
 * File         : app/api/admin/quotes/[id]/route.ts
 * Version      : 1.0.0
 *
 * ============================================================================
 * DESCRIPTION
 * ============================================================================
 *
 * Handles operations on a single quotation.
 *
 * Supported Methods
 *
 * GET
 * PUT
 * DELETE
 *
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import { QuoteStatus } from "@/lib/generated/prisma";

import QuoteBusinessService from "@/lib/services/quote-business.service";

import { authenticateAdmin } from "@/lib/auth";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

/* ============================================================================
 * GET
 * ============================================================================
 *
 * Returns a single quotation together with:
 *
 * • Inquiry
 * • Quote Items
 * • Product Details
 * • Created By
 * • Updated By
 * • Revision History
 *
 * ============================================================================
 */

export async function GET(
    request: NextRequest,
    context: RouteContext
) {

    try {

        const auth = await authenticateAdmin(request);

        if (!auth.authenticated || !auth.admin) {
        
            return NextResponse.json(
        
                {
        
                    success: false,
        
                    message:
                        auth.error ?? "Unauthorized",
        
                },
        
                {
        
                    status:
                        auth.status ?? 401,
        
                },
        
            );
        
        }
        
        const admin = auth.admin;



        const { id } =
            await context.params;

        const quote =
            await QuoteBusinessService.getQuoteById(
                id
            );

        if (!quote) {

            return NextResponse.json(

                {

                    success: false,

                    message: "Quote not found.",

                },

                {

                    status: 404,

                },

            );

        }

        const revisions =
            await QuoteBusinessService.getRevisions(
                id
            );

        return NextResponse.json({

            success: true,

            data: {

                quote,

                revisions,

            },

        });

    } catch (error) {

        console.error(
            "GET Quote",
            error
        );

        return NextResponse.json(

            {

                success: false,

                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to fetch quotation.",

            },

            {

                status: 500,

            },

        );

    }

}
/* ============================================================================
 * PUT
 * ============================================================================
 *
 * Updates an existing quotation.
 *
 * Business rules are delegated to QuoteBusinessService.
 * ============================================================================
 */

export async function PUT(
  request: NextRequest,
  context: RouteContext
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

      const { id } =
          await context.params;

      const existing =
          await prisma.quote.findUnique({

              where: {

                  id,

              },

          });

      if (!existing) {

          return NextResponse.json(

              {

                  success: false,

                  message: "Quote not found.",

              },

              {

                  status: 404,

              },

          );

      }

      const body =
          await request.json();

      /* ============================================================
       * Update Quote
       * ============================================================ */

      const updated =
          await QuoteBusinessService.updateQuote(

              id,

              {

                  companyName:
                      body.companyName,

                  contactPerson:
                      body.contactPerson,

                  email:
                      body.email,

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

              },

          );

      return NextResponse.json(

          {

              success: true,

              message:
                  "Quotation updated successfully.",

              data: updated,

          },

          {

              status: 200,

          },

      );

  } catch (error) {

      console.error(

          "PUT Quote",

          error,

      );

      return NextResponse.json(

          {

              success: false,

              message:
                  error instanceof Error
                      ? error.message
                      : "Unable to update quotation.",

          },

          {

              status: 500,

          },

      );

  }

}
/* ============================================================================
 * DELETE
 * ============================================================================
 *
 * NOTE
 * ----
 * Current implementation performs a hard delete.
 *
 * For production ERP systems this should later become:
 *
 *      archived = true
 *
 * instead of physical deletion.
 *
 * ============================================================================
 */

export async function DELETE(
  request: NextRequest,
  context: RouteContext
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

      const { id } =
          await context.params;

      const quote =
          await prisma.quote.findUnique({

              where: {

                  id,

              },

              include: {

                  items: true,

              },

          });

      if (!quote) {

          return NextResponse.json(

              {

                  success: false,

                  message: "Quote not found.",

              },

              {

                  status: 404,

              },

          );

      }

      /* ============================================================
       * Prevent deletion of accepted quotations
       * ============================================================ */

      if (quote.status === QuoteStatus.ACCEPTED) {

        return NextResponse.json(
    
            {
    
                success: false,
    
                message:
                    "Accepted quotations cannot be deleted.",
    
            },
    
            {
    
                status: 409,
    
            },
    
        );
    
    }



      /* ============================================================
       * Delete Items
       * ============================================================ */

      await prisma.$transaction(async (tx) => {

        await tx.quoteItem.deleteMany({
    
            where: {
    
                quoteId: id,
    
            },
    
        });
    
        await tx.quote.delete({
    
            where: {
    
                id,
    
            },
    
        });
    
    });

      /* ============================================================
       * Activity
       * ============================================================ */

      // If ActivityLogger.logQuoteDeleted() is added later,
      // call it here.

      return NextResponse.json(

          {

              success: true,

              message:
                  "Quotation deleted successfully.",

          },

          {

              status: 200,

          },

      );

  } catch (error) {

      console.error(

          "DELETE Quote",

          error,

      );

      return NextResponse.json(

          {

              success: false,

              message:
                  error instanceof Error
                      ? error.message
                      : "Unable to delete quotation.",

          },

          {

              status: 500,

          },

      );

  }

}

/* ============================================================================
* ROUTE SUMMARY
* ============================================================================
*
* GET
* ----
* Retrieve a quotation with:
*
*  • Inquiry
*  • Items
*  • Product Details
*  • Revision History
*
* PUT
* ----
* Update quotation using QuoteBusinessService.
*
* DELETE
* ------
* Delete quotation.
*
* Future Enhancement:
*
*  • Archive Quote
*  • Restore Quote
*  • Permanent Delete
*
* ============================================================================
*
* Sprint 9 Completion
*
* ✅ GET Quote
* ✅ UPDATE Quote
* ✅ DELETE Quote
* ✅ Authentication
* ✅ Business Layer Integration
* ✅ Enterprise Ready
*
* ============================================================================
*/