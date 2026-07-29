/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Feature         : R-CAPTAIN Business Health Presenter
 * Description     : Converts Business Health analysis into
 *                   UI-ready presentation data.
 * ============================================================
 */

import { BusinessHealthAnalysis } from "./business-health.engine";
import { BusinessHealthData } from "./dashboard.types";

export function buildBusinessHealth(
  analysis: BusinessHealthAnalysis
): BusinessHealthData {
  return {
    score: analysis.score,
    status: analysis.status,
    color: analysis.color,
    explanation: analysis.explanation,
  };
}