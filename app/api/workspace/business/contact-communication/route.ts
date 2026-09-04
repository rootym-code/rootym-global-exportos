/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped API for
 *          reading and saving Business Contact & Communication
 *          configuration.
 * ============================================================
 */

import { NextResponse } from "next/server";

import {
  businessContactCommunicationSchema,
} from "@/lib/validations/business-contact-communication";

import { getBusinessContactCommunication } from "@/app/lib/workspace/business/business-contact-communication.service";

import { saveBusinessContactCommunication } from "@/app/lib/workspace/business/business-contact-communication-write.service";

/**
 * Returns the Business Contact & Communication configuration
 * for the currently authenticated customer workspace.
 */
export async function GET() {
  try {
    const businessContactCommunication =
      await getBusinessContactCommunication();

    return NextResponse.json(
      {
        success: true,
        data: businessContactCommunication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Business Contact & Communication GET API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load Contact & Communication configuration.",
      },
      { status: 500 }
    );
  }
}

/**
 * Saves the Business Contact & Communication configuration
 * for the currently authenticated customer workspace.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation =
      businessContactCommunicationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Contact & Communication validation failed.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const businessContactCommunication =
      await saveBusinessContactCommunication(validation.data);

    return NextResponse.json(
      {
        success: true,
        message:
          "Contact & Communication saved successfully.",
        data: businessContactCommunication,
      },
      { status: 200 }
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "You do not have permission to modify Contact & Communication."
    ) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 403 }
      );
    }

    console.error(
      "Business Contact & Communication POST API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to save Contact & Communication configuration.",
      },
      { status: 500 }
    );
  }
}