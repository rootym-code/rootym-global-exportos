import type {
    FollowUpEntity,
  } from "./followup.entity";
  
  export type FollowUpSortDirection =
    | "asc"
    | "desc";
  
  export type FollowUpSortField =
    | "scheduledAt"
    | "createdAt"
    | "updatedAt"
    | "priority"
    | "sequence"
    | "companyName"
    | "inquiryNumber"
    | "title";
  
  const priorityWeight = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
    URGENT: 4,
  } as const;
  
  export function sortFollowUps(
    followUps: FollowUpEntity[],
    field: FollowUpSortField,
    direction: FollowUpSortDirection = "asc",
  ): FollowUpEntity[] {
    const sorted = [...followUps];
  
    sorted.sort((a, b) => {
      let result = 0;
  
      switch (field) {
        case "scheduledAt":
          result =
            a.scheduledAt.getTime() -
            b.scheduledAt.getTime();
          break;
  
        case "createdAt":
          result =
            a.createdAt.getTime() -
            b.createdAt.getTime();
          break;
  
        case "updatedAt":
          result =
            a.updatedAt.getTime() -
            b.updatedAt.getTime();
          break;
  
        case "priority":
          result =
            priorityWeight[
              a.priority
            ] -
            priorityWeight[
              b.priority
            ];
          break;
  
        case "sequence":
          result =
            a.sequence -
            b.sequence;
          break;
  
        case "companyName":
          result =
            a.inquiry.companyName.localeCompare(
              b.inquiry.companyName,
            );
          break;
  
        case "inquiryNumber":
          result =
            a.inquiry.inquiryNumber.localeCompare(
              b.inquiry.inquiryNumber,
            );
          break;
  
        case "title":
          result =
            a.title.localeCompare(
              b.title,
            );
          break;
      }
  
      return direction === "asc"
        ? result
        : -result;
    });
  
    return sorted;
  }