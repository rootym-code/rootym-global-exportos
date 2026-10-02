/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : Buyer Intelligence Dashboard
 *
 * Module          : Admin Buyer API
 *
 * Description
 * ------------------------------------------------------------
 * Provides buyer list data from existing inquiries.
 *
 * Supports optional Admin Tenant filtering.
 *
 * Tenant filtering relationship:
 *
 * Inquiry
 *   └── Website
 *         └── Tenant
 *
 * No database migration required.
 *
 * ============================================================
 */

import {
  NextRequest,
  NextResponse,
} from "next/server";

import prisma from "@/lib/prisma";

import {
  authenticateAdmin,
} from "@/lib/auth";

export async function GET(
  request: NextRequest,
) {
  try {
    /**
     * ----------------------------------------------------------
     * Admin Authentication
     * ----------------------------------------------------------
     */

    const auth =
      await authenticateAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.error,
        },
        {
          status: auth.status,
        },
      );
    }

    /**
     * ----------------------------------------------------------
     * Tenant Filter
     * ----------------------------------------------------------
     *
     * No tenantId:
     *   = All buyers
     *
     * tenantId supplied:
     *   = Buyers whose inquiries belong to that tenant
     *
     * Relationship:
     *
     * Inquiry
     *   -> Website
     *      -> Tenant
     * ----------------------------------------------------------
     */

    const tenantId =
      request.nextUrl.searchParams
        .get("tenantId")
        ?.trim() || undefined;

    /**
     * ----------------------------------------------------------
     * Load Inquiries
     * ----------------------------------------------------------
     *
     * The buyer list is derived from existing inquiries.
     *
     * When tenantId is supplied, filter directly through the
     * Inquiry -> Website -> Tenant relationship.
     * ----------------------------------------------------------
     */

    const inquiries =
      await prisma.inquiry.findMany({
        where: tenantId
          ? {
              website: {
                tenantId,
              },
            }
          : undefined,

        orderBy: {
          createdAt: "desc",
        },
      });

    /**
     * ----------------------------------------------------------
     * Build Buyer Map
     * ----------------------------------------------------------
     *
     * Multiple inquiries from the same company are consolidated
     * into a single buyer record.
     *
     * Company name is used as the buyer aggregation key.
     * ----------------------------------------------------------
     */

    const buyerMap =
      new Map<string, BuyerMapItem>();

    inquiries.forEach(
      (inquiry) => {
        const key =
          inquiry.companyName
            .trim()
            .toLowerCase();

        if (!buyerMap.has(key)) {
          buyerMap.set(
            key,
            {
              companyName:
                inquiry.companyName,

              contactPerson:
                inquiry.contactPerson,

              email:
                inquiry.email,

              phone:
                inquiry.phone,

              country:
                inquiry.country,

              totalInquiries: 1,

              products: [
                inquiry.product,
              ],

              latestInquiry:
                inquiry.createdAt,

              latestInquiryNumber:
                inquiry.inquiryNumber,
            },
          );

          return;
        }

        const buyer =
          buyerMap.get(key)!;

        /**
         * Increment inquiry count.
         */
        buyer.totalInquiries += 1;

        /**
         * Add product only once.
         */
        if (
          !buyer.products.includes(
            inquiry.product,
          )
        ) {
          buyer.products.push(
            inquiry.product,
          );
        }
      },
    );

    /**
     * ----------------------------------------------------------
     * Convert Map to Array
     * ----------------------------------------------------------
     */

    const buyers =
      Array.from(
        buyerMap.values(),
      );

    /**
     * ----------------------------------------------------------
     * API Response
     * ----------------------------------------------------------
     */

    return NextResponse.json({
      success: true,
      buyers,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/buyers error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}

/**
 * ============================================================
 * Internal Buyer Representation
 * ============================================================
 *
 * Used while aggregating inquiries into unique buyers.
 * ============================================================
 */

interface BuyerMapItem {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string | null;
  country: string;
  totalInquiries: number;
  products: string[];
  latestInquiry: Date;
  latestInquiryNumber: string;
}