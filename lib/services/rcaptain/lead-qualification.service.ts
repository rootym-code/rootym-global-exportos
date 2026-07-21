/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature ID      : F-013
 * Feature Name    : R-CAPTAIN Lead Qualification
 *
 * Module          : R-CAPTAIN Services
 * Component       : LeadQualificationService
 *
 * Description
 * ------------------------------------------------------------
 * Determines whether R-CAPTAIN has enough buyer information
 * to create an export inquiry.
 *
 * Responsibilities:
 * • Check lead completeness
 * • Identify missing buyer fields
 * • Generate next qualification question
 *
 * ============================================================
 */


import type {
    AIMessage,
  } from "@/lib/ai/types";
  
  
  import type {
    ExtractedLead,
  } from "./lead-extraction.service";
  
  
  
  export interface LeadQualificationResult {
  
  
    readyForInquiry: boolean;
  
  
    missingFields: string[];
  
  
    nextQuestion?: string;
  
  
  }
  
  
  
  export class LeadQualificationService {
  
  
  
    qualify(
      lead: ExtractedLead,
      messages: AIMessage[]
    ): LeadQualificationResult {
  
  
      const missingFields: string[] = [];
  
  
  
      /**
       * Buyer identity checks
       *
       * Required before creating inquiry:
       *
       * Company
       * Contact person
       * Email
       *
       */
  
  
      if (!lead.companyName) {
  
        missingFields.push(
          "companyName"
        );
  
      }
  
  
      if (!lead.contactPerson) {
  
        missingFields.push(
          "contactPerson"
        );
  
      }
  
  
      if (!lead.email) {
  
        missingFields.push(
          "email"
        );
  
      }
  
  
  
      /**
       * Requirement checks
       */
  
  
      if (!lead.country) {
  
        missingFields.push(
          "country"
        );
  
      }
  
  
      if (!lead.product) {
  
        missingFields.push(
          "product"
        );
  
      }
  
  
      if (!lead.quantity) {
  
        missingFields.push(
          "quantity"
        );
  
      }
  
  
  
      const readyForInquiry =
        missingFields.length === 0;
  
  
  
      if (readyForInquiry) {
  
        return {
  
          readyForInquiry: true,
  
          missingFields: [],
  
        };
  
      }
  
  
  
      return {
  
        readyForInquiry: false,
  
        missingFields,
  
        nextQuestion:
          this.buildNextQuestion(
            missingFields
          ),
  
      };
  
  
    }
  
  
  
    private buildNextQuestion(
      missingFields: string[]
    ): string {
  
  
  
      if (
        missingFields.includes(
          "companyName"
        )
      ) {
  
        return (
          "Thank you for your requirement. " +
          "May I know your company name?"
        );
  
      }
  
  
  
      if (
        missingFields.includes(
          "contactPerson"
        )
      ) {
  
        return (
          "May I know the contact person's name?"
        );
  
      }
  
  
  
      if (
        missingFields.includes(
          "email"
        )
      ) {
  
        return (
          "Could you please share your email address " +
          "so our export team can contact you?"
        );
  
      }
  
  
  
      if (
        missingFields.includes(
          "country"
        )
      ) {
  
        return (
          "May I know the destination country " +
          "for this requirement?"
        );
  
      }
  
  
  
      if (
        missingFields.includes(
          "quantity"
        )
      ) {
  
        return (
          "Could you please confirm the required quantity?"
        );
  
      }
  
  
  
      return (
        "Could you please provide more details " +
        "about your requirement?"
      );
  
  
    }
  
  
  }