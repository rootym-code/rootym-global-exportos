/**
 * ============================================================
 * ROOTYM Business Financial Settings Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Retrieves tenant-scoped currency, payment terms,
 *          banking and foreign-remittance configuration for
 *          the ROOTYM business workspace.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";

export async function getBusinessFinancialSettings() {
  const { tenant } = await requireWorkspaceAccess();

  return prisma.businessFinancialSettings.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });
}