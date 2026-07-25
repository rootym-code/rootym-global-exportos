import {
  FollowUpActionType,
  FollowUpCategory,
  FollowUpPriority,
  FollowUpResult,
} from "@/lib/generated/prisma";


export interface FollowUpOutcomeRule {
  createNextFollowUp: boolean;

  delayDays?: number;

  nextTitle?: string;

  nextActionType?: FollowUpActionType;

  nextCategory?: FollowUpCategory;

  nextPriority?: FollowUpPriority;

  reason: string;
}


export const FOLLOW_UP_OUTCOME_RULES: Record<
  FollowUpResult,
  FollowUpOutcomeRule
> = {

  BUYER_RESPONDED: {
    createNextFollowUp: true,
    delayDays: 1,

    nextTitle:
      "Continue buyer discussion",

    nextActionType:
      FollowUpActionType.EMAIL,

    nextCategory:
      FollowUpCategory.SALES,

    nextPriority:
      FollowUpPriority.HIGH,

    reason:
      "Buyer responded. Continue sales conversation.",
  },


  NO_RESPONSE: {
    createNextFollowUp: true,

    delayDays: 3,

    nextTitle:
      "Retry buyer contact",

    nextActionType:
      FollowUpActionType.WHATSAPP,

    nextCategory:
      FollowUpCategory.SALES,

    nextPriority:
      FollowUpPriority.MEDIUM,

    reason:
      "Buyer did not respond. Retry communication after waiting period.",
  },


  CALL_BACK_LATER: {
    createNextFollowUp: true,

    delayDays: 2,

    nextTitle:
      "Call buyer back",

    nextActionType:
      FollowUpActionType.CALL,

    nextCategory:
      FollowUpCategory.SALES,

    nextPriority:
      FollowUpPriority.HIGH,

    reason:
      "Buyer requested a later callback.",
  },


  QUOTE_SENT: {
    createNextFollowUp: true,

    delayDays: 5,

    nextTitle:
      "Follow up on quotation",

    nextActionType:
      FollowUpActionType.CALL,

    nextCategory:
      FollowUpCategory.NEGOTIATION,

    nextPriority:
      FollowUpPriority.HIGH,

    reason:
      "Quotation sent. Check buyer feedback and continue negotiation.",
  },


  MEETING_DONE: {
    createNextFollowUp: true,

    delayDays: 2,

    nextTitle:
      "Post meeting follow-up",

    nextActionType:
      FollowUpActionType.EMAIL,

    nextCategory:
      FollowUpCategory.SALES,

    nextPriority:
      FollowUpPriority.MEDIUM,

    reason:
      "Meeting completed. Continue sales process.",
  },


  DEAL_CLOSED: {
    createNextFollowUp: false,

    reason:
      "Deal closed successfully.",
  },


  NOT_INTERESTED: {
    createNextFollowUp: false,

    reason:
      "Buyer is not interested.",
  },


  WRONG_NUMBER: {
    createNextFollowUp: false,

    reason:
      "Invalid buyer contact details.",
  },
};
