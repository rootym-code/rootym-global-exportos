import {
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export function formatFollowUpStatus(
    status: FollowUpStatus,
  ) {
    switch (status) {
      case FollowUpStatus.PENDING:
        return "Pending";
  
      case FollowUpStatus.COMPLETED:
        return "Completed";
  
      case FollowUpStatus.MISSED:
        return "Missed";
  
      case FollowUpStatus.CANCELLED:
        return "Cancelled";
  
      default:
        return status;
    }
  }
  
  export function formatFollowUpPriority(
    priority: FollowUpPriority,
  ) {
    switch (priority) {
      case FollowUpPriority.URGENT:
        return "Urgent";
  
      case FollowUpPriority.HIGH:
        return "High";
  
      case FollowUpPriority.MEDIUM:
        return "Medium";
  
      case FollowUpPriority.LOW:
        return "Low";
  
      default:
        return priority;
    }
  }
  
  export function formatDuration(
    minutes?: number | null,
  ) {
    if (minutes == null) {
      return "-";
    }
  
    if (minutes < 60) {
      return `${minutes} min`;
    }
  
    const hours = Math.floor(minutes / 60);
    const remaining = minutes % 60;
  
    if (remaining === 0) {
      return `${hours} hr`;
    }
  
    return `${hours} hr ${remaining} min`;
  }
  
  export function formatFollowUpSequence(
    sequence: number,
  ) {
    return `#${sequence.toString().padStart(3, "0")}`;
  }
  
  export function formatScheduledDate(
    date: Date,
  ) {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }