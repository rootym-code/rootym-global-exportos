import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "success"
  | "warning";


export function getStatusBadgeVariant(
  status: FollowUpStatus,
): BadgeVariant {
  switch (status) {
    case FollowUpStatus.PENDING:
      return "warning";

    case FollowUpStatus.COMPLETED:
      return "success";

    case FollowUpStatus.RESCHEDULED:
      return "warning";

    case FollowUpStatus.CLOSED:
      return "secondary";

    default:
      return "default";
  }
}


export function getPriorityBadgeVariant(
  priority: FollowUpPriority,
): BadgeVariant {
  switch (priority) {
    case FollowUpPriority.URGENT:
      return "destructive";

    case FollowUpPriority.HIGH:
      return "warning";

    case FollowUpPriority.MEDIUM:
      return "default";

    case FollowUpPriority.LOW:
      return "secondary";

    default:
      return "default";
  }
}


export function isAttentionRequired(
  status: FollowUpStatus,
  priority: FollowUpPriority,
) {
  return (
    status === FollowUpStatus.PENDING &&
    (priority === FollowUpPriority.HIGH ||
      priority === FollowUpPriority.URGENT)
  );
}