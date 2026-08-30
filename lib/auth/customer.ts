/**
 * Author: Prem Singh
 * Purpose: Resolves SaaS customer sessions and enforces tenant/subscription access.
 */

import { NextRequest } from "next/server";

import prisma from "@/lib/prisma";
import { SubscriptionStatus } from "@/lib/generated/prisma";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  verifyCustomerToken,
} from "./customer-jwt";

export async function getCustomerSession(request: NextRequest) {
  const token = request.cookies.get(
    CUSTOMER_AUTH_COOKIE_NAME
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = await verifyCustomerToken(token);

    const membership = await prisma.membership.findFirst({
      where: {
        id: payload.membershipId,
        userId: payload.userId,
        tenantId: payload.tenantId,
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

    if (
      !membership ||
      !membership.user.isActive ||
      !membership.tenant.isActive
    ) {
      return null;
    }

    return {
      user: membership.user,
      tenant: membership.tenant,
      membership,
      subscription:
        membership.tenant.subscriptions[0] ?? null,
    };
  } catch {
    return null;
  }
}

export async function requireCustomerSession(
  request: NextRequest
) {
  const session = await getCustomerSession(request);

  if (!session) {
    return {
      ok: false as const,
      status: 401,
      error: "Customer authentication required.",
    };
  }

  const { subscription } = session;

  if (!subscription) {
    return {
      ok: false as const,
      status: 402,
      error: "No active subscription found.",
    };
  }

  const now = new Date();

  if (
    subscription.status === SubscriptionStatus.TRIALING
  ) {
    if (
      !subscription.trialEndsAt ||
      subscription.trialEndsAt <= now
    ) {
      await prisma.subscription.update({
        where: {
          id: subscription.id,
        },
        data: {
          status: SubscriptionStatus.EXPIRED,
        },
      });

      return {
        ok: false as const,
        status: 402,
        error: "Your 30-day free trial has expired.",
      };
    }
  }

  if (
    subscription.status === SubscriptionStatus.PAST_DUE
  ) {
    return {
      ok: false as const,
      status: 402,
      error: "Payment is required to continue.",
    };
  }

  if (
    subscription.status === SubscriptionStatus.EXPIRED
  ) {
    return {
      ok: false as const,
      status: 402,
      error: "Your subscription has expired.",
    };
  }

  if (
    subscription.status === SubscriptionStatus.CANCELED
  ) {
    return {
      ok: false as const,
      status: 402,
      error: "Your subscription has been canceled.",
    };
  }

  if (
    subscription.status !== SubscriptionStatus.TRIALING &&
    subscription.status !== SubscriptionStatus.ACTIVE
  ) {
    return {
      ok: false as const,
      status: 402,
      error: "Your subscription is not active.",
    };
  }

  return {
    ok: true as const,
    ...session,
  };
}