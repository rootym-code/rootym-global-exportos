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
  request: NextRequest
) {
  try {
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
        }
      );
    }

    /**
     * ----------------------------------------------------------
     * Tenant Filter
     * ----------------------------------------------------------
     *
     * null / missing tenantId
     *     = All Customers
     *
     * tenantId supplied
     *     = Only inquiries belonging to that tenant
     *
     * Relationship:
     *
     * Inquiry
     *    -> Website
     *       -> Tenant
     * ----------------------------------------------------------
     */
    const tenantId =
      request.nextUrl.searchParams
        .get("tenantId")
        ?.trim() || undefined;

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
            }
          );
        } else {
          const buyer =
            buyerMap.get(key)!;

          buyer.totalInquiries += 1;

          if (
            !buyer.products.includes(
              inquiry.product
            )
          ) {
            buyer.products.push(
              inquiry.product
            );
          }
        }
      }
    );

    const buyers =
      Array.from(
        buyerMap.values()
      );

    return NextResponse.json({
      success: true,
      buyers,
    });
  } catch (error) {
    console.error(
      "Buyer API Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Internal representation used while
 * aggregating inquiries into buyers.
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