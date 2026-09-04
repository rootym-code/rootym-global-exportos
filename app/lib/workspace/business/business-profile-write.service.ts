/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates or updates the authenticated tenant-scoped
 *          Business Profile for authorized customer workspace
 *          members.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import type { BusinessProfileInput } from "@/lib/validations/business-profile";
import { requireWorkspaceAccess } from "../require-workspace-access";

export async function saveBusinessProfile(
  input: BusinessProfileInput
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  /*
   * Business Profile changes are restricted to workspace
   * owners and administrators.
   */
  if (
    membership.role !== "OWNER" &&
    membership.role !== "ADMIN"
  ) {
    throw new Error(
      "You do not have permission to modify the Business Profile."
    );
  }

  const businessProfile = await prisma.businessProfile.upsert({
    where: {
      tenantId: tenant.id,
    },

    create: {
      tenantId: tenant.id,
      businessName: input.businessName,
      legalName: input.legalName || null,
      businessType: input.businessType || null,
      email: input.email || null,
      phone: input.phone || null,
      country: input.country || null,
      website: input.website || null,
      description: input.description || null,
    },

    update: {
      businessName: input.businessName,
      legalName: input.legalName || null,
      businessType: input.businessType || null,
      email: input.email || null,
      phone: input.phone || null,
      country: input.country || null,
      website: input.website || null,
      description: input.description || null,
    },
  });

  return businessProfile;
}

export default saveBusinessProfile;