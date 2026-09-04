/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the authenticated tenant-scoped business
 *          contact and communication configuration required
 *          by the Business Configuration module.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export interface BusinessContactCommunication {
  id: string;
  tenantId: string;

  primaryEmail: string | null;
  alternateEmail1: string | null;
  alternateEmail2: string | null;
  salesEmail: string | null;
  infoEmail: string | null;

  primaryPhone: string | null;
  alternatePhone: string | null;
  whatsapp: string | null;

  linkedinUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  youtubeUrl: string | null;
  googleBusinessUrl: string | null;
  xTwitterUrl: string | null;
  pinterestUrl: string | null;
  otherSocialUrls: string | null;

  createdAt: Date;
  updatedAt: Date;
}

/**
 * Returns the business contact and communication configuration
 * belonging to the currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated workspace access context.
 */
export async function getBusinessContactCommunication(): Promise<
  BusinessContactCommunication | null
> {
  const { tenant } = await requireWorkspaceAccess();

  const businessContactCommunication =
    await prisma.businessContactCommunication.findUnique({
      where: {
        tenantId: tenant.id,
      },
    });

  return businessContactCommunication;
}

export default getBusinessContactCommunication;