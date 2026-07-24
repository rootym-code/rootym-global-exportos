import {
    FollowUpActionType,
    FollowUpPriority,
    FollowUpStatus,
  } from "@/lib/generated/prisma";
  
  export const FOLLOWUP_STATUS_ICONS: Record<
    FollowUpStatus,
    string
  > = {
    PENDING: "Clock3",
    COMPLETED: "CheckCircle2",
    MISSED: "AlertTriangle",
    CANCELLED: "XCircle",
  };
  
  export const FOLLOWUP_PRIORITY_ICONS: Record<
    FollowUpPriority,
    string
  > = {
    LOW: "ChevronDown",
    MEDIUM: "Minus",
    HIGH: "ChevronUp",
    URGENT: "Flame",
  };
  
  export const FOLLOWUP_ACTION_ICONS: Record<
    FollowUpActionType,
    string
  > = {
    CALL: "Phone",
    WHATSAPP: "MessageCircle",
    EMAIL: "Mail",
    QUOTATION: "FileText",
    MEETING: "Users",
    SAMPLE: "Package",
    PAYMENT: "CreditCard",
    DOCUMENTATION: "FolderOpen",
    SHIPMENT: "Truck",
    OTHER: "Circle",
  };