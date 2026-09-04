/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped business
 *          profile required by the Business Configuration module.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export interface BusinessProfile {
  id: string;
  tenantId: string;

  businessName: string;
  legalName: string | null;
  businessType: string | null;

  email: string | null;
  phone: string | null;

  country: string | null;
  website: string | null;

  description: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Returns the business profile belonging to the
 * currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated workspace access context.
 */
export async function getBusinessProfile(): Promise<BusinessProfile | null> {
  const { tenant } = await requireWorkspaceAccess();

  const businessProfile = await prisma.businessProfile.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });

  return businessProfile;
}

export default getBusinessProfile;