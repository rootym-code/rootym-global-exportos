/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace API boundary for
 *          WhatsApp integration status and disconnection.
 * ============================================================
 */

import { NextResponse } from "next/server";

import whatsAppIntegrationService from "@/app/lib/workspace/integrations/whatsapp/whatsapp-integration.service";

/**
 * GET
 *
 * Returns the current authenticated customer's WhatsApp
 * integration status.
 *
 * The tenant is resolved internally by the integration service
 * through the authenticated Customer Workspace session.
 *
 * Sensitive Meta credentials are never returned.
 */
export async function GET() {
  try {
    const integration =
      await whatsAppIntegrationService.getCurrentIntegration();

    return NextResponse.json({
      success: true,
      connected: Boolean(
        integration &&
          integration.status === "CONNECTED"
      ),
      integration,
    });
  } catch (error) {
    console.error(
      "Failed to load WhatsApp integration:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load WhatsApp integration status.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * DELETE
 *
 * Disconnects the WhatsApp integration belonging to the
 * currently authenticated customer tenant.
 *
 * No tenantId is accepted from the client.
 */
export async function DELETE() {
  try {
    const integration =
      await whatsAppIntegrationService.disconnectCurrentIntegration();

    return NextResponse.json({
      success: true,
      connected: false,
      integration,
      message: integration
        ? "WhatsApp integration disconnected successfully."
        : "No WhatsApp integration was connected.",
    });
  } catch (error) {
    console.error(
      "Failed to disconnect WhatsApp integration:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to disconnect WhatsApp integration.",
      },
      {
        status: 500,
      }
    );
  }
}