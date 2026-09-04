/**
 * ============================================================
 * ROOTYM Team & Access
 * ============================================================
 * Author: Prem Singh
 * Purpose: Defines validation and read types for tenant-scoped
 *          workspace membership and Team & Access information.
 * ============================================================
 */

import { z } from "zod";

export const membershipRoleSchema = z.enum([
  "OWNER",
  "ADMIN",
  "MEMBER",
]);

export const teamAccessMemberSchema = z.object({
  membershipId: z.string(),
  userId: z.string(),

  name: z.string(),
  email: z.string(),
  avatarUrl: z.string().nullable(),

  role: membershipRoleSchema,

  isActive: z.boolean(),

  joinedAt: z.date(),
  updatedAt: z.date(),
});

export const teamAccessResponseSchema = z.object({
  members: z.array(teamAccessMemberSchema),
});

export type MembershipRole = z.infer<
  typeof membershipRoleSchema
>;

export type TeamAccessMember = z.infer<
  typeof teamAccessMemberSchema
>;

export type TeamAccessResponse = z.infer<
  typeof teamAccessResponseSchema
>;