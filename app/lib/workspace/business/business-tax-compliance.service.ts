/**
 * ============================================================
 * ROOTYM Business Tax & Compliance Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Retrieves tenant-scoped tax configuration, export
 *          tax treatment, LUT/Bond information and compliance
 *          settings for the ROOTYM business workspace.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export async function getBusinessTaxCompliance() {
  const { tenant } = await requireWorkspaceAccess();

  return prisma.businessTaxCompliance.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });
}