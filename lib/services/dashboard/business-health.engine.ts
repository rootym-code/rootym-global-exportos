/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Business Health Engine
 * Description     : Calculates overall business health based
 *                   on dashboard KPIs.
 * ============================================================
 */

export interface BusinessHealthInput {
    productivityScore: number;
    pendingAttention: number;
    readyToClose: number;
    goingCold: number;
    confirmedDeals: number;
  }
  
  export type BusinessHealthStatus =
    | "EXCELLENT"
    | "GOOD"
    | "FAIR"
    | "CRITICAL";
  
  export interface BusinessHealthAnalysis {
    score: number;
    status: BusinessHealthStatus;
    color: "emerald" | "blue" | "amber" | "red";
    explanation: string[];
  }
  
  function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
  
  export function analyzeBusinessHealth(
    input: BusinessHealthInput
  ): BusinessHealthAnalysis {
    let score = input.productivityScore;
  
    // Positive signals
    score += input.readyToClose * 4;
    score += input.confirmedDeals * 3;
  
    // Negative signals
    score -= input.pendingAttention * 2;
    score -= input.goingCold * 3;
  
    score = clamp(Math.round(score), 0, 100);
  
    let status: BusinessHealthStatus;
    let color: "emerald" | "blue" | "amber" | "red";
  
    if (score >= 90) {
      status = "EXCELLENT";
      color = "emerald";
    } else if (score >= 75) {
      status = "GOOD";
      color = "blue";
    } else if (score >= 50) {
      status = "FAIR";
      color = "amber";
    } else {
      status = "CRITICAL";
      color = "red";
    }
  
    const explanation: string[] = [];
  
    if (input.productivityScore >= 80) {
      explanation.push("Team productivity is above target.");
    } else if (input.productivityScore < 60) {
      explanation.push("Productivity is below the desired level.");
    }
  
    if (input.readyToClose > 0) {
      explanation.push(
        `${input.readyToClose} buyer(s) are ready for closure.`
      );
    }
  
    if (input.pendingAttention > 0) {
      explanation.push(
        `${input.pendingAttention} inquiry(s) require immediate attention.`
      );
    }
  
    if (input.goingCold > 0) {
      explanation.push(
        `${input.goingCold} opportunity(s) are losing momentum.`
      );
    }
  
    if (input.confirmedDeals > 0) {
      explanation.push(
        `${input.confirmedDeals} confirmed deal(s) strengthen business health.`
      );
    }
  
    if (explanation.length === 0) {
      explanation.push("Business indicators are stable.");
    }
  
    return {
      score,
      status,
      color,
      explanation,
    };
  }