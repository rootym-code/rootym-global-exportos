/**
 * ============================================================
 * ROOTYM Business Tax & Compliance Write Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates and updates tenant-scoped tax configuration,
 *          export tax treatment, LUT/Bond information and
 *          compliance settings with role-based authorization.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import type { BusinessTaxComplianceInput } from "@/lib/validations/business-tax-compliance";

function toDateTime(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export async function saveBusinessTaxCompliance(
  input: BusinessTaxComplianceInput,
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error(
      "You do not have permission to modify Tax & Compliance.",
    );
  }

  const data = {
    ...input,
    lutBondIssueDate: toDateTime(input.lutBondIssueDate),
    lutBondExpiryDate: toDateTime(input.lutBondExpiryDate),
    nextComplianceDate: toDateTime(input.nextComplianceDate),
  };

  return prisma.businessTaxCompliance.upsert({
    where: {
      tenantId: tenant.id,
    },
    create: {
      tenantId: tenant.id,
      ...data,
    },
    update: {
      ...data,
    },
  });
}