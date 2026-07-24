import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import type {
  FollowUpEntity,
} from "./followup.entity";


export interface FollowUpStatistics {
  total: number;

  pending: number;

  completed: number;

  rescheduled: number;

  closed: number;

  overdue: number;

  urgent: number;

  completionRate: number;
}


export function calculateFollowUpStatistics(
  followUps: FollowUpEntity[],
): FollowUpStatistics {

  const now = new Date();

  const total = followUps.length;


  const pending = followUps.filter(
    (followUp) =>
      followUp.status ===
      FollowUpStatus.PENDING,
  ).length;


  const completed = followUps.filter(
    (followUp) =>
      followUp.status ===
      FollowUpStatus.COMPLETED,
  ).length;


  const rescheduled = followUps.filter(
    (followUp) =>
      followUp.status ===
      FollowUpStatus.RESCHEDULED,
  ).length;


  const closed = followUps.filter(
    (followUp) =>
      followUp.status ===
      FollowUpStatus.CLOSED,
  ).length;


  const overdue = followUps.filter(
    (followUp) =>
      followUp.status ===
        FollowUpStatus.PENDING &&
      followUp.scheduledAt < now,
  ).length;


  const urgent = followUps.filter(
    (followUp) =>
      followUp.priority ===
      FollowUpPriority.URGENT,
  ).length;


  return {
    total,

    pending,

    completed,

    rescheduled,

    closed,

    overdue,

    urgent,

    completionRate:
      total === 0
        ? 0
        : Number(
            (
              (completed / total) *
              100
            ).toFixed(2),
          ),
  };
}