import buyerContextBuilder from "./BuyerContextBuilder";

import buyerSignalExtractor from "./BuyerSignalExtractor";

import buyerReasoningEngine from "./BuyerReasoningEngine";

import buyerRecommendationEngine from "./BuyerRecommendationEngine";

import type {
  BuyerIntelligenceResult,
} from "./types";



export class BuyerIntelligenceEngine {


  async analyze(
    inquiryId: string,
  ): Promise<BuyerIntelligenceResult> {


    const context =
      await buyerContextBuilder.build({
        inquiryId,
      });



    const observations =
      buyerSignalExtractor.extract(
        context,
      );



    const reasoning =
      buyerReasoningEngine.analyze(
        context,
        observations,
      );



    const recommendation =
      buyerRecommendationEngine.generate(
        reasoning,
      );



    return {

      context,

      observations,

      reasoning,

      recommendation,

      generatedAt:
        new Date(),

    };

  }

}



const buyerIntelligenceEngine =
  new BuyerIntelligenceEngine();


export default buyerIntelligenceEngine;