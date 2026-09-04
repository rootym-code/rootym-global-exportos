/**
 * ============================================================
 * ROOTYM Business Operating Preferences Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Retrieves tenant-scoped operational, document,
 *          shipment, workflow and working preferences.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export async function getBusinessOperatingPreferences() {
  const { tenant } = await requireWorkspaceAccess();

  return prisma.businessOperatingPreferences.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });
}