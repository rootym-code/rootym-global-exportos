/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped business
 *          address required by the Business Configuration module.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export async function getBusinessAddress() {
  const { tenant } = await requireWorkspaceAccess();

  const businessAddress = await prisma.businessAddress.findUnique({
    where: {
      tenantId: tenant.id,
    },
  });

  return businessAddress;
}

export default getBusinessAddress;