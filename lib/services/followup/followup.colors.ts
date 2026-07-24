import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";


export const FOLLOWUP_STATUS_COLORS: Record<
  FollowUpStatus,
  string
> = {
  PENDING: "amber",
  COMPLETED: "green",
  RESCHEDULED: "red",
  CLOSED: "gray",
};


export const FOLLOWUP_PRIORITY_COLORS: Record<
  FollowUpPriority,
  string
> = {
  LOW: "slate",
  MEDIUM: "blue",
  HIGH: "orange",
  URGENT: "red",
};


export function getStatusColor(
  status: FollowUpStatus,
) {
  return FOLLOWUP_STATUS_COLORS[status];
}


export function getPriorityColor(
  priority: FollowUpPriority,
) {
  return FOLLOWUP_PRIORITY_COLORS[priority];
}