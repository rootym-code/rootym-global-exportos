/* ============================================================
   ROOTYM Global Export Platform
   ============================================================
   Module      : CMS
   Feature     : Page Editor
   File        : components/admin/cms/pages/types.ts
   Purpose     : Shared Page Editor Types
   Sprint      : Sprint 12.2
============================================================ */

import { CmsPageStatus } from "@/lib/generated/prisma";

/* ============================================================
   Core Types
============================================================ */

export type PageEditorMode = "create" | "edit";

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