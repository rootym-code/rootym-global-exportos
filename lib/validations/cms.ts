import { z } from "zod";

/* ============================================================
   COMMON
============================================================ */

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/* ============================================================
   LANGUAGE
============================================================ */

export const createLanguageSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2)
    .max(10)
    .transform((v) => v.toLowerCase()),

  name: z.string().trim().min(2).max(100),

  nativeName: z.string().trim().max(100).optional(),

  isDefault: z.boolean().optional(),

  isActive: z.boolean().optional(),

  sortOrder: z.number().int().min(0).optional(),
});

export const updateLanguageSchema = createLanguageSchema.partial();

/* ============================================================
   CMS PAGE
============================================================ */

const cmsPageEditorTranslationSchema = z.object({
  languageId: z.string().cuid().optional(),

  title: z.string().trim().min(2).max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(slugRegex, "Invalid slug format")
    .transform((v) => v.toLowerCase()),

  excerpt: z.string().trim().max(500).optional(),

  content: z.string().optional(),

  metaTitle: z.string().trim().max(255).optional(),

  metaDescription: z.string().trim().max(500).optional(),

  metaKeywords: z.string().trim().max(500).optional(),

  isPublished: z.boolean().optional(),
});

export const createCmsPageSchema = z.object({
  title: z.string().trim().min(2).max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(slugRegex, "Invalid slug format")
    .transform((v) => v.toLowerCase()),

    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),

    template: z
      .enum(["STANDARD", "COUNTRY_LANDING"])
      .optional(),
  
    isHomePage: z.boolean().optional(),

  showInMenu: z.boolean().optional(),

  metaTitle: z.string().trim().max(255).optional(),

  metaDescription: z.string().trim().max(500).optional(),

  metaKeywords: z.string().trim().max(500).optional(),

  canonicalUrl: z.string().url().optional(),

  publishedAt: z.coerce.date().optional(),

  translation: cmsPageEditorTranslationSchema.optional(),
});

export const updateCmsPageSchema =
  createCmsPageSchema.partial();

/* ============================================================
   CMS PAGE TRANSLATION
============================================================ */

export const createCmsPageTranslationSchema = z.object({
  pageId: z.string().cuid(),

  languageId: z.string().cuid(),

  title: z.string().trim().min(2).max(200),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(slugRegex, "Invalid slug format")
    .transform((v) => v.toLowerCase()),

  excerpt: z.string().trim().max(500).optional(),

  content: z.string().optional(),

  metaTitle: z.string().trim().max(255).optional(),

  metaDescription: z.string().trim().max(500).optional(),

  metaKeywords: z.string().trim().max(500).optional(),

  isPublished: z.boolean().optional(),
});

export const updateCmsPageTranslationSchema =
  createCmsPageTranslationSchema.partial();

/* ============================================================
   MEDIA
============================================================ */

export const createMediaSchema = z.object({
  fileName: z.string().trim().min(1),

  storedFileName: z.string().trim().min(1),

  fileUrl: z.string().trim().min(1),

  storageProvider: z.string().trim().optional(),

  mimeType: z.string().trim().optional(),

  mediaType: z.enum([
    "IMAGE",
    "VIDEO",
    "DOCUMENT",
    "AUDIO",
    "OTHER",
  ]),

  fileSize: z.number().int().nonnegative().optional(),

  width: z.number().int().positive().optional(),

  height: z.number().int().positive().optional(),

  altText: z.string().trim().max(255).optional(),

  title: z.string().trim().max(255).optional(),

  description: z.string().optional(),

  folder: z.string().trim().max(100).optional(),
});

export const updateMediaSchema = createMediaSchema.partial();

/* ============================================================
   MENU
============================================================ */

export const createMenuSchema = z.object({
  name: z.string().trim().min(2).max(100),

  code: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .transform((v) => v.toUpperCase()),

  description: z.string().optional(),

  isActive: z.boolean().optional(),
});

export const updateMenuSchema = createMenuSchema.partial();

/* ============================================================
   MENU ITEM
============================================================ */

export const createMenuItemSchema = z.object({
  menuId: z.string().cuid(),

  parentId: z.string().cuid().optional(),

  pageId: z.string().cuid().optional(),

  label: z.string().trim().min(1).max(100),

  url: z.string().trim().min(1).max(500),

  sortOrder: z.number().int().min(0).optional(),

  openInNewTab: z.boolean().optional(),

  isVisible: z.boolean().optional(),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

/* ============================================================
   SITE SETTINGS
============================================================ */

export const createSiteSettingSchema = z.object({
  key: z.string().trim().min(2).max(100),

  value: z.string().optional(),

  category: z.string().trim().max(100).optional(),

  description: z.string().optional(),

  valueType: z.enum([
    "text",
    "number",
    "boolean",
    "json",
  ]),
  isPublic: z.boolean().optional(),
});

export const updateSiteSettingSchema =
  createSiteSettingSchema.partial();

/* ============================================================
   REDIRECT
============================================================ */

export const createRedirectSchema = z.object({
  fromPath: z.string().trim().min(1),

  toPath: z.string().trim().min(1),

  redirectType: z.enum([
    "PERMANENT",
    "TEMPORARY",
  ]),

  isActive: z.boolean().optional(),

  notes: z.string().optional(),
});

export const updateRedirectSchema =
  createRedirectSchema.partial();

/* ============================================================
   EXPORT TYPES
============================================================ */

export type CreateLanguageInput =
  z.infer<typeof createLanguageSchema>;

export type UpdateLanguageInput =
  z.infer<typeof updateLanguageSchema>;

export type CreateCmsPageInput =
  z.infer<typeof createCmsPageSchema>;

export type UpdateCmsPageInput =
  z.infer<typeof updateCmsPageSchema>;

export type CreateCmsPageTranslationInput =
  z.infer<typeof createCmsPageTranslationSchema>;

export type UpdateCmsPageTranslationInput =
  z.infer<typeof updateCmsPageTranslationSchema>;

export type CreateMediaInput =
  z.infer<typeof createMediaSchema>;

export type UpdateMediaInput =
  z.infer<typeof updateMediaSchema>;

export type CreateMenuInput =
  z.infer<typeof createMenuSchema>;

export type UpdateMenuInput =
  z.infer<typeof updateMenuSchema>;

export type CreateMenuItemInput =
  z.infer<typeof createMenuItemSchema>;

export type UpdateMenuItemInput =
  z.infer<typeof updateMenuItemSchema>;

export type CreateSiteSettingInput =
  z.infer<typeof createSiteSettingSchema>;

export type UpdateSiteSettingInput =
  z.infer<typeof updateSiteSettingSchema>;

export type CreateRedirectInput =
  z.infer<typeof createRedirectSchema>;

export type UpdateRedirectInput =
  z.infer<typeof updateRedirectSchema>;