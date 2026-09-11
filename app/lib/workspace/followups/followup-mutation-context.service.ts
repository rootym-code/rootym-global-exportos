/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Exposes Workspace-safe FollowUp mutations through
 *          the authenticated Customer Workspace context.
 *
 * ============================================================
 */

import {
    FollowUpResult,
  } from "@/lib/generated/prisma";
  
  import workspaceFollowUpService from "@/lib/services/followup/workspace-followup.service";
  
  import {
    requireWorkspaceFollowUpContext,
  } from "./followup-context.service";
  
  export interface WorkspaceFollowUpMutationResult {
    followUp: unknown;
    outcome?: unknown;
  }
  
  export async function completeWorkspaceFollowUp(
    followUpId: string,
    input: {
      result: FollowUpResult;
      notes?: string;
      actualMinutes?: number;
    },
  ): Promise<WorkspaceFollowUpMutationResult> {
    const context =
      await requireWorkspaceFollowUpContext();
  
    return workspaceFollowUpService.complete(
      context.website.id,
      context.user.id,
      followUpId,
      input,
    );
  }
  
  export async function rescheduleWorkspaceFollowUp(
    followUpId: string,
    input: {
      scheduledAt: Date;
      dueAt?: Date;
      notes?: string;
    },
  ) {
    const context =
      await requireWorkspaceFollowUpContext();
  
    return workspaceFollowUpService.reschedule(
      context.website.id,
      context.user.id,
      followUpId,
      input,
    );
  }
  
  export async function snoozeWorkspaceFollowUp(
    followUpId: string,
    input: {
      scheduledAt: Date;
      reason?: string;
    },
  ) {
    const context =
      await requireWorkspaceFollowUpContext();
  
    return workspaceFollowUpService.snooze(
      context.website.id,
      context.user.id,
      followUpId,
      input,
    );
  }
  
  export default {
    completeWorkspaceFollowUp,
    rescheduleWorkspaceFollowUp,
    snoozeWorkspaceFollowUp,
  };
  