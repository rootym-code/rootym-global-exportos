/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Lead Conversion
 *
 * Module          : Conversation State Service
 *
 * Description
 * ------------------------------------------------------------
 * Maintains buyer information collected during R-CAPTAIN chat.
 *
 * Responsibilities:
 * • Merge extracted lead information
 * • Preserve conversation lead state
 * • Prepare inquiry payload
 *
 * ============================================================
 */


export interface ConversationLeadState {

    companyName?: string;
  
    contactPerson?: string;
  
    email?: string;
  
    phone?: string;
  
    country?: string;
  
    product?: string;
  
    quantity?: string;
  
    unit?: string;
  
    message?: string;
  
  }
  
  
  
  export class ConversationStateService {
  
  
    mergeState(
      current: ConversationLeadState,
      update: ConversationLeadState
    ): ConversationLeadState {
  
  
      return {
  
        companyName:
          update.companyName ??
          current.companyName,
  
  
        contactPerson:
          update.contactPerson ??
          current.contactPerson,
  
  
        email:
          update.email ??
          current.email,
  
  
        phone:
          update.phone ??
          current.phone,
  
  
        country:
          update.country ??
          current.country,
  
  
        product:
          update.product ??
          current.product,
  
  
        quantity:
          update.quantity ??
          current.quantity,
  
  
        unit:
          update.unit ??
          current.unit,
  
  
        message:
          update.message ??
          current.message,
  
      };
  
    }
  
  
  
    isReadyForInquiry(
      state: ConversationLeadState
    ): boolean {
  
  
      return Boolean(
  
        state.companyName &&
        state.contactPerson &&
        state.email &&
        state.country &&
        state.product &&
        state.quantity
  
      );
  
    }
  
  
  
    buildInquiryPayload(
      state: ConversationLeadState
    ) {
  
  
      return {
  
        companyName:
          state.companyName ?? "",
  
  
        contactPerson:
          state.contactPerson ?? "",
  
  
        email:
          state.email ?? "",
  
  
        phone:
          state.phone ?? null,
  
  
        country:
          state.country ?? "",
  
  
        product:
          state.product ?? "",
  
  
        quantity:
          state.quantity ?? "",
  
  
        unit:
          state.unit ?? "",
  
  
        message:
          state.message ??
          "Generated from R-CAPTAIN AI assistant.",
  
  
        source:
          "R-CAPTAIN",
  
      };
  
    }
  
  
  }