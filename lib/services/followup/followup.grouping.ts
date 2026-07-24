import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export function groupByStatus(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.status,
    );
  }
  
  export function groupByPriority(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.priority,
    );
  }
  
  export function groupByCategory(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.category,
    );
  }
  
  export function groupByActionType(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.actionType,
    );
  }
  
  export function groupByAssignedTo(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.assignedToId ??
        "unassigned",
    );
  }
  
  export function groupByInquiry(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.inquiryId,
    );
  }
  
  export function groupByScheduledDate(
    followUps: FollowUpEntity[],
  ) {
    return Object.groupBy(
      followUps,
      (followUp) =>
        followUp.scheduledAt
          .toISOString()
          .split("T")[0],
    );
  }