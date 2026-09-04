/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates or updates the authenticated tenant-scoped
 *          primary business address for authorized workspace users.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

import type { BusinessAddressInput } from "@/lib/validations/business-address";

export async function saveBusinessAddress(
  input: BusinessAddressInput,
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  const canEdit =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  if (!canEdit) {
    throw new Error(
      "You do not have permission to modify the Business Address.",
    );
  }

  const businessAddress = await prisma.businessAddress.upsert({
    where: {
      tenantId: tenant.id,
    },
    create: {
      tenantId: tenant.id,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || null,
      postalCode: input.postalCode || null,
      country: input.country || null,
    },
    update: {
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city || null,
      state: input.state || null,
      postalCode: input.postalCode || null,
      country: input.country || null,
    },
  });

  return businessAddress;
}

export default saveBusinessAddress;