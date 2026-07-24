import type {
  Prisma,
} from "@/lib/generated/prisma";

import type {
  FollowUpEntity,
} from "./followup.entity";

export interface FollowUpListDto {
  id: string;
  inquiryId: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  assignedToId: string | null;
  assignedToName: string | null;
  title: string;
  actionType: string;
  category: string;
  priority: string;
  status: string;
  result: string | null;
  scheduledAt: Date;
  dueAt: Date | null;
  completedAt: Date | null;
}

export function toFollowUpListDto(
  followUp: FollowUpEntity,
): FollowUpListDto {
  return {
    id: followUp.id,

    inquiryId: followUp.inquiryId,

    inquiryNumber:
      followUp.inquiry.inquiryNumber,

    companyName:
      followUp.inquiry.companyName,

    contactPerson:
      followUp.inquiry.contactPerson,

    assignedToId:
      followUp.assignedToId,

    assignedToName:
      followUp.assignedTo?.name ??
      null,

    title: followUp.title,

    actionType:
      followUp.actionType,

    category:
      followUp.category,

    priority:
      followUp.priority,

    status:
      followUp.status,

    result:
      followUp.result ?? null,

    scheduledAt:
      followUp.scheduledAt,

    dueAt:
      followUp.dueAt,

    completedAt:
      followUp.completedAt,
  };
}

export function toFollowUpListDtos(
  followUps: FollowUpEntity[],
): FollowUpListDto[] {
  return followUps.map(
    toFollowUpListDto,
  );
}

export function toFollowUpCreateInput(
  data: Prisma.FollowUpUncheckedCreateInput,
): Prisma.FollowUpUncheckedCreateInput {
  return {
    ...data,
  };
}

export function toFollowUpUpdateInput(
  data: Prisma.FollowUpUncheckedUpdateInput,
): Prisma.FollowUpUncheckedUpdateInput {
  return {
    ...data,
  };
}