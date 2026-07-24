import {
    FollowUpActionType,
    FollowUpCategory,
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export interface FollowUpMemoryFilters {
    status?: FollowUpStatus;
    priority?: FollowUpPriority;
    category?: FollowUpCategory;
    actionType?: FollowUpActionType;
    assignedToId?: string;
    inquiryId?: string;
  }
  
  export function filterFollowUps(
    followUps: FollowUpEntity[],
    filters: FollowUpMemoryFilters,
  ): FollowUpEntity[] {
    return followUps.filter(
      (followUp) => {
        if (
          filters.status &&
          followUp.status !==
            filters.status
        ) {
          return false;
        }
  
        if (
          filters.priority &&
          followUp.priority !==
            filters.priority
        ) {
          return false;
        }
  
        if (
          filters.category &&
          followUp.category !==
            filters.category
        ) {
          return false;
        }
  
        if (
          filters.actionType &&
          followUp.actionType !==
            filters.actionType
        ) {
          return false;
        }
  
        if (
          filters.assignedToId &&
          followUp.assignedToId !==
            filters.assignedToId
        ) {
          return false;
        }
  
        if (
          filters.inquiryId &&
          followUp.inquiryId !==
            filters.inquiryId
        ) {
          return false;
        }
  
        return true;
      },
    );
  }