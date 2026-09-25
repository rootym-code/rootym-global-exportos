/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the customer-side WhatsApp integration
 *          service for tenant-scoped connection management.
 * ============================================================
 */

import prisma from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export interface WhatsAppIntegrationInput {
  phoneNumberId: string;
  businessAccountId: string;
  accessToken: string;
  displayPhoneNumber?: string | null;
  verifiedName?: string | null;
}

export interface WhatsAppIntegrationPublic {
  id: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber: string | null;
  verifiedName: string | null;
  status: string;
  connectedAt: Date | null;
  lastVerifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Convert the database integration into a customer-safe
 * representation.
 *
 * The Meta access token is intentionally never returned.
 */
function toPublicIntegration(
  integration: {
    id: string;
    phoneNumberId: string;
    businessAccountId: string;
    displayPhoneNumber: string | null;
    verifiedName: string | null;
    status: string;
    connectedAt: Date | null;
    lastVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }
): WhatsAppIntegrationPublic {
  return {
    id: integration.id,
    phoneNumberId: integration.phoneNumberId,
    businessAccountId: integration.businessAccountId,
    displayPhoneNumber: integration.displayPhoneNumber,
    verifiedName: integration.verifiedName,
    status: integration.status,
    connectedAt: integration.connectedAt,
    lastVerifiedAt: integration.lastVerifiedAt,
    createdAt: integration.createdAt,
    updatedAt: integration.updatedAt,
  };
}

/**
 * Customer-side WhatsApp Integration Service.
 */
class WhatsAppIntegrationService {
  /**
   * Return the current customer's WhatsApp integration.
   *
   * Tenant identity is resolved exclusively through the
   * authenticated Customer Workspace session.
   */
  async getCurrentIntegration(): Promise<WhatsAppIntegrationPublic | null> {
    const { tenant } = await requireWorkspaceAccess();

    const integration = await prisma.whatsAppIntegration.findUnique({
      where: {
        tenantId: tenant.id,
      },
      select: {
        id: true,
        phoneNumberId: true,
        businessAccountId: true,
        displayPhoneNumber: true,
        verifiedName: true,
        status: true,
        connectedAt: true,
        lastVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!integration) {
      return null;
    }

    return toPublicIntegration(integration);
  }

  /**
   * Return the complete integration for trusted server-side
   * operations.
   *
   * This method intentionally requires an explicit tenant ID
   * and must only be called by trusted server-side integration
   * callbacks/services.
   *
   * The access token must never be sent to the browser.
   */
  async getIntegrationForTenant(tenantId: string) {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    return prisma.whatsAppIntegration.findUnique({
      where: {
        tenantId,
      },
    });
  }

  /**
   * Create or update a tenant's WhatsApp integration.
   *
   * Intended for a trusted server-side Meta connection flow.
   */
  async saveIntegrationForTenant(
    tenantId: string,
    input: WhatsAppIntegrationInput
  ) {
    if (!tenantId) {
      throw new Error("Tenant ID is required.");
    }

    if (!input.phoneNumberId.trim()) {
      throw new Error("WhatsApp Phone Number ID is required.");
    }

    if (!input.businessAccountId.trim()) {
      throw new Error("WhatsApp Business Account ID is required.");
    }

    if (!input.accessToken.trim()) {
      throw new Error("WhatsApp access token is required.");
    }

    const integration = await prisma.whatsAppIntegration.upsert({
      where: {
        tenantId,
      },
      create: {
        tenantId,
        phoneNumberId: input.phoneNumberId.trim(),
        businessAccountId: input.businessAccountId.trim(),
        accessToken: input.accessToken.trim(),
        displayPhoneNumber:
          input.displayPhoneNumber?.trim() || null,
        verifiedName:
          input.verifiedName?.trim() || null,
        status: "CONNECTED",
        connectedAt: new Date(),
        lastVerifiedAt: new Date(),
      },
      update: {
        phoneNumberId: input.phoneNumberId.trim(),
        businessAccountId: input.businessAccountId.trim(),
        accessToken: input.accessToken.trim(),
        displayPhoneNumber:
          input.displayPhoneNumber?.trim() || null,
        verifiedName:
          input.verifiedName?.trim() || null,
        status: "CONNECTED",
        connectedAt: new Date(),
        lastVerifiedAt: new Date(),
      },
    });

    return toPublicIntegration(integration);
  }

  /**
   * Disconnect the current customer's WhatsApp integration.
   *
   * The record is retained for audit/history purposes.
   * Credentials are removed from the active connection.
   */
  async disconnectCurrentIntegration(): Promise<WhatsAppIntegrationPublic | null> {
    const { tenant } = await requireWorkspaceAccess();

    const existing = await prisma.whatsAppIntegration.findUnique({
      where: {
        tenantId: tenant.id,
      },
    });

    if (!existing) {
      return null;
    }

    const integration = await prisma.whatsAppIntegration.update({
      where: {
        tenantId: tenant.id,
      },
      data: {
        accessToken: "",
        status: "DISCONNECTED",
      },
      select: {
        id: true,
        phoneNumberId: true,
        businessAccountId: true,
        displayPhoneNumber: true,
        verifiedName: true,
        status: true,
        connectedAt: true,
        lastVerifiedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return toPublicIntegration(integration);
  }
}

const whatsAppIntegrationService =
  new WhatsAppIntegrationService();

export default whatsAppIntegrationService;