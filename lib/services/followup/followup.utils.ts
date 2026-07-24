import {
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export function isPendingFollowUp(
    status: FollowUpStatus,
  ) {
    return status === FollowUpStatus.PENDING;
  }
  
  export function isCompletedFollowUp(
    status: FollowUpStatus,
  ) {
    return status === FollowUpStatus.COMPLETED;
  }
  
  export function isOverdueFollowUp(
    status: FollowUpStatus,
    scheduledAt: Date,
  ) {
    return (
      status === FollowUpStatus.PENDING &&
      scheduledAt.getTime() < Date.now()
    );
  }
  
  export function getFollowUpPriorityWeight(
    priority: FollowUpPriority,
  ) {
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
  
  export function sortFollowUps<
    T extends {
      priority: FollowUpPriority;
      scheduledAt: Date;
    },
  >(followUps: T[]) {
    return [...followUps].sort((a, b) => {
      const priorityDiff =
        getFollowUpPriorityWeight(b.priority) -
        getFollowUpPriorityWeight(a.priority);
  
      if (priorityDiff !== 0) {
        return priorityDiff;
      }
  
      return (
        a.scheduledAt.getTime() -
        b.scheduledAt.getTime()
      );
    });
  }