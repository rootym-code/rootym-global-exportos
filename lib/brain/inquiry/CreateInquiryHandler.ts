/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/CreateInquiryHandler.ts
 *
 * Inquiry Intelligence Orchestrator
 * ============================================================
 */

import type { BrainContext } from "../context";
import type { BrainHandler } from "../registry";

import type { InquiryInput } from "@/lib/validations/inquiry";

import buyerScorer from "./BuyerScorer";
import duplicateDetector from "./DuplicateDetector";
import leadTemperatureEngine from "./LeadTemperature";
import priorityEngine from "./PriorityEngine";
import recommendationEngine from "./RecommendationEngine";
import timelineService from "./TimelineService";

import { createInquiry } from "@/lib/services/inquiry.service";
import prisma from "@/lib/prisma";

export type CreateInquiryPayload = InquiryInput;

export interface CreateInquiryResult {
  inquiry: Awaited<ReturnType<typeof createInquiry>>;
  intelligence: {
    buyerScore: number;
    buyerGrade: "A" | "B" | "C" | "D";
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    priorityScore: number;
    leadTemperature: "NEW" | "COLD" | "WARM" | "HOT";
    duplicate: {
      isDuplicate: boolean;
      score: number;
    };
    recommendation: string;
    timeline: ReturnType<typeof timelineService.createTimeline>;
  };
}

export class CreateInquiryHandler
  implements BrainHandler<CreateInquiryPayload, CreateInquiryResult>
{
  readonly action = "CREATE_INQUIRY";

  async execute(
    payload: CreateInquiryPayload,
    context: BrainContext,
  ): Promise<CreateInquiryResult> {
    const candidates = await prisma.inquiry.findMany({
      select: {
        id: true,
        companyName: true,
        contactPerson: true,
        email: true,
        phone: true,
      },
    });

    const duplicate = duplicateDetector.detect({
      companyName: payload.companyName,
      contactPerson: payload.contactPerson,
      email: payload.email,
      phone: payload.phone,
      candidates,
    });

    const buyer = buyerScorer.calculate(payload);

    const priority = priorityEngine.calculate({
      ...payload,
      isRepeatBuyer: duplicate.isDuplicate,
    });

    const lead = leadTemperatureEngine.calculate(
      buyer.buyerScore,
    );

    const recommendation = recommendationEngine.calculate({
      score: buyer.buyerScore,
      priority: priority.priority,
      leadTemperature: lead.temperature,
      isDuplicate: duplicate.isDuplicate,
    });

    const inquiry = await createInquiry(payload, {
      ipAddress: context.request.ip,
      userAgent: context.request.userAgent,
    });

    const timeline = timelineService.createTimeline({
      buyerScore: buyer.buyerScore,
      priority: priority.priority,
      leadTemperature: lead.temperature,
      duplicateScore: duplicate.highestScore,
      recommendation: recommendation.recommendation,
    });

    return {
      inquiry,
      intelligence: {
        buyerScore: buyer.buyerScore,
        buyerGrade: buyer.grade,

        priority: priority.priority,
        priorityScore: priority.totalScore,

        leadTemperature: lead.temperature,

        duplicate: {
          isDuplicate: duplicate.isDuplicate,
          score: duplicate.highestScore,
        },

        recommendation: recommendation.recommendation,

        timeline,
      },
    };
  }
}

export default CreateInquiryHandler;