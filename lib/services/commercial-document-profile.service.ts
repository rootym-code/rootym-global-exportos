/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves tenant-scoped seller identity and branding
 *          used by Quotations and Proforma Invoices.
 *
 *          Seller details come from the authenticated Website's
 *          Tenant business configuration and Website branding.
 *          This keeps commercial documents aligned with the
 *          Customer Workspace source of truth.
 * ============================================================
 */

import prisma from "@/lib/prisma";

export interface CommercialSellerProfile {
  businessName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  fssaiNumber: string;
  iecNumber: string;
  logoUrl: string;
  logoMimeType: string;
}

function findNamedLicense(
  exportCredentials: {
    otherLicense1Name: string | null;
    otherLicense1Number: string | null;
    otherLicense2Name: string | null;
    otherLicense2Number: string | null;
    otherLicense3Name: string | null;
    otherLicense3Number: string | null;
  } | null,
  licenseName: string,
) {
  if (!exportCredentials) {
    return "";
  }

  const target = licenseName.trim().toLowerCase();

  const candidates = [
    {
      name: exportCredentials.otherLicense1Name,
      number: exportCredentials.otherLicense1Number,
    },
    {
      name: exportCredentials.otherLicense2Name,
      number: exportCredentials.otherLicense2Number,
    },
    {
      name: exportCredentials.otherLicense3Name,
      number: exportCredentials.otherLicense3Number,
    },
  ];

  return (
    candidates.find(
      (license) =>
        license.name?.trim().toLowerCase() === target,
    )?.number?.trim() ?? ""
  );
}

export async function getCommercialSellerProfile(
  websiteId: string,
): Promise<CommercialSellerProfile> {
  const website = await prisma.website.findFirst({
    where: {
      id: websiteId,
      isActive: true,
    },
    include: {
      configuration: true,
      branding: {
        include: {
          logoMedia: true,
        },
      },
      tenant: {
        include: {
          businessProfile: true,
          businessAddress: true,
          businessContactCommunication: true,
          businessExportCredentials: true,
        },
      },
    },
  });

  if (!website) {
    throw new Error("Website not found.");
  }

  const profile = website.tenant.businessProfile;
  const address = website.tenant.businessAddress;
  const contact = website.tenant.businessContactCommunication;
  const exportCredentials =
    website.tenant.businessExportCredentials;

  const addressParts = [
    address?.addressLine1,
    address?.addressLine2,
    address?.city,
    address?.state,
    address?.postalCode,
    address?.country,
  ].filter(Boolean);

  return {
    businessName:
      profile?.businessName ||
      website.tenant.name ||
      website.name,
    tagline:
      website.configuration?.tagline?.trim() ||
      "",
    address: addressParts.join(", "),
    phone:
      contact?.primaryPhone?.trim() ||
      profile?.phone?.trim() ||
      "",
    email:
      contact?.primaryEmail?.trim() ||
      profile?.email?.trim() ||
      "",
    website:
      profile?.website?.trim() ||
      "",
    gstin:
      exportCredentials?.gstin?.trim() ||
      "",
    fssaiNumber:
      findNamedLicense(
        exportCredentials,
        "FSSAI",
      ),
    iecNumber:
      exportCredentials?.iecNumber?.trim() ||
      "",
    logoUrl:
      website.branding?.logoMedia?.fileUrl?.trim() ||
      "",
    logoMimeType:
      website.branding?.logoMedia?.mimeType?.trim() ||
      "",
  };
}

export default getCommercialSellerProfile;
