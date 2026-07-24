import {
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  
  export function isDueToday(
    followUp: FollowUpEntity,
    referenceDate = new Date(),
  ): boolean {
    const scheduled =
      followUp.scheduledAt;
  
    return (
      scheduled.getFullYear() ===
        referenceDate.getFullYear() &&
      scheduled.getMonth() ===
        referenceDate.getMonth() &&
      scheduled.getDate() ===
        referenceDate.getDate()
    );
  }
  
  export function isUpcoming(
    followUp: FollowUpEntity,
    referenceDate = new Date(),
  ): boolean {
    return (
      followUp.status ===
        FollowUpStatus.PENDING &&
      followUp.scheduledAt >
        referenceDate
    );
  }
  
  export function minutesUntilDue(
    followUp: FollowUpEntity,
    referenceDate = new Date(),
  ): number {
    return Math.floor(
      (
        followUp.scheduledAt.getTime() -
        referenceDate.getTime()
      ) /
        60000,
    );
  }
  
  export function hoursUntilDue(
    followUp: FollowUpEntity,
    referenceDate = new Date(),
  ): number {
    return Math.floor(
      (
        followUp.scheduledAt.getTime() -
        referenceDate.getTime()
      ) /
        3600000,
    );
  }
  
  export function daysUntilDue(
    followUp: FollowUpEntity,
    referenceDate = new Date(),
  ): number {
    return Math.floor(
      (
        followUp.scheduledAt.getTime() -
        referenceDate.getTime()
      ) /
        86400000,
    );
  }
  
  export function sortByScheduledDate(
    followUps: FollowUpEntity[],
  ): FollowUpEntity[] {
    return [...followUps].sort(
      (a, b) =>
        a.scheduledAt.getTime() -
        b.scheduledAt.getTime(),
    );
  }
  
  export function sortByLatestUpdate(
    followUps: FollowUpEntity[],
  ): FollowUpEntity[] {
    return [...followUps].sort(
      (a, b) =>
        b.updatedAt.getTime() -
        a.updatedAt.getTime(),
    );
  }