import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export interface FollowUpOption {
    value: string;
    label: string;
  }
  
  export interface FollowUpCard {
    id: string;
    title: string;
    companyName: string;
    inquiryNumber: string;
    status: string;
    priority: string;
    actionType: string;
    scheduledAt: Date;
    assignedTo: string | null;
  }
  
  export function toFollowUpCard(
    followUp: FollowUpEntity,
  ): FollowUpCard {
    return {
      id: followUp.id,
  
      title: followUp.title,
  
      companyName:
        followUp.inquiry.companyName,
  
      inquiryNumber:
        followUp.inquiry.inquiryNumber,
  
      status:
        followUp.status,
  
      priority:
        followUp.priority,
  
      actionType:
        followUp.actionType,
  
      scheduledAt:
        followUp.scheduledAt,
  
      assignedTo:
        followUp.assignedTo?.name ??
        null,
    };
  }
  
  export function toFollowUpCards(
    followUps: FollowUpEntity[],
  ): FollowUpCard[] {
    return followUps.map(
      toFollowUpCard,
    );
  }
  
  export function toFollowUpOption(
    followUp: FollowUpEntity,
  ): FollowUpOption {
    return {
      value: followUp.id,
      label: `${followUp.inquiry.inquiryNumber} • ${followUp.title}`,
    };
  }
  
  export function toFollowUpOptions(
    followUps: FollowUpEntity[],
  ): FollowUpOption[] {
    return followUps.map(
      toFollowUpOption,
    );
  }