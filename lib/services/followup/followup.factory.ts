import {
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  import type { CreateFollowUpInput } from "./types";
  
  export class FollowUpFactory {
    static create(
      input: CreateFollowUpInput,
      sequence: number,
    ) {
      return {
        inquiryId: input.inquiryId,
        sequence,
  
        title: input.title,
        description: input.description,
        notes: input.notes,
  
        actionType: input.actionType,
        category: input.category,
  
        priority:
          input.priority ??
          FollowUpPriority.MEDIUM,
  
        status: FollowUpStatus.PENDING,
  
        scheduledAt: input.scheduledAt,
        dueAt: input.dueAt,
  
        assignedToId: input.assignedToId,
  
        estimatedMinutes:
          input.estimatedMinutes,
      };
    }
  }