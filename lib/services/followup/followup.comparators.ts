import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export function compareByScheduledDate(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return (
      a.scheduledAt.getTime() -
      b.scheduledAt.getTime()
    );
  }
  
  export function compareByPriority(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    const order = {
      LOW: 1,
      MEDIUM: 2,
      HIGH: 3,
      URGENT: 4,
    } as const;
  
    return (
      order[a.priority] -
      order[b.priority]
    );
  }
  
  export function compareBySequence(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return (
      a.sequence -
      b.sequence
    );
  }
  
  export function compareByCreatedAt(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return (
      b.createdAt.getTime() -
      a.createdAt.getTime()
    );
  }
  
  export function compareByUpdatedAt(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return (
      b.updatedAt.getTime() -
      a.updatedAt.getTime()
    );
  }
  
  export function compareByCompanyName(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return a.inquiry.companyName.localeCompare(
      b.inquiry.companyName,
    );
  }
  
  export function compareByInquiryNumber(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return a.inquiry.inquiryNumber.localeCompare(
      b.inquiry.inquiryNumber,
    );
  }
  
  export function compareByTitle(
    a: FollowUpEntity,
    b: FollowUpEntity,
  ): number {
    return a.title.localeCompare(
      b.title,
    );
  }