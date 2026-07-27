/**
 * ============================================================
 * R-CAPTAIN Intelligence Engine
 * Shared Contracts
 * ============================================================
 */

/* ============================================================
   Follow-up Intelligence
============================================================ */

export interface FollowUpIntelligence {
   overdue: number;
   dueToday: number;
   upcoming: number;
   completedToday: number;
   urgent: number;
   assignedToMe: number;
 
   recommendations: Recommendation[];
 }
  
  /* ============================================================
     Quote Intelligence
  ============================================================ */
  
  export interface QuoteIntelligence {
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    expired: number;
    expiringSoon: number;
    totalValue: number;
  }
  
  /* ============================================================
     Buyer Intelligence
  ============================================================ */
  
  export interface BuyerIntelligence {
    totalBuyers: number;
    activeBuyers: number;
    hotBuyers: number;
    warmBuyers: number;
    coldBuyers: number;
    atRiskBuyers: number;
  }
  
  /* ============================================================
     Pipeline Intelligence
  ============================================================ */
  
  export interface PipelineIntelligence {
    totalPipelineValue: number;
    negotiationValue: number;
    quotationValue: number;
    confirmedValue: number;
    expectedRevenue: number;
    winRate: number;
  }
  
  /* ============================================================
     Forecast Intelligence
  ============================================================ */
  
  export interface ForecastIntelligence {
    expectedOrders: number;
    expectedRevenue: number;
    conversionRate: number;
  }
  
  /* ============================================================
     AI Recommendation
  ============================================================ */
  
  export interface Recommendation {
    priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    title: string;
    description: string;
    action: string;
  }
  
  /* ============================================================
     Dashboard Intelligence
  ============================================================ */
  
  export interface DashboardIntelligence {
    followUp: FollowUpIntelligence;
    quote: QuoteIntelligence;
    buyer: BuyerIntelligence;
    pipeline: PipelineIntelligence;
    forecast: ForecastIntelligence;
    recommendations: Recommendation[];
  }