/**
 * ============================================================
 * ROOTYM Business Export Credentials Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Retrieves tenant-scoped export, business registration,
 *          regulatory credential and license information.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export async function getBusinessExportCredentials() {
  const { tenant } = await requireWorkspaceAccess();

  return prisma.businessExportCredentials.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });
}