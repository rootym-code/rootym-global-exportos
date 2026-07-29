/**
 * ============================================================
 * R-CAPTAIN Productivity Engine
 * ============================================================
 *
 * Calculates the AI Productivity Score for today's activity.
 */

import { TodaysMissionData } from "./dashboard.types";

export interface ProductivityAnalysis {
  score: number;
  status: string;
  recommendation: string;
  progress: number;
}

export function analyzeProductivity(
  mission: TodaysMissionData
): ProductivityAnalysis {
  const callScore = calculateMetricScore(mission.calls);
  const whatsappScore = calculateMetricScore(mission.whatsapp);
  const quotationScore = calculateMetricScore(mission.quotations);
  const meetingScore = calculateMetricScore(mission.meetings);

  const score = Math.round(
    (callScore +
      whatsappScore +
      quotationScore +
      meetingScore) / 4
  );

  return {
    score,
    progress: score,
    status: getStatus(score),
    recommendation: getRecommendation(score),
  };
}

function calculateMetricScore(metric: {
  completed: number;
  total: number;
}): number {
  if (metric.total === 0) {
    return 100;
  }

  return Math.round(
    (metric.completed / metric.total) * 100
  );
}

function getStatus(score: number): string {
  if (score >= 90) {
    return "Excellent";
  }

  if (score >= 70) {
    return "On Track";
  }

  if (score >= 50) {
    return "Needs Attention";
  }

  return "Critical";
}

function getRecommendation(score: number): string {
  if (score >= 90) {
    return "Outstanding productivity. Maintain your momentum.";
  }

  if (score >= 70) {
    return "Focus on completing today's remaining activities.";
  }

  if (score >= 50) {
    return "Prioritize pending quotations and buyer follow-ups.";
  }

  return "Immediate action required on high-priority buyers.";
}