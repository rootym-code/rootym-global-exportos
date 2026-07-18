/**
 * ============================================================
 * ROOTYM Brain
 * File: lib/brain/inquiry/LeadTemperature.ts
 *
 * Determines Lead Temperature from Buyer Score
 * ============================================================
 */

import {
    LEAD_TEMPERATURE_RULES,
    type LeadTemperature,
  } from "./rules";
  
  export interface LeadTemperatureResult {
    score: number;
    temperature: LeadTemperature;
  }
  
  export class LeadTemperatureEngine {
    calculate(score: number): LeadTemperatureResult {
      const normalizedScore = Math.max(
        0,
        Math.min(100, score),
      );
  
      const temperature =
        LEAD_TEMPERATURE_RULES.find(
          (rule) => normalizedScore >= rule.minScore,
        )?.value ?? "NEW";
  
      return {
        score: normalizedScore,
        temperature,
      };
    }
  }
  
  export const leadTemperatureEngine =
    new LeadTemperatureEngine();
  
  export default leadTemperatureEngine;