/**
 * Author: Prem Singh
 * Purpose: Returns the authenticated SaaS customer, tenant, membership, and trial status.
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import { getCustomerSession } from "@/lib/auth/customer";
  
  export async function GET(
    request: NextRequest
  ) {
    const session =
      await getCustomerSession(request);
  
    if (!session) {
      return NextResponse.json(
        {
          authenticated: false,
        },
        {
          status: 401,
        }
      );
    }
  
    const subscription =
      session.subscription;
  
    const trialEndsAt =
      subscription?.trialEndsAt ??
      null;
  
    const trialActive =
      subscription?.status ===
        "TRIALING" &&
      !!trialEndsAt &&
      trialEndsAt > new Date();
  
    return NextResponse.json({
      authenticated: true,
  
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        avatarUrl:
          session.user.avatarUrl,
      },
  
      tenant: {
        id: session.tenant.id,
        name: session.tenant.name,
        slug: session.tenant.slug,
        role: session.membership.role,
      },
  
      subscription:
        subscription
          ? {
              id: subscription.id,
              status:
                subscription.status,
              plan:
                subscription.plan.name,
              trialStartedAt:
                subscription.trialStartedAt,
              trialEndsAt,
              trialActive,
            }
          : null,
    });
  }