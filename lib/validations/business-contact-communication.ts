/**
 * ============================================================
 * ROOTYM Business Contact & Communication Validation
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates tenant business contact, communication,
 *          social media and online presence configuration.
 * ============================================================
 */

import { z } from "zod";

const optionalEmail = (label: string) =>
  z
    .string()
    .trim()
    .email(`Enter a valid ${label}`)
    .max(254, `${label} must not exceed 254 characters`)
    .optional()
    .or(z.literal(""));

const optionalUrl = (label: string) =>
  z
    .string()
    .trim()
    .url(`Enter a valid ${label} URL`)
    .max(500, `${label} URL must not exceed 500 characters`)
    .optional()
    .or(z.literal(""));

const optionalPhone = (label: string) =>
  z
    .string()
    .trim()
    .max(30, `${label} must not exceed 30 characters`)
    .optional()
    .or(z.literal(""));

export const businessContactCommunicationSchema = z.object({
  // Business Email
  primaryEmail: optionalEmail("primary business email"),
  alternateEmail1: optionalEmail("alternate email"),
  alternateEmail2: optionalEmail("alternate email"),
  salesEmail: optionalEmail("sales email"),
  infoEmail: optionalEmail("information email"),

  // Business Phone
  primaryPhone: optionalPhone("primary phone number"),
  alternatePhone: optionalPhone("alternate phone number"),
  whatsapp: optionalPhone("WhatsApp number"),

  // Social & Online Business Presence
  linkedinUrl: optionalUrl("LinkedIn"),
  facebookUrl: optionalUrl("Facebook"),
  instagramUrl: optionalUrl("Instagram"),
  youtubeUrl: optionalUrl("YouTube"),
  googleBusinessUrl: optionalUrl("Google Business Profile"),
  xTwitterUrl: optionalUrl("X / Twitter"),
  pinterestUrl: optionalUrl("Pinterest"),
  otherSocialUrls: z
    .string()
    .trim()
    .max(
      3000,
      "Other social/profile URLs must not exceed 3000 characters"
    )
    .optional()
    .or(z.literal("")),
});

export type BusinessContactCommunicationInput = z.infer<
  typeof businessContactCommunicationSchema
>;