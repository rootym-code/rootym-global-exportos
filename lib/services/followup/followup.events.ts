import type {
    FollowUp,
  } from "@/lib/generated/prisma";
  
  export type FollowUpEventType =
    | "followup.created"
    | "followup.updated"
    | "followup.assigned"
    | "followup.completed"
    | "followup.rescheduled"
    | "followup.snoozed"
    | "followup.deleted";
  
  export interface FollowUpEvent<T = FollowUp> {
    type: FollowUpEventType;
    occurredAt: Date;
    payload: T;
  }
  
  export function createFollowUpEvent<T = FollowUp>(
    type: FollowUpEventType,
    payload: T,
  ): FollowUpEvent<T> {
    return {
      type,
      occurredAt: new Date(),
      payload,
    };
  }
  
  export function isFollowUpEvent(
    value: unknown,
  ): value is FollowUpEvent {
    return (
      typeof value === "object" &&
      value !== null &&
      "type" in value &&
      "occurredAt" in value &&
      "payload" in value
    );
  }