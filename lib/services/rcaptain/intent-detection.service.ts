/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : R-CAPTAIN Intelligence
 * Component       : Intent Detection Service
 *
 * Description
 * ------------------------------------------------------------
 * Detects buyer intent from R-CAPTAIN conversations.
 *
 * Responsibilities:
 * • Identify buying requests
 * • Extract product
 * • Extract quantity
 * • Extract destination country
 *
 * ============================================================
 */


export type RCaptainIntent = {

    intent:
      | "GENERAL_QUERY"
      | "BUYING_REQUEST";
  
    product?: string;
  
    quantity?: string;
  
    country?: string;
  
  };
  
  
  
  export function detectRCaptainIntent(
    message: string
  ): RCaptainIntent {
  
  
    const text =
    message
      .trim()
      .toLowerCase();
  
  
      const buyingKeywords = [

        "buy",
        "buying",
        "need",
        "require",
        "requirement",
        "looking for",
        "want",
        "purchase",
        "order",
        "quotation",
        "quote",
        "price",
        "tons",
        "ton",
        "kg",
        "metric ton",
        "mt",
      
      ];
  
  
    const isBuyingRequest =
      buyingKeywords.some(
        keyword =>
          text.includes(keyword)
      );
  //debug
      console.log(
        "Intent Text:",
        text
      );
      
      console.log(
        "Buying Match:",
        isBuyingRequest
      );

//
  
    if (!isBuyingRequest) {
  
      return {
  
        intent:
          "GENERAL_QUERY",
  
      };
  
    }
  
  
    return {
  
      intent:
        "BUYING_REQUEST",
  
      product:
        extractProduct(message),
  
      quantity:
        extractQuantity(message),
  
      country:
        extractCountry(message),
  
    };
  
  }
  
  
  
  function extractProduct(
    message: string
  ): string | undefined {
  
  
    const products = [
  
      "makhana",
  
      "fox nuts",
  
      "rice",
  
      "wheat",
  
      "onion",
  
      "potato starch",
  
      "french fries",
  
    ];
  
  
    const found =
      products.find(
        product =>
          message
            .toLowerCase()
            .includes(product)
      );
  
  
    return found;
  
  }
  
  
  
  function extractQuantity(
    message: string
  ): string | undefined {
  
  
    const match =
      message.match(
        /\d+\s?(kg|kgs|ton|tons|mt|metric tons)/i
      );
  
  
    return match
      ? match[0]
      : undefined;
  
  }
  
  
  
  function extractCountry(
    message: string
  ): string | undefined {
  
  
    const countries = [
  
      "uae",
  
      "dubai",
  
      "saudi",
  
      "uk",
  
      "usa",
  
      "singapore",
  
      "sri lanka",
  
    ];
  
  
    const found =
      countries.find(
        country =>
          message
            .toLowerCase()
            .includes(country)
      );
  
  
    return found;
  
  }