/**
 * ============================================================
 * ROOTYM Business Export Credentials Write Service
 * ============================================================
 * Author: Prem Singh
 * Purpose: Creates and updates tenant-scoped export, business
 *          registration, regulatory credential and license data.
 * ============================================================
 */

import { prisma } from "@/lib/prisma";
import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import type { BusinessExportCredentialsInput } from "@/lib/validations/business-export-credentials";

function toDateTime(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  return new Date(`${value}T00:00:00.000Z`);
}

export async function saveBusinessExportCredentials(
  input: BusinessExportCredentialsInput,
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
    throw new Error(
      "You do not have permission to modify Export Credentials.",
    );
  }

  const data = {
    ...input,
    iecIssueDate: toDateTime(input.iecIssueDate),
    gstRegistrationDate: toDateTime(input.gstRegistrationDate),
    udyamRegistrationDate: toDateTime(input.udyamRegistrationDate),
    rcmcIssueDate: toDateTime(input.rcmcIssueDate),
    rcmcExpiryDate: toDateTime(input.rcmcExpiryDate),
    otherLicense1ExpiryDate: toDateTime(input.otherLicense1ExpiryDate),
    otherLicense2ExpiryDate: toDateTime(input.otherLicense2ExpiryDate),
    otherLicense3ExpiryDate: toDateTime(input.otherLicense3ExpiryDate),
  };

  return prisma.businessExportCredentials.upsert({
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