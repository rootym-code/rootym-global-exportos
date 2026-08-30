/**
 * Author: Prem Singh
 * Purpose: Provides the authenticated SaaS endpoint for starting the optional 30-day free trial.
 */

import {
    NextRequest,
    NextResponse,
  } from "next/server";
  
  import { getCustomerSession } from "@/lib/auth/customer";
  import { startTrial } from "@/lib/services/saas/trial-start.service";
  
  export async function POST(
    request: NextRequest
  ) {
    try {
      /*
       * Authenticate the SaaS customer and resolve
       * the tenant from the signed customer session.
       */
      const session =
        await getCustomerSession(request);
  
      if (!session) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Customer authentication is required.",
          },
          {
            status: 401,
          }
        );
      }
  
      /*
       * Start the optional 30-day trial for the
       * authenticated customer's tenant.
       */
      const subscription =
        await startTrial(
          session.membership.tenantId
        );
  
      return NextResponse.json(
        {
          success: true,
          message:
            "30-day free trial started successfully.",
          data: subscription,
        },
        {
          status: 201,
        }
      );
    } catch (error) {
      console.error(
        "POST /api/auth/trial",
        error
      );
  
      const message =
        error instanceof Error
          ? error.message
          : "Unable to start the trial.";
  
      return NextResponse.json(
        {
          success: false,
          message,
        },
        {
          status: 400,
        }
      );
    }
  }