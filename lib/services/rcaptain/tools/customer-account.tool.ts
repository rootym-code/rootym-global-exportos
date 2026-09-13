/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Controlled Live Data
 * Module          : Customer Account Tool
 *
 * Author          : Prem Singh
 * Purpose         : Provide R-CAPTAIN with a strictly
 *                   allowlisted customer/workspace summary.
 *
 * Security:
 * • Uses the authenticated Workspace context.
 * • Never returns raw email, mobile, bank or credential data.
 * • Sensitive contact values are masked before AI use.
 * • Does not expose the raw Prisma User/Tenant/Membership object.
 * ============================================================
 */

import { resolveRCaptainContext } from "@/lib/services/rcaptain/context.service";
import {
  maskEmail,
  maskMobile,
} from "@/lib/services/rcaptain/privacy.service";

export type RCaptainCustomerAccountSummary = {
  businessName: string;
  websiteName: string;
  websiteSlug: string;

  account: {
    active: boolean;
    role: string;
  };

  website: {
    active: boolean;
  };

  configuredContact: {
    email: string | null;
    mobile: string | null;
  };
};

/**
 * Return a safe customer account summary for R-CAPTAIN.
 *
 * This function is intentionally Workspace-only.
 * Marketing and public Buyer conversations must never be
 * able to call this tool to obtain customer account data.
 */
export async function getCustomerAccountSummary(): Promise<RCaptainCustomerAccountSummary> {
  const context =
    await resolveRCaptainContext({
      mode: "WORKSPACE",
    });

  if (
    !context.tenant ||
    !context.website ||
    !context.user
  ) {
    throw new Error(
      "Authenticated customer Workspace context is required."
    );
  }

  /*
   * Only explicitly approved fields are returned.
   *
   * The raw User/Tenant/Membership objects are deliberately
   * never returned to the caller or AI context.
   */
  return {
    businessName:
      context.tenant.name,

    websiteName:
      context.website.name,

    websiteSlug:
      context.website.slug,

    account: {
      active:
        context.permissions.canAccessWorkspace,
      role:
        "Workspace member",
    },

    website: {
      active: true,
    },

    configuredContact: {
      /*
       * The Context Service intentionally does not expose raw
       * email/mobile values. These fields therefore remain null
       * until a dedicated controlled contact lookup is added.
       *
       * This is deliberate: no raw PII should be fetched merely
       * to answer general account questions.
       */
      email: null,
      mobile: null,
    },
  };
}

/**
 * Mask a contact value when a future explicitly approved
 * customer-facing contact lookup needs to display it.
 *
 * These helpers are kept here as a narrow presentation boundary;
 * raw values must never be included in AI context.
 */
export function getMaskedCustomerEmail(
  email: string | null | undefined
): string | null {
  return maskEmail(email);
}

export function getMaskedCustomerMobile(
  mobile: string | null | undefined
): string | null {
  return maskMobile(mobile);
}
