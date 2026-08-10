/*
============================================================
Module      : CMS
Feature     : Page Editor
File        : components/admin/cms/pages/types.ts
Purpose     : Shared Page Editor Types
Sprint      : Sprint 12.2
============================================================
*/

import { CmsPageStatus } from "@/lib/generated/prisma";

/* ============================================================
Core Types
============================================================ */

export type PageEditorMode = "create" | "edit";

/* ============================================================
Page Templates
============================================================ */

export type PageTemplate =
  | "STANDARD"
  | "COUNTRY_LANDING";

  export type PageLayout =
  | "WEBSITE"
  | "STANDALONE";

/* ============================================================
Landing Page Section Types
============================================================ */

export type LandingPageSectionType =
  | "hero"
  | "valueProposition"
  | "product"
  | "applications"
  | "whyRootym"
  | "buyerFocus"
  | "packaging"
  | "exportDocuments"
  | "cta"
  | "faq";

/* ============================================================
Landing Page Sections
============================================================ */

export interface HeroSection {
  type: "hero";
  heading: string;
  subheading: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface ValuePropositionSection {
  type: "valueProposition";
  heading: string;
  description: string;
  points: string[];
}

export interface ProductSection {
  type: "product";
  heading: string;
  description: string;
  productName: string;
  origin: string;
  form: string;
  packaging: string;
  moq: string;
  applications: string[];
}

export interface ApplicationsSection {
  type: "applications";
  heading: string;
  description: string;
  items: {
    title: string;
    description: string;
  }[];
}

export interface WhyRootymSection {
  type: "whyRootym";
  heading: string;
  points: {
    title: string;
    description: string;
  }[];
}

export interface BuyerFocusSection {
  type: "buyerFocus";
  heading: string;
  description: string;
  buyerTypes: string[];
}

export interface PackagingSection {
  type: "packaging";
  heading: string;
  description: string;
  options: string[];
}

export interface ExportDocumentsSection {
  type: "exportDocuments";
  heading: string;
  description: string;
  documents: string[];
}

export interface CtaSection {
  type: "cta";
  heading: string;
  description: string;
  primaryCtaText: string;
  secondaryCtaText: string;
}

export interface FaqSection {
  type: "faq";
  heading: string;
  items: {
    question: string;
    answer: string;
  }[];
}

/* ============================================================
Landing Page Section Union
============================================================ */

export type LandingPageSection =
  | HeroSection
  | ValuePropositionSection
  | ProductSection
  | ApplicationsSection
  | WhyRootymSection
  | BuyerFocusSection
  | PackagingSection
  | ExportDocumentsSection
  | CtaSection
  | FaqSection;

/* ============================================================
Structured Landing Page Content
============================================================ */

export interface CmsLandingPageContent {
  version: 1;
  template: PageTemplate;
  sections: LandingPageSection[];
}

/* ============================================================
Translation
============================================================ */

export interface PageTranslationForm {
  languageId: string;

  title: string;

  slug: string;

  excerpt: string;

  content: string;

  metaTitle: string;

  metaDescription: string;

  metaKeywords: string;

  isPublished: boolean;
}

/* ============================================================
General
============================================================ */

export interface PageGeneralForm {
  internalTitle: string;

  defaultSlug: string;

  status: CmsPageStatus;

  template: PageTemplate;

  layout: PageLayout;

  isHomePage: boolean;

  showInMenu: boolean;

  canonicalUrl: string;
}

/* ============================================================
Complete Editor Form
============================================================ */

export interface PageEditorForm {
  general: PageGeneralForm;

  translation: PageTranslationForm;
}

/* ============================================================
Component Props
============================================================ */

export interface PageEditorProps {
  mode: PageEditorMode;

  pageId?: string;
}

/* ============================================================
API Payloads
============================================================ */

export interface CreatePagePayload {
  title: string;

  slug: string;

  status: CmsPageStatus;

  isHomePage: boolean;

  showInMenu: boolean;

  canonicalUrl: string;

  metaTitle: string;

  metaDescription: string;

  metaKeywords: string;

  translations: PageTranslationForm[];
}

export interface UpdatePagePayload
  extends Partial<CreatePagePayload> {
  id: string;
}

/* ============================================================
Default Form Values
============================================================ */

export const DEFAULT_PAGE_FORM: PageEditorForm = {
  general: {
    internalTitle: "",
  
    defaultSlug: "",
  
    status: "DRAFT",
  
    template: "STANDARD",
  
    layout: "WEBSITE",
  
    isHomePage: false,
  
    showInMenu: true,
  
    canonicalUrl: "",
  },
  
  translation: {
    languageId: "",

    title: "",

    slug: "",

    excerpt: "",

    content: "",

    metaTitle: "",

    metaDescription: "",

    metaKeywords: "",

    isPublished: false,
  },
};