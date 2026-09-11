/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Customer Workspace Inquiry context and
 *          exposes Website-scoped Inquiry operations through the
 *          shared Inquiry management service.
 *
 * Architecture:
 * - Customer authentication is resolved by requireWorkspaceAccess().
 * - Website ownership is resolved by requireWorkspaceWebsite().
 * - Inquiry data remains in the shared Inquiry table.
 * - No Workspace-specific Inquiry records are created.
 * - Admin and Workspace therefore operate on the same Inquiry data.
 * ============================================================
 */

import {
    deleteInquiry,
    getInquiryById,
    listInquiries,
    updateInquiry,
  } from "@/lib/services/inquiry-management.service";
  
  import type {
    InquiryListFilters,
    InquiryManagementUpdateInput,
  } from "@/lib/services/inquiry-management.service";
  
  import { requireWorkspaceWebsite } from "../website/website-context.service";
  
  /**
   * ============================================================
   * Workspace Inquiry Context
   * ============================================================
   */
  
  export interface WorkspaceInquiryContext {
    website: {
      id: string;
      name: string;
      slug: string;
      isActive: boolean;
    };
    tenant: {
      id: string;
      name: string;
      slug: string;
    };
    membership: {
      id: string;
      role: string;
    };
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }
  
  /**
   * ============================================================
   * Resolve authenticated Workspace Inquiry context
   *
   * The Website is NEVER accepted from the browser.
   * It is derived from the authenticated Customer Workspace.
   * ============================================================
   */
  
  export async function requireWorkspaceInquiryContext(): Promise<WorkspaceInquiryContext> {
    return requireWorkspaceWebsite();
  }
  
  /**
   * ============================================================
   * List Workspace Inquiries
   *
   * Delegates to the shared Inquiry management service.
   * Website ownership is automatically enforced.
   * ============================================================
   */
  
  export async function listWorkspaceInquiries(
    filters: InquiryListFilters = {},
  ) {
    const context = await requireWorkspaceInquiryContext();
  
    return listInquiries(
      context.website.id,
      filters,
    );
  }
  
  /**
   * ============================================================
   * Get one Workspace Inquiry
   *
   * Delegates to the shared service using the Website resolved
   * from the authenticated Customer Workspace.
   * ============================================================
   */
  
  export async function getWorkspaceInquiryById(
    inquiryId: string,
  ) {
    const context = await requireWorkspaceInquiryContext();
  
    return getInquiryById(
      context.website.id,
      inquiryId,
    );
  }
  
  /**
   * ============================================================
   * Update Workspace Inquiry
   *
   * changedByAdminId is intentionally not supplied here.
   *
   * The current InquiryStatusHistory schema supports an Admin
   * actor. Customer Workspace users are authenticated separately
   * and must not be incorrectly recorded as Admin users.
   *
   * The Inquiry itself is still updated in the shared database.
   * ============================================================
   */
  
  export async function updateWorkspaceInquiry(
    inquiryId: string,
    data: InquiryManagementUpdateInput,
  ) {
    const context = await requireWorkspaceInquiryContext();
  
    return updateInquiry(
      context.website.id,
      inquiryId,
      data,
      null,
    );
  }
  
  /**
   * ============================================================
   * Delete Workspace Inquiry
   *
   * Uses the shared Website-scoped delete operation.
   * ============================================================
   */
  
  export async function deleteWorkspaceInquiry(
    inquiryId: string,
  ) {
    const context = await requireWorkspaceInquiryContext();
  
    return deleteInquiry(
      context.website.id,
      inquiryId,
    );
  }
  
  export default {
    requireWorkspaceInquiryContext,
    listWorkspaceInquiries,
    getWorkspaceInquiryById,
    updateWorkspaceInquiry,
    deleteWorkspaceInquiry,
  };