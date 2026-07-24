import {
    FollowUpActionType,
    FollowUpCategory,
    FollowUpPriority,
    FollowUpResult,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  /* ============================================================
     CREATE
  ============================================================ */
  
  export interface CreateFollowUpInput {
    inquiryId: string;
  
    title: string;
  
    description?: string;
  
    actionType: FollowUpActionType;
  
    category: FollowUpCategory;
  
    scheduledAt: Date;
  
    priority?: FollowUpPriority;
  
    dueAt?: Date;
  
    assignedToId?: string;
  
    estimatedMinutes?: number;
  
    notes?: string;
  }
  
  /* ============================================================
     UPDATE
  ============================================================ */
  
  export interface UpdateFollowUpInput {
    title?: string;
  
    description?: string;
  
    actionType?: FollowUpActionType;
  
    category?: FollowUpCategory;
  
    priority?: FollowUpPriority;
  
    status?: FollowUpStatus;
  
    scheduledAt?: Date;
  
    dueAt?: Date;
  
    estimatedMinutes?: number;
  
    actualMinutes?: number;
  
    notes?: string;
  }
  
  /* ============================================================
     ASSIGN
  ============================================================ */
  
  export interface AssignFollowUpInput {
    assignedToId: string;
  }
  
  /* ============================================================
     COMPLETE
  ============================================================ */
  
  export interface CompleteFollowUpInput {
    result: FollowUpResult;
  
    notes?: string;
  
    actualMinutes?: number;
  }
  
  /* ============================================================
     RESCHEDULE
  ============================================================ */
  
  export interface RescheduleFollowUpInput {
    scheduledAt: Date;
  
    dueAt?: Date;
  
    notes?: string;
  }
  
  /* ============================================================
     SNOOZE
  ============================================================ */
  
  export interface SnoozeFollowUpInput {
    scheduledAt: Date;
  
    reason?: string;
  }
  
  /* ============================================================
     FILTERS
  ============================================================ */
  
  export interface FollowUpFilters {
    inquiryId?: string;
  
    assignedToId?: string;
  
    status?: FollowUpStatus;
  
    priority?: FollowUpPriority;
  
    category?: FollowUpCategory;
  
    actionType?: FollowUpActionType;
  
    fromDate?: Date;
  
    toDate?: Date;
  
    search?: string;
  
    page?: number;
  
    limit?: number;
  }
  
  /* ============================================================
     DASHBOARD
  ============================================================ */
  
  export interface FollowUpDashboardSummary {
    pending: number;
  
    overdue: number;
  
    today: number;
  
    upcoming: number;
  
    completed: number;
  }