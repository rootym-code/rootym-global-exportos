/**
 * ============================================================
 * ROOTYM Business Operating Preferences Write Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Saves tenant-scoped operational, document,
 *          shipment, workflow and working preferences.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import type { BusinessOperatingPreferencesInput } from "@/lib/validations/business-operating-preferences";

export async function saveBusinessOperatingPreferences(
  input: BusinessOperatingPreferencesInput,
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error(
      "You do not have permission to modify Operating Preferences.",
    );
  }

  return prisma.businessOperatingPreferences.upsert({
    where: {
      tenantId: tenant.id,
    },
    create: {
      tenantId: tenant.id,
      ...input,
    },
    update: {
      ...input,
    },
  });
}