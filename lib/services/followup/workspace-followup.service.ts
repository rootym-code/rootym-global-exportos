/**
 * ============================================================
 * ROOTYM Global ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides Workspace-safe FollowUp mutation operations
 *          while reusing the shared FollowUp outcome engine.
 *
 * Architecture:
 * - Workspace ownership is resolved through Inquiry -> Website.
 * - Workspace actors are recorded as CUSTOMER.
 * - Admin-only performedById is never populated for Workspace
 *   operations.
 * - Existing Admin FollowUpService behavior remains unchanged.
 *
 * ============================================================
 */

import prisma from "@/lib/prisma";

import {
  ActivityActorType,
  ActivityEntityType,
  FollowUpResult,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import activityService from "@/lib/services/activity/activity.service";

import followUpOutcomeEngine from "./outcome.engine";

export interface WorkspaceCompleteFollowUpInput {
  result: FollowUpResult;
  notes?: string;
  actualMinutes?: number;
}

export interface WorkspaceRescheduleFollowUpInput {
  scheduledAt: Date;
  dueAt?: Date;
  notes?: string;
}

export interface WorkspaceSnoozeFollowUpInput {
  scheduledAt: Date;
  reason?: string;
}

async function requireOwnedFollowUp(
  websiteId: string,
  followUpId: string,
) {
  const followUp =
    await prisma.followUp.findFirst({
      where: {
        id: followUpId,
        inquiry: {
          websiteId,
        },
      },
    });

  if (!followUp) {
    throw new Error(
      "Follow-up not found.",
    );
  }

  return followUp;
}

export class WorkspaceFollowUpService {
  async complete(
    websiteId: string,
    workspaceUserId: string,
    followUpId: string,
    input: WorkspaceCompleteFollowUpInput,
  ) {
    const followUp =
      await requireOwnedFollowUp(
        websiteId,
        followUpId,
      );

    if (
      !Object.values(
        FollowUpResult,
      ).includes(input.result)
    ) {
      throw new Error(
        "Invalid follow-up result.",
      );
    }

    if (
      input.actualMinutes !==
        undefined &&
      input.actualMinutes < 0
    ) {
      throw new Error(
        "actualMinutes cannot be negative.",
      );
    }

    const completedAt =
      new Date();

    const updatedFollowUp =
      await prisma.followUp.update({
        where: {
          id: followUp.id,
        },
        data: {
          status:
            FollowUpStatus.COMPLETED,

          result:
            input.result,

          notes:
            input.notes ??
            followUp.notes,

          actualMinutes:
            input.actualMinutes ??
            followUp.actualMinutes,

          completedAt,
        },
        include: {
          inquiry: true,
        },
      });

    await activityService.create({
      entityType:
        ActivityEntityType.FOLLOWUP,

      entityId:
        updatedFollowUp.id,

      action:
        "FOLLOWUP_COMPLETED",

      title:
        "Follow-up completed",

      description:
        input.notes ??
        `Follow-up completed with result: ${input.result}.`,

      metadata: {
        followUpId:
          updatedFollowUp.id,

        inquiryId:
          updatedFollowUp.inquiryId,

        result:
          input.result,

        workspaceUserId,
      },

      actorType:
        ActivityActorType.CUSTOMER,
    });

    const outcome =
      await followUpOutcomeEngine.process({
        followUp,
        result:
          input.result,
      });

    return {
      followUp:
        updatedFollowUp,

      outcome,
    };
  }

  async reschedule(
    websiteId: string,
    workspaceUserId: string,
    followUpId: string,
    input: WorkspaceRescheduleFollowUpInput,
  ) {
    const followUp =
      await requireOwnedFollowUp(
        websiteId,
        followUpId,
      );

    if (
      Number.isNaN(
        input.scheduledAt.getTime(),
      )
    ) {
      throw new Error(
        "Invalid scheduledAt.",
      );
    }

    if (
      input.dueAt &&
      Number.isNaN(
        input.dueAt.getTime(),
      )
    ) {
      throw new Error(
        "Invalid dueAt.",
      );
    }

    const updatedFollowUp =
      await prisma.followUp.update({
        where: {
          id: followUp.id,
        },
        data: {
          scheduledAt:
            input.scheduledAt,

          dueAt:
            input.dueAt ??
            followUp.dueAt,

          notes:
            input.notes ??
            followUp.notes,
        },
        include: {
          inquiry: true,
        },
      });

    await activityService.create({
      entityType:
        ActivityEntityType.FOLLOWUP,

      entityId:
        updatedFollowUp.id,

      action:
        "FOLLOWUP_RESCHEDULED",

      title:
        "Follow-up rescheduled",

      description:
        input.notes ??
        "Follow-up schedule updated.",

      metadata: {
        followUpId:
          updatedFollowUp.id,

        inquiryId:
          updatedFollowUp.inquiryId,

        scheduledAt:
          updatedFollowUp.scheduledAt,

        dueAt:
          updatedFollowUp.dueAt,

        workspaceUserId,
      },

      actorType:
        ActivityActorType.CUSTOMER,
    });

    return updatedFollowUp;
  }

  async snooze(
    websiteId: string,
    workspaceUserId: string,
    followUpId: string,
    input: WorkspaceSnoozeFollowUpInput,
  ) {
    const followUp =
      await requireOwnedFollowUp(
        websiteId,
        followUpId,
      );

    if (
      Number.isNaN(
        input.scheduledAt.getTime(),
      )
    ) {
      throw new Error(
        "Invalid scheduledAt.",
      );
    }

    const updatedFollowUp =
      await prisma.followUp.update({
        where: {
          id: followUp.id,
        },
        data: {
          scheduledAt:
            input.scheduledAt,
        },
        include: {
          inquiry: true,
        },
      });

    await activityService.create({
      entityType:
        ActivityEntityType.FOLLOWUP,

      entityId:
        updatedFollowUp.id,

      action:
        "FOLLOWUP_SNOOZED",

      title:
        "Follow-up snoozed",

      description:
        input.reason ??
        "Follow-up was snoozed.",

      metadata: {
        followUpId:
          updatedFollowUp.id,

        inquiryId:
          updatedFollowUp.inquiryId,

        scheduledAt:
          updatedFollowUp.scheduledAt,

        workspaceUserId,
      },

      actorType:
        ActivityActorType.CUSTOMER,
    });

    return updatedFollowUp;
  }
}

const workspaceFollowUpService =
  new WorkspaceFollowUpService();

export default workspaceFollowUpService;
