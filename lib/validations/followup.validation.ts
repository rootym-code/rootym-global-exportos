import { z } from "zod";

import {
  FollowUpActionType,
  FollowUpCategory,
  FollowUpPriority,
  FollowUpResult,
  FollowUpStatus,
} from "@/lib/generated/prisma";

/* ============================================================
   CREATE FOLLOW-UP
============================================================ */

export const createFollowUpSchema = z.object({
  inquiryId: z.string().cuid(),

  title: z.string().trim().min(2).max(200),

  description: z.string().trim().optional(),

  actionType: z.nativeEnum(FollowUpActionType),

  category: z.nativeEnum(FollowUpCategory),

  priority: z.nativeEnum(FollowUpPriority).optional(),

  assignedToId: z.string().cuid().optional(),

  scheduledAt: z.coerce.date(),

  dueAt: z.coerce.date().optional(),

  estimatedMinutes: z.number().int().positive().optional(),

  notes: z.string().trim().optional(),
});

/* ============================================================
   UPDATE FOLLOW-UP
============================================================ */

export const updateFollowUpSchema = z.object({
  title: z.string().trim().min(2).max(200).optional(),

  description: z.string().trim().optional(),

  actionType: z.nativeEnum(FollowUpActionType).optional(),

  category: z.nativeEnum(FollowUpCategory).optional(),

  priority: z.nativeEnum(FollowUpPriority).optional(),

  status: z.nativeEnum(FollowUpStatus).optional(),

  scheduledAt: z.coerce.date().optional(),

  dueAt: z.coerce.date().optional(),

  estimatedMinutes: z.number().int().positive().optional(),

  actualMinutes: z.number().int().positive().optional(),

  notes: z.string().trim().optional(),
});

/* ============================================================
   ASSIGN FOLLOW-UP
============================================================ */

export const assignFollowUpSchema = z.object({
  assignedToId: z.string().cuid(),
});

/* ============================================================
   COMPLETE FOLLOW-UP
============================================================ */

export const completeFollowUpSchema = z.object({
  result: z.nativeEnum(FollowUpResult),

  notes: z.string().trim().optional(),

  actualMinutes: z.number().int().positive().optional(),
});

/* ============================================================
   RESCHEDULE FOLLOW-UP
============================================================ */

export const rescheduleFollowUpSchema = z.object({
  scheduledAt: z.coerce.date(),

  dueAt: z.coerce.date().optional(),

  notes: z.string().trim().optional(),
});

/* ============================================================
   SNOOZE FOLLOW-UP
============================================================ */

export const snoozeFollowUpSchema = z.object({
  scheduledAt: z.coerce.date(),

  reason: z.string().trim().optional(),
});

/* ============================================================
   EXPORT TYPES
============================================================ */

export type CreateFollowUpInput =
  z.infer<typeof createFollowUpSchema>;

export type UpdateFollowUpInput =
  z.infer<typeof updateFollowUpSchema>;

export type AssignFollowUpInput =
  z.infer<typeof assignFollowUpSchema>;

export type CompleteFollowUpInput =
  z.infer<typeof completeFollowUpSchema>;

export type RescheduleFollowUpInput =
  z.infer<typeof rescheduleFollowUpSchema>;

export type SnoozeFollowUpInput =
  z.infer<typeof snoozeFollowUpSchema>;