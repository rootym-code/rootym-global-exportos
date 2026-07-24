import {
    FollowUpStatus,
    FollowUpPriority,
    FollowUpCategory,
    FollowUpActionType,
  } from "@/lib/generated/prisma";
  
  import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export function isPending(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.status ===
      FollowUpStatus.PENDING
    );
  }
  
  export function isCompleted(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.status ===
      FollowUpStatus.COMPLETED
    );
  }
  
  export function isMissed(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.status ===
      FollowUpStatus.MISSED
    );
  }
  
  export function isCancelled(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.status ===
      FollowUpStatus.CANCELLED
    );
  }
  
  export function isOverdue(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.status ===
        FollowUpStatus.PENDING &&
      followUp.scheduledAt <
        new Date()
    );
  }
  
  export function isUrgent(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.priority ===
      FollowUpPriority.URGENT
    );
  }
  
  export function isHighPriority(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.priority ===
      FollowUpPriority.HIGH
    );
  }
  
  export function isSalesFollowUp(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.category ===
      FollowUpCategory.SALES
    );
  }
  
  export function isNegotiationFollowUp(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.category ===
      FollowUpCategory.NEGOTIATION
    );
  }
  
  export function isCallFollowUp(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.actionType ===
      FollowUpActionType.CALL
    );
  }
  
  export function isWhatsAppFollowUp(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.actionType ===
      FollowUpActionType.WHATSAPP
    );
  }
  
  export function isAssigned(
    followUp: FollowUpEntity,
  ): boolean {
    return (
      followUp.assignedToId !==
      null
    );
  }
  
  export function isCompletedToday(
    followUp: FollowUpEntity,
  ): boolean {
    if (
      !followUp.completedAt
    ) {
      return false;
    }
  
    const today =
      new Date();
  
    return (
      followUp.completedAt
        .toDateString() ===
      today.toDateString()
    );
  }