/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the shared authenticated customer
 *          workspace authorization boundary for all
 *          Customer Workspace modules.
 * ============================================================
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  verifyCustomerToken,
} from "@/lib/auth/customer-jwt";

export async function requireWorkspaceAccess() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    CUSTOMER_AUTH_COOKIE_NAME
  )?.value;

  /*
   * 1. Require a valid customer JWT.
   *
   * The JWT is cryptographically verified by
   * verifyCustomerToken().
   */
  if (!token) {
    redirect(
      "/login?error=authentication_required"
    );
  }

  let session;

  try {
    session = await verifyCustomerToken(token);
  } catch {
    redirect(
      "/login?error=authentication_required"
    );
  }

  /*
   * 2. Revalidate the signed session against the
   *    database.
   *
   * The JWT identifiers alone are not treated as
   * sufficient authorization.
   */
  const membership =
    await prisma.membership.findFirst({
      where: {
        id: session.membershipId,
        userId: session.userId,
        tenantId: session.tenantId,
      },
      include: {
        user: true,
        tenant: {
          include: {
            subscriptions: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
              include: {
                plan: true,
              },
            },
          },
        },
      },
    });

  /*
   * 3. Reject invalid or inactive customer access.
   */
  if (
    !membership ||
    !membership.user.isActive ||
    !membership.tenant.isActive
  ) {
    redirect(
      "/login?error=account_inactive"
    );
  }

  /*
   * 4. Return the authenticated workspace context.
   *
   * Every Workspace module can now use this context
   * instead of independently resolving the customer.
   */
  return {
    session,
    membership,
    user: membership.user,
    tenant: membership.tenant,
  };
}