/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Lead Conversion
 *
 * Module          : Inquiry Creation Service
 *
 * Description
 * ------------------------------------------------------------
 * Creates CRM inquiries from qualified R-CAPTAIN leads.
 *
 * Responsibilities:
 * • Generate inquiry number
 * • Map lead data to Inquiry model
 * • Create Prisma inquiry record
 *
 * ============================================================
 */


import {
    prisma,
  } from "@/lib/prisma";
  
  
  import type {
    ConversationLeadState,
  } from "./conversation-state.service";
  //prem
  
  
  export class InquiryCreationService {
  
  
    /**
     * Generate human readable
     * inquiry number
     */
    private generateInquiryNumber(): string {
  
  
      const timestamp =
        Date.now()
          .toString()
          .slice(-8);
  
  
      return (
        `RC-${timestamp}`
      );
  
    }
  
  
  
    /**
     * Create inquiry
     * from qualified lead
     */
    async createInquiry(
      lead:
        ConversationLeadState
  
    ) {
  
  
      const inquiryNumber =
        this.generateInquiryNumber();
  
  
  
      const inquiry =
        await prisma.inquiry.create(
          {
            data:
              {
  
                inquiryNumber,
  
  
                companyName:
                  lead.companyName ?? "",
  
  
                contactPerson:
                  lead.contactPerson ?? "",
  
  
                email:
                  lead.email ?? "",
  
  
                phone:
                  lead.phone ?? null,
  
  
                country:
                  lead.country ?? "",
  
  
                product:
                  lead.product ?? "",
  
  
                quantity:
                  lead.quantity ?? null,
  
  
                unit:
                  lead.unit ?? null,
  
  
                message:
                  lead.message ??
                  "Generated from R-CAPTAIN AI assistant.",
  
  
                source:
                  "R-CAPTAIN",
  
              },
          }
        );
  
  
      return inquiry;
  
    }
  
  
  }