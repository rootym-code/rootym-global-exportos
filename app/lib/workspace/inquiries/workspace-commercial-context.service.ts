/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Resolves the authenticated Workspace Website and
 *          exposes Workspace-safe commercial operations.
 * ============================================================
 */

import {
  createWorkspaceProformaInvoice,
  createWorkspaceQuote,
  getWorkspaceQuote,
  type WorkspaceQuoteInput,
} from "@/lib/services/workspace-commercial.service";
import { requireWorkspaceWebsite } from "../website/website-context.service";

export async function requireWorkspaceCommercialContext() {
  return requireWorkspaceWebsite();
}

export async function createWorkspaceInquiryQuote(
  inquiryId: string,
  input: WorkspaceQuoteInput,
) {
  const context = await requireWorkspaceCommercialContext();

  return createWorkspaceQuote(
    context.website.id,
    inquiryId,
    input,
  );
}

export async function getWorkspaceInquiryQuote(
  quoteId: string,
) {
  const context = await requireWorkspaceCommercialContext();

  return getWorkspaceQuote(
    context.website.id,
    quoteId,
  );
}

export async function createWorkspaceInquiryProformaInvoice(
  quoteId: string,
) {
  const context = await requireWorkspaceCommercialContext();

  return createWorkspaceProformaInvoice(
    context.website.id,
    quoteId,
  );
}

export type { WorkspaceQuoteInput };

export default {
  createWorkspaceInquiryQuote,
  getWorkspaceInquiryQuote,
  createWorkspaceInquiryProformaInvoice,
};
