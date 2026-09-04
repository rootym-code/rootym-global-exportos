/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Persists authenticated tenant-scoped business
 *          contact, communication, social media and online
 *          business presence configuration.
 * ============================================================
 */

import prisma from "@/lib/prisma";

import { requireWorkspaceAccess } from "../require-workspace-access";

export interface SaveBusinessContactCommunicationInput {
  primaryEmail?: string;
  alternateEmail1?: string;
  alternateEmail2?: string;
  salesEmail?: string;
  infoEmail?: string;

  primaryPhone?: string;
  alternatePhone?: string;
  whatsapp?: string;

  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  googleBusinessUrl?: string;
  xTwitterUrl?: string;
  pinterestUrl?: string;
  otherSocialUrls?: string;
}

/**
 * Saves the business contact and communication configuration
 * belonging to the currently authenticated customer workspace.
 *
 * Tenant identity is derived exclusively from the
 * authenticated workspace access context.
 */
export async function saveBusinessContactCommunication(
  input: SaveBusinessContactCommunicationInput
) {
  const { tenant, membership } = await requireWorkspaceAccess();

  const canEdit =
    membership.role === "OWNER" || membership.role === "ADMIN";

  if (!canEdit) {
    throw new Error(
      "You do not have permission to modify Contact & Communication."
    );
  }

  const businessContactCommunication =
    await prisma.businessContactCommunication.upsert({
      where: {
        tenantId: tenant.id,
      },
      create: {
        tenantId: tenant.id,

        primaryEmail: input.primaryEmail || null,
        alternateEmail1: input.alternateEmail1 || null,
        alternateEmail2: input.alternateEmail2 || null,
        salesEmail: input.salesEmail || null,
        infoEmail: input.infoEmail || null,

        primaryPhone: input.primaryPhone || null,
        alternatePhone: input.alternatePhone || null,
        whatsapp: input.whatsapp || null,

        linkedinUrl: input.linkedinUrl || null,
        facebookUrl: input.facebookUrl || null,
        instagramUrl: input.instagramUrl || null,
        youtubeUrl: input.youtubeUrl || null,
        googleBusinessUrl: input.googleBusinessUrl || null,
        xTwitterUrl: input.xTwitterUrl || null,
        pinterestUrl: input.pinterestUrl || null,
        otherSocialUrls: input.otherSocialUrls || null,
      },
      update: {
        primaryEmail: input.primaryEmail || null,
        alternateEmail1: input.alternateEmail1 || null,
        alternateEmail2: input.alternateEmail2 || null,
        salesEmail: input.salesEmail || null,
        infoEmail: input.infoEmail || null,

        primaryPhone: input.primaryPhone || null,
        alternatePhone: input.alternatePhone || null,
        whatsapp: input.whatsapp || null,

        linkedinUrl: input.linkedinUrl || null,
        facebookUrl: input.facebookUrl || null,
        instagramUrl: input.instagramUrl || null,
        youtubeUrl: input.youtubeUrl || null,
        googleBusinessUrl: input.googleBusinessUrl || null,
        xTwitterUrl: input.xTwitterUrl || null,
        pinterestUrl: input.pinterestUrl || null,
        otherSocialUrls: input.otherSocialUrls || null,
      },
    });

  return businessContactCommunication;
}

export default saveBusinessContactCommunication;