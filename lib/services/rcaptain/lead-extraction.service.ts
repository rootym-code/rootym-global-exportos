/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Feature         : R-CAPTAIN Lead Extraction Intelligence
 *
 * Module          : LeadExtractionService
 *
 * Description
 * ------------------------------------------------------------
 * Extracts buyer information from R-CAPTAIN conversation.
 * ============================================================
 */

import type {
  AIMessage,
} from "@/lib/ai/types";


export interface ExtractedLead {

  hasRequirement: boolean;

  companyName?: string;

  contactPerson?: string;

  email?: string;

  phone?: string;

  country?: string;

  product?: string;

  quantity?: string;

  message?: string;

}


export class LeadExtractionService {


  extractLead(
    messages: AIMessage[]
  ): ExtractedLead {


    const conversation =
      messages
        .map(
          message =>
            message.content
        )
        .join("\n");


    const normalizedConversation =
      conversation.toLowerCase();


    const lead: ExtractedLead = {
      hasRequirement: false,
    };


    const products = [
      "makhana",
      "fox nuts",
      "rice",
      "basmati",
      "wheat",
      "onion",
      "potato starch",
      "french fries",
    ];


    const matchedProduct =
      products.find(
        product =>
          normalizedConversation.includes(product)
      );


    if (matchedProduct) {
      lead.product =
        matchedProduct;
    }


    const quantityMatch =
      conversation.match(
        /(\d+)\s*(kg|kgs|ton|tons|mt|metric ton)/i
      );


    if (quantityMatch) {
      lead.quantity =
        quantityMatch[0];
    }


    const countries = [
      "uae",
      "dubai",
      "usa",
      "uk",
      "saudi arabia",
      "qatar",
      "oman",
      "singapore",
    ];


    const matchedCountry =
      countries.find(
        country =>
          normalizedConversation.includes(country)
      );


    if (matchedCountry) {
      lead.country =
        matchedCountry;
    }


    const emailMatch =
      conversation.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
      );


    if (emailMatch) {
      lead.email =
        emailMatch[0];
    }


    const phoneMatch =
      conversation.match(
        /\+?\d[\d\s-]{8,}/
      );


    if (phoneMatch) {
      lead.phone =
        phoneMatch[0];
    }


    const companyMatch =
      conversation.match(
        /(?:my company name is|company name is|company is)\s+(.+)/i
      );


    if (companyMatch) {

      lead.companyName =
        companyMatch[1]
          .trim();

    } else {

      const companyKeywords = [
        "trading",
        "llc",
        "limited",
      ];

      if (
        companyKeywords.some(
          word =>
            normalizedConversation.includes(word)
        )
      ) {
        lead.companyName =
          "Detected from conversation";
      }

    }




    const contactMatch =
    conversation.match(
      /(?:my name is|contact person is|contact name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i
    );
  
  
  if (contactMatch) {
  
    lead.contactPerson =
      contactMatch[1]
        .trim();
  
  }




    if (
      lead.product &&
      lead.quantity &&
      lead.country
    ) {

      lead.hasRequirement = true;

    }


    return lead;

  }


}
