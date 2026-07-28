import { FollowUpIntelligence } from "../intelligence/intelligence.types";
import { Prisma } from "@/lib/generated/prisma";

export interface DashboardCounts {
  total: number;
  new: number;
  contacted: number;
  quotationSent: number;
  negotiation: number;
  confirmed: number;
  rejected: number;
}

export interface RecentInquiry {
  id: string;
  inquiryNumber: string;
  companyName: string;
  contactPerson: string;
  country: string;
  product: string;
  status: string;
  priority: string;
  createdAt: Date;
}

export interface MorningBriefData {
  greeting: string;
  pendingAttention: number;
  quotationsExpiring: number;
  opportunityValue: string;
}

/* ============================================================
   Domain Model
============================================================ */

export interface PriorityQueueItem {
  id: string;
  inquiryNumber: string;
  companyName: string;
  country: string;
  product: string;
  status: string;
  priority: string;
  createdAt: Date;

  quotes: {
    currency: string;
    grandTotal: Prisma.Decimal;
    createdAt: Date;
  }[];
}
/* ============================================================
   Presentation Model
============================================================ */

export interface PriorityOpportunity {
  id: string;
  buyer: string;
  country: string;
  product: string;
  stage: string;
  revenue: string;
  action: string;
  reason: string;
  aiScore: number;
  confidence: string;
}

export interface OpportunityRadarData {
  readyToClose: number;
  goingCold: number;
  highestRevenue: string;
}

export interface MissionItem {
  completed: number;
  total: number;
}

export interface TodaysMissionData {
  calls: MissionItem;
  whatsapp: MissionItem;
  quotations: MissionItem;
  meetings: MissionItem;
}

export interface CaptainData {
  status: string;
  lastUpdated: string;
}

export interface DashboardData {
  counts: DashboardCounts;
  followUp: FollowUpIntelligence;
  recentInquiries: RecentInquiry[];
}

export interface RCaptainData {
  morningBrief: MorningBriefData;
  priorityQueue: PriorityOpportunity[];
  opportunityRadar: OpportunityRadarData;
  todaysMission: TodaysMissionData;
  captain: CaptainData;
}

export interface DashboardResponse {
  dashboard: DashboardData;
  rCaptain: RCaptainData;
}