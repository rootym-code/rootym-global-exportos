/**
 * ============================================================
 * ROOTYM Business Financial Settings Write Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Saves tenant-scoped currency, payment terms,
 *          banking and foreign-remittance configuration.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import type { BusinessFinancialSettingsInput } from "@/lib/validations/business-financial-settings";

export async function saveBusinessFinancialSettings(
  input: BusinessFinancialSettingsInput,
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error(
      "You do not have permission to modify Financial Settings.",
    );
  }

  return prisma.businessFinancialSettings.upsert({
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