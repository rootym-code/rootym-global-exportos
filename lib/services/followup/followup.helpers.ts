import {
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export function isPending(
    status: FollowUpStatus,
  ): boolean {
    return status === FollowUpStatus.PENDING;
  }
  
  export function isCompleted(
    status: FollowUpStatus,
  ): boolean {
    return status === FollowUpStatus.COMPLETED;
  }
  
  export function isCancelled(
    status: FollowUpStatus,
  ): boolean {
    return status === FollowUpStatus.CANCELLED;
  }
  
  export function isMissed(
    status: FollowUpStatus,
  ): boolean {
    return status === FollowUpStatus.MISSED;
  }
  
  export function isOverdue(
    status: FollowUpStatus,
    scheduledAt: Date,
  ): boolean {
    return (
      status === FollowUpStatus.PENDING &&
      scheduledAt.getTime() < Date.now()
    );
  }
  
  export function priorityScore(
    priority: FollowUpPriority,
  ): number {
    switch (priority) {
      case FollowUpPriority.URGENT:
        return 4;
  
      case FollowUpPriority.HIGH:
        return 3;
  
      case FollowUpPriority.MEDIUM:
        return 2;
  
      case FollowUpPriority.LOW:
      default:
        return 1;
    }
  }
  
  export function comparePriority(
    a: FollowUpPriority,
    b: FollowUpPriority,
  ): number {
    return priorityScore(b) - priorityScore(a);
  }
  
  export function compareScheduledAt(
    a: Date,
    b: Date,
  ): number {
    return a.getTime() - b.getTime();
  }