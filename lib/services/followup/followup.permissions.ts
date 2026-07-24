import {
  AdminRole,
  FollowUpStatus,
} from "@/lib/generated/prisma";

export interface FollowUpPermissionContext {
  role: AdminRole;
  assignedToId?: string | null;
  currentAdminId: string;
  status: FollowUpStatus;
}

export function canViewFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  return (
    context.role ===
      AdminRole.SUPER_ADMIN ||
    context.assignedToId ===
      context.currentAdminId
  );
}

export function canAssignFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  return (
    context.role ===
      AdminRole.SUPER_ADMIN &&
    context.status ===
      FollowUpStatus.PENDING
  );
}

export function canCompleteFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  if (
    context.status !==
    FollowUpStatus.PENDING
  ) {
    return false;
  }

  return (
    context.role ===
      AdminRole.SUPER_ADMIN ||
    context.assignedToId ===
      context.currentAdminId
  );
}

export function canEditFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  if (
    context.status !==
    FollowUpStatus.PENDING
  ) {
    return false;
  }

  return (
    context.role ===
      AdminRole.SUPER_ADMIN ||
    context.assignedToId ===
      context.currentAdminId
  );
}

export function canDeleteFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  return (
    context.role ===
      AdminRole.SUPER_ADMIN
  );
}

export function canRescheduleFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  return (
    context.status ===
      FollowUpStatus.PENDING &&
    (
      context.role ===
        AdminRole.SUPER_ADMIN ||
      context.assignedToId ===
        context.currentAdminId
    )
  );
}

export function canCancelFollowUp(
  context: FollowUpPermissionContext,
): boolean {
  return (
    context.role ===
      AdminRole.SUPER_ADMIN &&
    context.status ===
      FollowUpStatus.PENDING
  );
}