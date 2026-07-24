import {
  FollowUpActionType,
  FollowUpCategory,
  FollowUpPriority,
  FollowUpResult,
  FollowUpStatus,
} from "@/lib/generated/prisma";


export const FOLLOWUP_STATUS_LABELS: Record<
  FollowUpStatus,
  string
> = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  RESCHEDULED: "Rescheduled",
  CLOSED: "Closed",
};


export const FOLLOWUP_PRIORITY_LABELS: Record<
  FollowUpPriority,
  string
> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};


export const FOLLOWUP_ACTION_LABELS: Record<
  FollowUpActionType,
  string
> = {
  CALL: "Call",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  QUOTATION: "Quotation",
  MEETING: "Meeting",
  SAMPLE: "Sample",
  PAYMENT: "Payment",
  DOCUMENTATION: "Documentation",
  SHIPMENT: "Shipment",
  OTHER: "Other",
};


export const FOLLOWUP_CATEGORY_LABELS: Record<
  FollowUpCategory,
  string
> = {
  SALES: "Sales",
  NEGOTIATION: "Negotiation",
  PAYMENT: "Payment",
  DOCUMENTATION: "Documentation",
  SHIPMENT: "Shipment",
  GENERAL: "General",
};


export const FOLLOWUP_RESULT_LABELS: Record<
  FollowUpResult,
  string
> = {
  BUYER_RESPONDED: "Buyer Responded",
  NO_RESPONSE: "No Response",
  CALL_BACK_LATER: "Call Back Later",
  QUOTE_SENT: "Quote Sent",
  MEETING_DONE: "Meeting Done",
  WRONG_NUMBER: "Wrong Number",
  DEAL_CLOSED: "Deal Closed",
  NOT_INTERESTED: "Not Interested",
};