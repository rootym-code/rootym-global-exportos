import {
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export function validatePendingStatus(
    status: FollowUpStatus,
  ) {
    if (status !== FollowUpStatus.PENDING) {
      throw new Error(
        "Only pending follow-ups can perform this operation.",
      );
    }
  }
  
  export function validateCompletedStatus(
    status: FollowUpStatus,
  ) {
    if (status === FollowUpStatus.COMPLETED) {
      throw new Error(
        "Follow-up is already completed.",
      );
    }
  }
  
  export function validateScheduledDate(
    scheduledAt: Date,
  ) {
    if (Number.isNaN(scheduledAt.getTime())) {
      throw new Error(
        "Invalid scheduled date.",
      );
    }
  }
  
  export function validateDueDate(
    scheduledAt: Date,
    dueAt?: Date | null,
  ) {
    if (!dueAt) {
      return;
    }
  
    if (dueAt < scheduledAt) {
      throw new Error(
        "Due date cannot be earlier than scheduled date.",
      );
    }
  }
  
  export function validateEstimatedMinutes(
    minutes?: number | null,
  ) {
    if (
      minutes !== undefined &&
      minutes !== null &&
      minutes < 0
    ) {
      throw new Error(
        "Estimated minutes cannot be negative.",
      );
    }
  }
  
  export function validateActualMinutes(
    minutes?: number | null,
  ) {
    if (
      minutes !== undefined &&
      minutes !== null &&
      minutes < 0
    ) {
      throw new Error(
        "Actual minutes cannot be negative.",
      );
    }
  }