/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated API endpoint for creating
 *          or updating the tenant-scoped Business Profile.
 * ============================================================
 */

import { NextResponse } from "next/server";

import { businessProfileSchema } from "@/lib/validations/business-profile";
import { saveBusinessProfile } from "@/app/lib/workspace/business/business-profile-write.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = businessProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Business Profile validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    const businessProfile = await saveBusinessProfile(
      validation.data
    );

    return NextResponse.json(
      {
        success: true,
        message: "Business Profile saved successfully.",
        data: businessProfile,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to modify the Business Profile."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 403,
        }
      );
    }

    /*
     * requireWorkspaceAccess() handles authentication and
     * inactive-account redirects at the server boundary.
     */
    console.error(
      "Business Profile API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save the Business Profile.",
      },
      {
        status: 500,
      }
    );
  }
}