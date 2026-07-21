/**
 * ============================================================
 * Project         : ROOTYM Global Export Platform
 * Organization    : ROOTYM Agro Harvest Pvt. Ltd.
 *
 * Module          : AI Types
 *
 * Description
 * ------------------------------------------------------------
 * Shared AI request and response contracts.
 *
 * Used by:
 * • R-CAPTAIN
 * • Future ROOTYM AI modules
 * ============================================================
 */

export type AIMessage = {
  role: "user" | "assistant";
  content: string;
};
//Prem
export type RCaptainIntent = {
  intent:
    | "GENERAL_QUERY"
    | "BUYING_REQUEST";

  product?: string;

  quantity?: string;

  country?: string;
};
//prem
export type AIRequest = {
  message: string;
  messages: AIMessage[];
  image?: File | null;
  context?: string;
};

export type AIResponse = {
  reply: string;
};