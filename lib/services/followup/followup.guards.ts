import {
  FollowUpStatus,
} from "@/lib/generated/prisma";


export function canAssignFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}


export function canCompleteFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}


export function canRescheduleFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}


export function canCancelFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}


export function canReopenFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
      FollowUpStatus.COMPLETED ||
    status ===
      FollowUpStatus.CLOSED
  );
}


export function isPendingFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}


export function isCompletedFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.COMPLETED
  );
}


export function isRescheduledFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.RESCHEDULED
  );
}


export function isClosedFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.CLOSED
  );
}


export function isActiveFollowUp(
  status: FollowUpStatus,
): boolean {
  return (
    status ===
    FollowUpStatus.PENDING
  );
}