/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/TimelineService.ts
 *
 * Inquiry Timeline Event Generator
 * ============================================================
 */

import type { InquiryPriority, LeadTemperature } from "./rules";

export type TimelineEventType =
  | "INQUIRY_CREATED"
  | "BUYER_SCORED"
  | "PRIORITY_ASSIGNED"
  | "LEAD_TEMPERATURE_ASSIGNED"
  | "DUPLICATE_CHECK_COMPLETED"
  | "RECOMMENDATION_GENERATED";

export interface TimelineEvent {
  type: TimelineEventType;
  title: string;
  description: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface TimelineInput {
  buyerScore: number;
  priority: InquiryPriority;
  leadTemperature: LeadTemperature;
  duplicateScore: number;
  recommendation: string;
}

export class TimelineService {
  createTimeline(
    input: TimelineInput,
  ): TimelineEvent[] {
    const timestamp = new Date();

    return [
      {
        type: "INQUIRY_CREATED",
        title: "Inquiry Received",
        description:
          "A new export inquiry has been received.",
        createdAt: timestamp,
      },

      {
        type: "BUYER_SCORED",
        title: "Buyer Score Calculated",
        description: `Buyer Score: ${input.buyerScore}`,
        metadata: {
          buyerScore: input.buyerScore,
        },
        createdAt: timestamp,
      },

      {
        type: "PRIORITY_ASSIGNED",
        title: "Priority Assigned",
        description: `Priority set to ${input.priority}`,
        metadata: {
          priority: input.priority,
        },
        createdAt: timestamp,
      },

      {
        type: "LEAD_TEMPERATURE_ASSIGNED",
        title: "Lead Temperature Assigned",
        description: `Lead marked as ${input.leadTemperature}`,
        metadata: {
          leadTemperature: input.leadTemperature,
        },
        createdAt: timestamp,
      },

      {
        type: "DUPLICATE_CHECK_COMPLETED",
        title: "Duplicate Check Completed",
        description:
          input.duplicateScore > 0
            ? `Duplicate similarity score: ${input.duplicateScore}%`
            : "No similar inquiry found.",
        metadata: {
          duplicateScore: input.duplicateScore,
        },
        createdAt: timestamp,
      },

      {
        type: "RECOMMENDATION_GENERATED",
        title: "Recommendation Generated",
        description: input.recommendation,
        metadata: {
          recommendation: input.recommendation,
        },
        createdAt: timestamp,
      },
    ];
  }
}

export const timelineService = new TimelineService();

export default timelineService;