/**
 * ============================================================
 * ROOTYM ExportOS — Admin Tenant Search API
 * ============================================================
 *
 * Purpose:
 * Provides ROOTYM Admin with a searchable list of active
 * customer tenants/workspaces.
 *
 * Used by:
 * - Admin Tenant Selector
 * - Products
 * - Inquiries
 * - FollowUps
 *
 * Security:
 * - Uses the existing ROOTYM Admin JWT authentication system.
 * - Does not create a second authentication mechanism.
 * - Returns only active tenants.
 * - Does not expose passwords or authentication credentials.
 *
 * Search:
 * - Tenant name
 * - Tenant slug
 * - Business name
 * - Legal name
 * - Business email
 * - Business phone
 * - Country
 *
 * Examples:
 *
 * GET /api/admin/tenants
 * GET /api/admin/tenants?search=abc
 *
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { authenticateAdmin } from "@/lib/auth";

const MAX_RESULTS = 50;

export async function GET(request: NextRequest) {
  try {
    /**
     * ==========================================================
     * 1. Authenticate Admin
     * ==========================================================
     *
     * IMPORTANT:
     * This uses the same Admin authentication foundation already
     * used by the existing Admin APIs.
     *
     * The Admin JWT is carried by:
     *
     *   rootym_admin_token
     * ==========================================================
     */
    const auth = await authenticateAdmin(request);

    if (!auth?.admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    /**
     * ==========================================================
     * 2. Read search parameter
     * ==========================================================
     */
    const search =
      request.nextUrl.searchParams.get("search")?.trim() ?? "";

    /**
     * ==========================================================
     * 3. Build tenant filter
     * ==========================================================
     *
     * Tenant is the root customer/workspace entity.
     *
     * BusinessProfile provides additional customer information
     * useful for Admin search.
     */
    const where = {
      isActive: true,

      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                slug: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                businessProfile: {
                  is: {
                    businessName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
              {
                businessProfile: {
                  is: {
                    legalName: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
              {
                businessProfile: {
                  is: {
                    email: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
              {
                businessProfile: {
                  is: {
                    phone: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
              {
                businessProfile: {
                  is: {
                    country: {
                      contains: search,
                      mode: "insensitive" as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    /**
     * ==========================================================
     * 4. Load active tenants
     * ==========================================================
     *
     * Only fields required by the Admin Tenant Selector are
     * returned.
     */
    const tenants = await prisma.tenant.findMany({
      where,
      orderBy: {
        name: "asc",
      },
      take: MAX_RESULTS,

      select: {
        id: true,
        name: true,
        slug: true,
        isActive: true,
        createdAt: true,

        businessProfile: {
          select: {
            businessName: true,
            legalName: true,
            email: true,
            phone: true,
            country: true,
          },
        },

        website: {
          select: {
            id: true,
            name: true,
            slug: true,
            isActive: true,
          },
        },
      },
    });

    /**
     * ==========================================================
     * 5. Normalize response
     * ==========================================================
     *
     * Keep the response simple so the same object can be used
     * by Products, Inquiries and FollowUps later.
     */
    const result = tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      slug: tenant.slug,
      isActive: tenant.isActive,
      createdAt: tenant.createdAt,

      businessName:
        tenant.businessProfile?.businessName ?? null,

      legalName:
        tenant.businessProfile?.legalName ?? null,

      email:
        tenant.businessProfile?.email ?? null,

      phone:
        tenant.businessProfile?.phone ?? null,

      country:
        tenant.businessProfile?.country ?? null,

      website: tenant.website
        ? {
            id: tenant.website.id,
            name: tenant.website.name,
            slug: tenant.website.slug,
            isActive: tenant.website.isActive,
          }
        : null,
    }));

    /**
     * ==========================================================
     * 6. Return result
     * ==========================================================
     */
    return NextResponse.json({
      success: true,
      tenants: result,
      count: result.length,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/tenants error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load customer workspaces.",
      },
      { status: 500 }
    );
  }
}