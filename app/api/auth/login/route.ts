/**
 * ============================================================
 * ROOTYM Customer Password Login API
 * ============================================================
 * Purpose:
 * Authenticates ROOTYM customers using email + password.
 *
 * Responsibilities:
 * - Validate login credentials.
 * - Resolve the customer's User.
 * - Verify the stored password hash.
 * - Resolve the customer's Tenant Membership.
 * - Issue the existing customer JWT.
 * - Set the existing customer authentication cookie.
 *
 * This route does NOT:
 * - create Users
 * - create Tenants
 * - create Memberships
 * - create Websites
 * - modify Google OAuth
 * ============================================================
 */

import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  verifyCustomerPassword,
} from "@/lib/auth/customer-password";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  CUSTOMER_AUTH_COOKIE_OPTIONS,
  signCustomerToken,
} from "@/lib/auth/customer-jwt";

/**
 * Normalize an email address before database lookup.
 */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Customer password login.
 */
export async function POST(
  request: NextRequest,
) {
  try {
    const body = await request.json();

    const email =
      typeof body?.email === "string"
        ? normalizeEmail(body.email)
        : "";

    const password =
      typeof body?.password === "string"
        ? body.password
        : "";

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 },
      );
    }

    /**
     * ========================================================
     * Find customer account
     * ========================================================
     */
    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          memberships: {
            include: {
              tenant: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

    /**
     * Do not reveal whether an email address exists.
     */
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    /**
     * ========================================================
     * Account status
     * ========================================================
     */
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your ROOTYM customer account is inactive. Please contact support.",
        },
        { status: 403 },
      );
    }

    /**
     * ========================================================
     * Password credential
     * ========================================================
     */
    if (!user.passwordHash) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password login is not available for this account. Please use Google sign-in.",
        },
        { status: 401 },
      );
    }

    const passwordValid =
      await verifyCustomerPassword(
        password,
        user.passwordHash,
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    /**
     * ========================================================
     * Resolve active customer workspace
     * ========================================================
     */
    const membership =
      user.memberships.find(
        (item) =>
          item.tenant.isActive,
      );

    if (!membership) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No active ROOTYM workspace is associated with this account.",
        },
        { status: 403 },
      );
    }

    /**
     * ========================================================
     * Issue customer JWT
     * ========================================================
     */
    const customerToken =
      await signCustomerToken({
        userId: user.id,
        tenantId: membership.tenantId,
        membershipId: membership.id,
      });

    /**
     * ========================================================
     * Create response
     * ========================================================
     */
    const response =
      NextResponse.json({
        success: true,
        message:
          "Customer login successful.",
        customer: {
          id: user.id,
          email: user.email,
          name: user.name,
          isActive: user.isActive,
        },
        workspace: {
          id: membership.tenant.id,
          name: membership.tenant.name,
          slug: membership.tenant.slug,
          isActive:
            membership.tenant.isActive,
        },
        membership: {
          id: membership.id,
          role: membership.role,
        },
      });

    /**
     * ========================================================
     * Set customer authentication cookie
     * ========================================================
     */
    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAME,
      customerToken,
      CUSTOMER_AUTH_COOKIE_OPTIONS,
    );

    return response;
  } catch (error) {
    console.error(
      "Customer password login failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to complete customer login.",
      },
      { status: 500 },
    );
  }
}