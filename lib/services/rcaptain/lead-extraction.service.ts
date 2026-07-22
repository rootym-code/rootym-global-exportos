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
 *
 * Responsibilities:
 * • Detect buyer requirement
 * • Extract buyer/company/contact details
 * • Capture WhatsApp/contact number
 * • Prepare structured inquiry data
 * • No database persistence
 *
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

  whatsappNumber?: string;

  country?: string;

  product?: string;

  quantity?: string;

  message?: string;

}




export class LeadExtractionService {


  extractLead(
    messages: AIMessage[]
  ): ExtractedLead {


    /**
     * USER messages only
     *
     * Prevent R-CAPTAIN questions
     * from entering extraction.
     */

    const userMessages =
      messages.filter(
        message =>
          message.role === "user"
      );


    const fullConversation =
      userMessages
        .map(
          message =>
            message.content
        )
        .join("\n");


    const latestUserMessage =
      userMessages.length > 0
        ? userMessages[
            userMessages.length - 1
          ].content.trim()
        : "";


    const normalizedConversation =
      fullConversation.toLowerCase();



    const lead: ExtractedLead = {

      hasRequirement: false,

    };




    /**
     * Product Detection
     */

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




    /**
     * Quantity Detection
     */

    const quantityMatch =
      fullConversation.match(
        /(\d+)\s*(kg|kgs|ton|tons|mt|metric ton)/i
      );


    if (quantityMatch) {

      lead.quantity =
        quantityMatch[0];

    }




    /**
     * Country Detection
     */

    const countries = [

      "uae",
      "dubai",
      "united arab emirates",

      "usa",
      "united states",

      "uk",
      "united kingdom",

      "sri lanka",
      "srilanka",
      "sri lnak",

      "malaysia",
      "singapore",

      "saudi arabia",
      "qatar",
      "oman",

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





    /**
     * Email Detection
     */

    const emailMatch =
      latestUserMessage.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/
      );


    if (emailMatch) {

      lead.email =
        emailMatch[0];

    }





    /**
     * WhatsApp Number Detection
     *
     * Captures international
     * and local mobile numbers.
     *
     * Example:
     * +94 77 1234567
     * +91 9876543210
     * 9876543210
     */

    const whatsappMatch =
      latestUserMessage.match(
        /(\+?\d[\d\s\-]{8,14}\d)/
      );



    if (whatsappMatch) {

      const number =
        whatsappMatch[1]
          .trim();


      lead.whatsappNumber =
        number;


      /**
       * Backward compatibility
       * Existing inquiry table
       * uses phone field.
       */

      lead.phone =
        number;

    }





    /**
     * Company Detection
     */

    const companyPatterns = [

      /(.+\s+pvt\.?\s*ltd\.?)/i,

      /(.+\s+private\s+limited)/i,

      /(.+\s+llc)/i,

      /(.+\s+ltd\.?)/i,

      /(.+\s+trading)/i,

      /(.+\s+foods?)/i,

      /(.+\s+enterprises?)/i,

      /(.+\s+impex)/i,

      /(.+\s+exports?)/i,

      /(.+\s+imports?)/i,

    ];



    for (
      const pattern of companyPatterns
    ) {

      const match =
        latestUserMessage.match(
          pattern
        );


      if (match) {

        lead.companyName =
          match[1]
            .trim();

        break;

      }

    }




    /**
     * Explicit company phrases
     */

    if (!lead.companyName) {

      const explicitCompany =
        latestUserMessage.match(
          /(?:my company name is|company name is|company is)\s+(.+)/i
        );


      if (explicitCompany) {

        lead.companyName =
          explicitCompany[1]
            .trim();

      }

    }




    /**
     * Contact Person Detection
     */

    const contactMatch =
      latestUserMessage.match(
        /(?:my name is|contact person is|contact name is)\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})/i
      );


    if (contactMatch) {

      lead.contactPerson =
        contactMatch[1]
          .trim();

    }




    /**
     * Simple name fallback
     */

    if (
      !lead.contactPerson &&
      /^[A-Za-z]+(?:\s+[A-Za-z]+){1,2}$/.test(
        latestUserMessage
      )
    ) {

      lead.contactPerson =
        latestUserMessage;

    }





    /**
     * Requirement readiness
     */

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