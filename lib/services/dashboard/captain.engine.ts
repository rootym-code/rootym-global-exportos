/**
 * ============================================================
 * R-CAPTAIN Intelligence Engine
 * ============================================================
 *
 * Analyzes the current dashboard state and generates
 * actionable business insights for the Floating Captain.
 */

export interface CaptainAnalysisInput {
    pendingAttention: number;
    negotiations: number;
    productivityScore: number;
  }
  
  export interface CaptainAnalysis {
    title: string;
    message: string;
    recommendation: string;
    severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
    unread: number;
  }
  
  export function analyzeCaptain(
    input: CaptainAnalysisInput
  ): CaptainAnalysis {
    if (input.pendingAttention >= 10) {
      return {
        title: "Immediate Attention Required",
  
        message: `${input.pendingAttention} buyers require your attention.`,
  
        recommendation:
          "Prioritize pending quotations before reaching out to new buyers.",
  
        severity: "CRITICAL",
  
        unread: input.pendingAttention,
      };
    }
  
    if (input.negotiations > 0) {
      return {
        title: "Opportunities Ready",
  
        message: `${input.negotiations} buyers are currently in negotiation.`,
  
        recommendation:
          "Focus on negotiations today to maximize conversion.",
  
        severity: "WARNING",
  
        unread: input.negotiations,
      };
    }
  
    if (input.productivityScore >= 90) {
      return {
        title: "Excellent Progress",
  
        message:
          "Today's productivity is on track for successful execution.",
  
        recommendation:
          "Maintain your momentum and continue engaging priority buyers.",
  
        severity: "SUCCESS",
  
        unread: 0,
      };
    }
  
    return {
      title: "Business Running Normally",
  
      message: "No critical issues detected in today's pipeline.",
  
      recommendation:
        "Continue following your daily mission plan.",
  
      severity: "INFO",
  
      unread: 0,
    };
  }