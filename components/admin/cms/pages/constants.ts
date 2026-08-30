/* ============================================================
   ROOTYM Global Export Platform
   ============================================================
   Module      : CMS
   Feature     : Page Editor
   File        : components/admin/cms/pages/constants.ts
   Purpose     : Shared constants for Page Editor
   Sprint      : Sprint 12.2
============================================================ */

import { CmsPageStatus } from "@/lib/generated/prisma";

/* ============================================================
   Languages
============================================================ */

export const DEFAULT_LANGUAGE = "en";

/* ============================================================
   Status
============================================================ */

export const PAGE_STATUS_OPTIONS = [
  {
    label: "Draft",
    value: CmsPageStatus.DRAFT,
  },
  {
    label: "Published",
    value: CmsPageStatus.PUBLISHED,
  },
  {
    label: "Archived",
    value: CmsPageStatus.ARCHIVED,
  },
] as const;

/* ============================================================
   Limits
============================================================ */

export const PAGE_LIMITS = {
  TITLE: 120,
  SLUG: 200,
  EXCERPT: 300,
  META_TITLE: 60,
  META_DESCRIPTION: 160,
  META_KEYWORDS: 255,
} as const;

/* ============================================================
   Defaults
============================================================ */

export const DEFAULT_PAGE_SETTINGS = {
  showInMenu: true,
  isHomePage: false,
  status: CmsPageStatus.DRAFT,
} as const;

/* ============================================================
   Placeholders
============================================================ */

export const PAGE_PLACEHOLDERS = {
  INTERNAL_TITLE: "About Us",

  PUBLIC_TITLE: "About ROOTYM",

  SLUG: "about-rootym",

  EXCERPT:
    "Short summary displayed in listings and search results.",

  CONTENT:
    "Write your page content here...",

  META_TITLE:
    "SEO title",

  META_DESCRIPTION:
    "SEO description",

  META_KEYWORDS:
    "keyword1, keyword2, keyword3",

  CANONICAL_URL:
  "https://export.rootym.com/about",
} as const;

/* ============================================================
   Editor
============================================================ */

export const AUTOSAVE_DELAY = 2000;