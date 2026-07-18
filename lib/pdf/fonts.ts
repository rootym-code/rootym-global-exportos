/**
 * ============================================================
 * ROOTYM PDF Font Manager
 * File: lib/pdf/fonts.ts
 * Sprint 8
 * ============================================================
 *
 * Centralized font loading for the ROOTYM PDF Engine.
 *
 * Current Version:
 *  - Uses Standard PDF Fonts (No external assets required)
 *
 * Future Version:
 *  - Embed Inter
 *  - Embed Roboto
 *  - Embed Noto Sans
 *  - Company branding fonts
 * ============================================================
 */

import {
    PDFDocument,
    PDFFont,
    StandardFonts,
  } from "pdf-lib";
  
  export interface PdfFonts {
    regular: PDFFont;
    bold: PDFFont;
    italic: PDFFont;
    boldItalic: PDFFont;
  
    mono: PDFFont;
  }
  
  export class FontManager {
    private constructor(
      private readonly pdf: PDFDocument,
      private readonly fonts: PdfFonts
    ) {}
  
    /**
     * Loads all fonts required by the PDF engine.
     */
    static async create(
      pdf: PDFDocument
    ): Promise<FontManager> {
      const regular = await pdf.embedFont(
        StandardFonts.Helvetica
      );
  
      const bold = await pdf.embedFont(
        StandardFonts.HelveticaBold
      );
  
      const italic = await pdf.embedFont(
        StandardFonts.HelveticaOblique
      );
  
      const boldItalic = await pdf.embedFont(
        StandardFonts.HelveticaBoldOblique
      );
  
      const mono = await pdf.embedFont(
        StandardFonts.Courier
      );
  
      return new FontManager(pdf, {
        regular,
        bold,
        italic,
        boldItalic,
        mono,
      });
    }
  
    /**
     * Returns all loaded fonts.
     */
    get all(): PdfFonts {
      return this.fonts;
    }
  
    get regular(): PDFFont {
      return this.fonts.regular;
    }
  
    get bold(): PDFFont {
      return this.fonts.bold;
    }
  
    get italic(): PDFFont {
      return this.fonts.italic;
    }
  
    get boldItalic(): PDFFont {
      return this.fonts.boldItalic;
    }
  
    get mono(): PDFFont {
      return this.fonts.mono;
    }
  
    /**
     * Calculates text width.
     */
    textWidth(
      text: string,
      font: PDFFont,
      size: number
    ): number {
      return font.widthOfTextAtSize(text, size);
    }
  
    /**
     * Calculates text height.
     */
    textHeight(
      font: PDFFont,
      size: number
    ): number {
      return font.heightAtSize(size);
    }
  
    /**
     * Estimates wrapped text height.
     */
    estimateParagraphHeight(
      lines: number,
      fontSize: number,
      lineSpacing = 1.25
    ): number {
      return lines * fontSize * lineSpacing;
    }
  
    /**
     * Returns line height.
     */
    lineHeight(
      fontSize: number,
      multiplier = 1.25
    ): number {
      return fontSize * multiplier;
    }
  
    /**
     * Future helper for custom fonts.
     */
    async embedCustomFont(
      _fontBytes: Uint8Array
    ): Promise<never> {
      throw new Error(
        "Custom font embedding is not enabled yet."
      );
    }
  }
  
  /**
   * Default font sizes
   */
  export const PDF_FONT_SIZE = {
    title: 22,
  
    heading: 16,
  
    subHeading: 13,
  
    body: 10,
  
    small: 9,
  
    caption: 8,
  
    footer: 7,
  } as const;
  
  /**
   * Default spacing
   */
  export const PDF_SPACING = {
    xs: 4,
  
    sm: 8,
  
    md: 12,
  
    lg: 20,
  
    xl: 32,
  } as const;
  
  /**
   * Default page margins
   */
  export const PDF_MARGIN = {
    top: 40,
  
    bottom: 40,
  
    left: 40,
  
    right: 40,
  } as const;
  
  /**
   * Frequently used font aliases.
   */
  export const FONT_STYLE = {
    REGULAR: "regular",
  
    BOLD: "bold",
  
    ITALIC: "italic",
  
    BOLD_ITALIC: "boldItalic",
  
    MONO: "mono",
  } as const;