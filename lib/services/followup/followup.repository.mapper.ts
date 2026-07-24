import type {
    Prisma,
  } from "@/lib/generated/prisma";
  
  import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export interface FollowUpRepositoryResult {
    id: string;
    inquiryId: string;
    title: string;
    status: string;
    priority: string;
    scheduledAt: Date;
    assignedToId: string | null;
  }
  
  export function mapFollowUpRepositoryResult(
    followUp: FollowUpEntity,
  ): FollowUpRepositoryResult {
    return {
      id: followUp.id,
  
      inquiryId:
        followUp.inquiryId,
  
      title:
        followUp.title,
  
      status:
        followUp.status,
  
      priority:
        followUp.priority,
  
      scheduledAt:
        followUp.scheduledAt,
  
      assignedToId:
        followUp.assignedToId,
    };
  }
  
  export function mapFollowUpCreateInput(
    input: Prisma.FollowUpCreateInput,
  ): Prisma.FollowUpCreateInput {
    return {
      ...input,
    };
  }
  
  export function mapFollowUpUpdateInput(
    input: Prisma.FollowUpUpdateInput,
  ): Prisma.FollowUpUpdateInput {
    return {
      ...input,
    };
  }