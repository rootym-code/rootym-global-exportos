import {
    FollowUpActionType,
    FollowUpCategory,
    FollowUpPriority,
    FollowUpResult,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export const FOLLOW_UP_STATUSES: FollowUpStatus[] = [
    FollowUpStatus.PENDING,
    FollowUpStatus.COMPLETED,
    FollowUpStatus.MISSED,
    FollowUpStatus.CANCELLED,
  ];
  
  export const FOLLOW_UP_PRIORITIES: FollowUpPriority[] = [
    FollowUpPriority.LOW,
    FollowUpPriority.MEDIUM,
    FollowUpPriority.HIGH,
    FollowUpPriority.URGENT,
  ];
  
  export const FOLLOW_UP_ACTION_TYPES: FollowUpActionType[] = [
    FollowUpActionType.CALL,
    FollowUpActionType.WHATSAPP,
    FollowUpActionType.EMAIL,
    FollowUpActionType.QUOTATION,
    FollowUpActionType.MEETING,
    FollowUpActionType.SAMPLE,
    FollowUpActionType.PAYMENT,
    FollowUpActionType.DOCUMENTATION,
    FollowUpActionType.SHIPMENT,
    FollowUpActionType.OTHER,
  ];
  
  export const FOLLOW_UP_CATEGORIES: FollowUpCategory[] = [
    FollowUpCategory.SALES,
    FollowUpCategory.NEGOTIATION,
    FollowUpCategory.PAYMENT,
    FollowUpCategory.DOCUMENTATION,
    FollowUpCategory.SHIPMENT,
    FollowUpCategory.GENERAL,
  ];
  
  export const FOLLOW_UP_RESULTS: FollowUpResult[] = [
    FollowUpResult.BUYER_RESPONDED,
    FollowUpResult.NO_ANSWER,
    FollowUpResult.BUSY,
    FollowUpResult.FOLLOWUP_REQUIRED,
    FollowUpResult.DEAL_CLOSED,
    FollowUpResult.NOT_INTERESTED,
  ];
  
  export const FOLLOW_UP_OPEN_STATUSES: FollowUpStatus[] = [
    FollowUpStatus.PENDING,
  ];
  
  export const FOLLOW_UP_CLOSED_STATUSES: FollowUpStatus[] = [
    FollowUpStatus.COMPLETED,
    FollowUpStatus.MISSED,
    FollowUpStatus.CANCELLED,
  ];
  
  export function isOpenFollowUpStatus(
    status: FollowUpStatus,
  ): boolean {
    return FOLLOW_UP_OPEN_STATUSES.includes(status);
  }
  
  export function isClosedFollowUpStatus(
    status: FollowUpStatus,
  ): boolean {
    return FOLLOW_UP_CLOSED_STATUSES.includes(status);
  }