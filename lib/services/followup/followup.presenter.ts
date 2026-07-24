import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export interface FollowUpResponse {
    id: string;
    inquiry: {
      id: string;
      inquiryNumber: string;
      companyName: string;
      contactPerson: string;
      country: string;
      product: string;
    };
    assignedTo: {
      id: string;
      name: string;
      email: string;
    } | null;
    completedBy: {
      id: string;
      name: string;
      email: string;
    } | null;
    sequence: number;
    title: string;
    description: string | null;
    notes: string | null;
    actionType: string;
    category: string;
    priority: string;
    status: string;
    result: string | null;
    scheduledAt: Date;
    dueAt: Date | null;
    estimatedMinutes: number | null;
    actualMinutes: number | null;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export function presentFollowUp(
    followUp: FollowUpEntity,
  ): FollowUpResponse {
    return {
      id: followUp.id,
  
      inquiry: {
        id: followUp.inquiry.id,
        inquiryNumber:
          followUp.inquiry.inquiryNumber,
        companyName:
          followUp.inquiry.companyName,
        contactPerson:
          followUp.inquiry.contactPerson,
        country:
          followUp.inquiry.country,
        product:
          followUp.inquiry.product,
      },
  
      assignedTo:
        followUp.assignedTo
          ? {
              id:
                followUp.assignedTo.id,
              name:
                followUp.assignedTo.name,
              email:
                followUp.assignedTo.email,
            }
          : null,
  
      completedBy:
        followUp.completedBy
          ? {
              id:
                followUp.completedBy.id,
              name:
                followUp.completedBy.name,
              email:
                followUp.completedBy.email,
            }
          : null,
  
      sequence:
        followUp.sequence,
  
      title:
        followUp.title,
  
      description:
        followUp.description,
  
      notes:
        followUp.notes,
  
      actionType:
        followUp.actionType,
  
      category:
        followUp.category,
  
      priority:
        followUp.priority,
  
      status:
        followUp.status,
  
      result:
        followUp.result,
  
      scheduledAt:
        followUp.scheduledAt,
  
      dueAt:
        followUp.dueAt,
  
      estimatedMinutes:
        followUp.estimatedMinutes,
  
      actualMinutes:
        followUp.actualMinutes,
  
      completedAt:
        followUp.completedAt,
  
      createdAt:
        followUp.createdAt,
  
      updatedAt:
        followUp.updatedAt,
    };
  }
  
  export function presentFollowUps(
    followUps: FollowUpEntity[],
  ): FollowUpResponse[] {
    return followUps.map(
      presentFollowUp,
    );
  }