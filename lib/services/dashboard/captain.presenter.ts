/**
 * ============================================================
 * R-CAPTAIN Presenter
 * ============================================================
 *
 * Converts CaptainAnalysis into the UI-friendly CaptainData
 * consumed by the Floating Captain component.
 */

import type { CaptainAnalysis } from "./captain.engine";
import type { CaptainData } from "./dashboard.types";

export function buildCaptain(
  analysis: CaptainAnalysis
): CaptainData {
  return {
    status: "READY",

    lastUpdated: new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date()),

    title: analysis.title,

    message: analysis.message,

    recommendation: analysis.recommendation,

    severity: analysis.severity,

    unread: analysis.unread,
  };
}