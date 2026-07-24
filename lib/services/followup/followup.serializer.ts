import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export interface SerializedFollowUp {
    id: string;
    inquiryId: string;
    inquiryNumber: string;
    companyName: string;
    contactPerson: string;
    country: string;
    product: string;
    assignedToId: string | null;
    assignedToName: string | null;
    completedById: string | null;
    completedByName: string | null;
    sequence: number;
    title: string;
    description: string | null;
    notes: string | null;
    actionType: string;
    category: string;
    priority: string;
    status: string;
    result: string | null;
    scheduledAt: string;
    dueAt: string | null;
    completedAt: string | null;
    estimatedMinutes: number | null;
    actualMinutes: number | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export function serializeFollowUp(
    followUp: FollowUpEntity,
  ): SerializedFollowUp {
    return {
      id: followUp.id,
  
      inquiryId: followUp.inquiryId,
  
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
  
      assignedToId:
        followUp.assignedToId,
  
      assignedToName:
        followUp.assignedTo?.name ??
        null,
  
      completedById:
        followUp.completedById,
  
      completedByName:
        followUp.completedBy?.name ??
        null,
  
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
        followUp.scheduledAt.toISOString(),
  
      dueAt:
        followUp.dueAt?.toISOString() ??
        null,
  
      completedAt:
        followUp.completedAt?.toISOString() ??
        null,
  
      estimatedMinutes:
        followUp.estimatedMinutes,
  
      actualMinutes:
        followUp.actualMinutes,
  
      createdAt:
        followUp.createdAt.toISOString(),
  
      updatedAt:
        followUp.updatedAt.toISOString(),
    };
  }
  
  export function serializeFollowUps(
    followUps: FollowUpEntity[],
  ): SerializedFollowUp[] {
    return followUps.map(
      serializeFollowUp,
    );
  }