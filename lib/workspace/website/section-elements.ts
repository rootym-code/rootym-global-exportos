/**
 * ============================================================
 * ROOTYM Customer Workspace
 * ============================================================
 * Author: Prem Singh
 * Purpose: Defines reusable optional elements that can be attached
 *          to any structured website page section.
 * ============================================================
 */

export type SectionElementType =
  | "image"
  | "youtube"
  | "video"
  | "pdf"
  | "cta";

export type SectionElementPlacement =
  | "before"
  | "after";

type SectionElementBase = {
  id: string;
  type: SectionElementType;
  placement: SectionElementPlacement;
};

export type ImageSectionElement = SectionElementBase & {
  type: "image";
  url: string;
  mediaId?: string;
  altText?: string;
  caption?: string;
};

export type YoutubeSectionElement = SectionElementBase & {
  type: "youtube";
  url: string;
  title?: string;
};

export type VideoSectionElement = SectionElementBase & {
  type: "video";
  url: string;
  mediaId?: string;
  title?: string;
  posterUrl?: string;
};

export type PdfSectionElement = SectionElementBase & {
  type: "pdf";
  url: string;
  mediaId?: string;
  label?: string;
};

export type CtaSectionElement = SectionElementBase & {
  type: "cta";
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type SectionElement =
  | ImageSectionElement
  | YoutubeSectionElement
  | VideoSectionElement
  | PdfSectionElement
  | CtaSectionElement;

export type SectionElementHost = {
  elements?: SectionElement[];
};
