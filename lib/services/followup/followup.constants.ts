import {
    FollowUpActionType,
    FollowUpCategory,
    FollowUpPriority,
    FollowUpResult,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export const FOLLOWUP_STATUSES = Object.values(
    FollowUpStatus,
  );
  
  export const FOLLOWUP_PRIORITIES = Object.values(
    FollowUpPriority,
  );
  
  export const FOLLOWUP_ACTIONS = Object.values(
    FollowUpActionType,
  );
  
  export const FOLLOWUP_CATEGORIES = Object.values(
    FollowUpCategory,
  );
  
  export const FOLLOWUP_RESULTS = Object.values(
    FollowUpResult,
  );
  
  export const DEFAULT_FOLLOWUP_PRIORITY =
    FollowUpPriority.MEDIUM;
  
  export const DEFAULT_FOLLOWUP_STATUS =
    FollowUpStatus.PENDING;
  
  export const FOLLOWUP_PAGE_SIZE = 20;
  
  export const FOLLOWUP_MAX_PAGE_SIZE = 100;
  
  export const FOLLOWUP_DEFAULT_ESTIMATED_MINUTES = 15;