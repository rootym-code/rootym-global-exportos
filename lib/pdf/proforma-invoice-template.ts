/**
 * ============================================================
 * ROOTYM PDF Proforma Invoice Template
 * File: lib/pdf/proforma-invoice-template.ts
 * Sprint 8.1
 *
 * Premium ROOTYM Proforma Invoice PDF template.
 *
 * Uses:
 * - pdf-lib for PDF generation
 * - @resvg/resvg-js for SVG -> PNG logo rendering
 * - Existing ROOTYM PDF assets/theme
 * ============================================================
 */

import fs from "node:fs/promises";
import path from "node:path";

import {
  PDFDocument,
  PDFImage,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
} from "pdf-lib";

import { Resvg } from "@resvg/resvg-js";

import {
  DEFAULT_DELIVERY_TERMS,
  DEFAULT_INCOTERMS,
  DEFAULT_PAYMENT_TERMS,
  PDF_THEME,
  ROOTYM_COMPANY,
} from "./assets";

/* ============================================================
 * DATA TYPES
 * ============================================================
 */

export interface ProformaInvoicePdfItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface ProformaInvoicePdfData {
  piNumber: string;
  issueDate: string;
  paymentDueDate?: string;

  quoteNumber?: string;

  buyerName: string;
  buyerCompany?: string;
  buyerAddress?: string;
  buyerCountry?: string;

  currency: string;

  items: ProformaInvoicePdfItem[];

  subtotal: number;
  discount: number;
  freight: number;
  insurance: number;
  tax: number;
  grandTotal: number;

  notes?: string;
}

/* ============================================================
 * PAGE CONSTANTS
 * ============================================================
 */

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;

const CONTENT_WIDTH =
  PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

const FOOTER_Y = 32;

/* ============================================================
 * COLORS
 * ============================================================
 */

const COLORS = {
  primary: PDF_THEME.primary,
  secondary: PDF_THEME.secondary,
  border: PDF_THEME.border,
  text: PDF_THEME.text,
  muted: PDF_THEME.muted,

  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),

  lightGray: rgb(0.96, 0.97, 0.97),
  mediumGray: rgb(0.88, 0.89, 0.89),
};

/* ============================================================
 * HELPERS
 * ============================================================
 */

function formatMoney(
  value: number,
  currency: string
): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatQuantity(
  value: number
): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function wrapText(
  text: string,
  maxCharacters: number
): string[] {
  const normalized =
    (text || "").trim();

  if (!normalized) {
    return [""];
  }

  const words =
    normalized.split(/\s+/);

  const lines: string[] = [];

  let current = "";

  for (const word of words) {
    const candidate = current
      ? `${current} ${word}`
      : word;

    if (
      candidate.length >
        maxCharacters &&
      current
    ) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

/* ============================================================
 * TEMPLATE
 * ============================================================
 */

export class ProformaInvoiceTemplate {
  private pdf!: PDFDocument;

  private page!: PDFPage;

  private font!: PDFFont;

  private bold!: PDFFont;

  private logo?: PDFImage;

  private pageNumber = 1;

  private y =
    PAGE_HEIGHT - 40;

  /* ==========================================================
   * PUBLIC RENDER
   * ==========================================================
   */

  async render(
    data: ProformaInvoicePdfData
  ): Promise<Uint8Array> {
    this.pdf =
      await PDFDocument.create();

    this.font =
      await this.pdf.embedFont(
        StandardFonts.Helvetica
      );

    this.bold =
      await this.pdf.embedFont(
        StandardFonts.HelveticaBold
      );

    await this.loadLogo();

    this.addPage();

    this.drawHeader(data);

    this.drawBuyerAndPiInfo(
      data
    );

    this.drawItems(data);

    this.drawTotals(data);

    this.drawNotes(data);

    this.drawTerms();

    this.drawFooter();

    return this.pdf.save();
  }

  /* ==========================================================
   * PAGE MANAGEMENT
   * ==========================================================
   */

  private addPage() {
    this.page =
      this.pdf.addPage([
        PAGE_WIDTH,
        PAGE_HEIGHT,
      ]);

    this.pageNumber =
      this.pdf.getPageCount();

    this.y =
      PAGE_HEIGHT - 40;
  }

  private ensureSpace(
    requiredHeight: number
  ) {
    if (
      this.y - requiredHeight <
      70
    ) {
      this.drawFooter();

      this.addPage();

      this.drawContinuationHeader();
    }
  }

  /* ==========================================================
   * LOGO
   * ==========================================================
   */

  private async loadLogo() {
    try {
      const logoPath =
        path.join(
          process.cwd(),
          "public",
          "images",
          "rootym-logo.svg"
        );

      const svg =
        await fs.readFile(
          logoPath,
          "utf8"
        );

      const renderer =
        new Resvg(svg, {
          fitTo: {
            mode: "width",
            value: 500,
          },
        });

      const png =
        renderer
          .render()
          .asPng();

      this.logo =
        await this.pdf.embedPng(
          png
        );
    } catch (error) {
      console.warn(
        "ROOTYM PDF logo could not be loaded:",
        error
      );

      this.logo =
        undefined;
    }
  }

  /* ==========================================================
   * HEADER
   * ==========================================================
   */

  private drawHeader(
    data: ProformaInvoicePdfData
  ) {
    const top =
      PAGE_HEIGHT - 42;

    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 7,
      width: PAGE_WIDTH,
      height: 7,
      color: COLORS.primary,
    });

    if (this.logo) {
      const logoDims =
        this.logo.scaleToFit(
          180,
          64
        );

      this.page.drawImage(
        this.logo,
        {
          x: MARGIN_LEFT,
          y: top - 48,
          width:
            logoDims.width,
          height:
            logoDims.height,
        }
      );
    } else {
      this.text(
        "ROOTYM",
        MARGIN_LEFT,
        top - 28,
        25,
        true,
        COLORS.primary
      );
    }

    this.text(
      ROOTYM_COMPANY.tagline,
      MARGIN_LEFT,
      top - 66,
      8,
      false,
      COLORS.muted
    );

    this.textRight(
      "PROFORMA INVOICE",
      PAGE_WIDTH -
        MARGIN_RIGHT,
      top - 15,
      18,
      true,
      COLORS.primary
    );

    this.textRight(
      "Export Commercial Document",
      PAGE_WIDTH -
        MARGIN_RIGHT,
      top - 34,
      8,
      false,
      COLORS.muted
    );

    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: top - 66,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y: top - 66,
      },
      thickness: 1,
      color: COLORS.mediumGray,
    });

    this.y =
      top - 88;

    void data.piNumber;
  }

  private drawContinuationHeader() {
    this.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 7,
      width: PAGE_WIDTH,
      height: 7,
      color: COLORS.primary,
    });

    this.text(
      "ROOTYM",
      MARGIN_LEFT,
      PAGE_HEIGHT - 42,
      17,
      true,
      COLORS.primary
    );

    this.textRight(
      "PROFORMA INVOICE",
      PAGE_WIDTH -
        MARGIN_RIGHT,
      PAGE_HEIGHT - 42,
      12,
      true,
      COLORS.primary
    );

    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: PAGE_HEIGHT - 55,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y: PAGE_HEIGHT - 55,
      },
      thickness: 0.7,
      color: COLORS.mediumGray,
    });

    this.y =
      PAGE_HEIGHT - 78;
  }

  /* ==========================================================
   * BUYER + PI INFORMATION
   * ==========================================================
   */

  private drawBuyerAndPiInfo(
    data: ProformaInvoicePdfData
  ) {
    const cardTop =
      this.y;

    const leftX =
      MARGIN_LEFT;

    const rightX = 335;

    const cardHeight = 122;

    this.page.drawRectangle({
      x: MARGIN_LEFT,
      y:
        cardTop -
        cardHeight,
      width: CONTENT_WIDTH,
      height: cardHeight,
      color: COLORS.lightGray,
      borderColor:
        COLORS.mediumGray,
      borderWidth: 0.7,
    });

    this.text(
      "BILL TO / BUYER",
      leftX + 14,
      cardTop - 21,
      8,
      true,
      COLORS.primary
    );

    let buyerY =
      cardTop - 40;

    const company =
      data.buyerCompany
        ?.trim() || "";

    const contact =
      data.buyerName
        ?.trim() || "";

    const address =
      data.buyerAddress
        ?.trim() || "";

    const country =
      data.buyerCountry
        ?.trim() || "";

    const normalize = (
      value: string
    ) =>
      value
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();

    const buyerLines: Array<{
      text: string;
      size: number;
      bold: boolean;
      color: typeof COLORS.text;
    }> = [];

    const seen =
      new Set<string>();

    const addBuyerLine = (
      value: string,
      options: {
        size: number;
        bold: boolean;
        color: typeof COLORS.text;
      }
    ) => {
      const cleaned =
        value.trim();

      if (!cleaned) {
        return;
      }

      const key =
        normalize(cleaned);

      if (seen.has(key)) {
        return;
      }

      seen.add(key);

      buyerLines.push({
        text: cleaned,
        ...options,
      });
    };

    addBuyerLine(
      company ||
        contact ||
        "-",
      {
        size: 11,
        bold: true,
        color: COLORS.text,
      }
    );

    if (
      company &&
      contact &&
      normalize(company) !==
        normalize(contact)
    ) {
      addBuyerLine(
        `Attn: ${contact}`,
        {
          size: 8.5,
          bold: false,
          color: COLORS.muted,
        }
      );
    }

    if (address) {
      const addressLines =
        wrapText(
          address,
          38
        );

      for (
        const line of
          addressLines.slice(
            0,
            2
          )
      ) {
        addBuyerLine(
          line,
          {
            size: 8,
            bold: false,
            color: COLORS.muted,
          }
        );
      }
    }

    if (country) {
      addBuyerLine(
        country,
        {
          size: 8,
          bold: true,
          color: COLORS.muted,
        }
      );
    }

    for (
      const line of buyerLines
    ) {
      this.text(
        line.text,
        leftX + 14,
        buyerY,
        line.size,
        line.bold,
        line.color
      );

      buyerY -=
        line.bold
          ? 16
          : 12;
    }

    this.page.drawLine({
      start: {
        x: 315,
        y: cardTop - 12,
      },
      end: {
        x: 315,
        y:
          cardTop -
          cardHeight +
          12,
      },
      thickness: 0.6,
      color: COLORS.mediumGray,
    });

    this.text(
      "PI DETAILS",
      rightX,
      cardTop - 21,
      8,
      true,
      COLORS.primary
    );

    this.metaRow(
      "PI Number",
      data.piNumber,
      rightX,
      cardTop - 43
    );

    this.metaRow(
      "Issue Date",
      data.issueDate,
      rightX,
      cardTop - 62
    );

    if (
      data.paymentDueDate
    ) {
      this.metaRow(
        "Payment Due",
        data.paymentDueDate,
        rightX,
        cardTop - 81
      );

      this.metaRow(
        "Currency",
        data.currency,
        rightX,
        cardTop - 100
      );
    } else {
      this.metaRow(
        "Original Quote",
        data.quoteNumber ??
          "-",
        rightX,
        cardTop - 81
      );

      this.metaRow(
        "Currency",
        data.currency,
        rightX,
        cardTop - 100
      );
    }

    this.y =
      cardTop -
      cardHeight -
      22;
  }

  private metaRow(
    label: string,
    value: string,
    x: number,
    y: number
  ) {
    this.text(
      label,
      x,
      y,
      7,
      false,
      COLORS.muted
    );

    this.textRight(
      value || "-",
      PAGE_WIDTH -
        MARGIN_RIGHT -
        14,
      y,
      8,
      true,
      COLORS.text
    );
  }

  /* ==========================================================
   * ITEMS
   * ==========================================================
   */

  private drawItems(
    data: ProformaInvoicePdfData
  ) {
    this.ensureSpace(100);

    this.sectionTitle(
      "PI LINE ITEMS"
    );

    const tableX =
      MARGIN_LEFT;

    const tableWidth =
      CONTENT_WIDTH;

    const headerHeight = 28;

    const descriptionX =
      tableX + 12;

    const qtyRight = 340;

    const unitRight = 375;

    const priceRight = 455;

    const totalRight =
      PAGE_WIDTH -
      MARGIN_RIGHT -
      12;

    this.page.drawRectangle({
      x: tableX,
      y:
        this.y -
        headerHeight,
      width: tableWidth,
      height: headerHeight,
      color: COLORS.primary,
    });

    this.text(
      "PRODUCT / DESCRIPTION",
      descriptionX,
      this.y - 18,
      7.5,
      true,
      COLORS.white
    );

    this.textRight(
      "QTY",
      qtyRight,
      this.y - 18,
      7.5,
      true,
      COLORS.white
    );

    this.textRight(
      "UNIT",
      unitRight,
      this.y - 18,
      7.5,
      true,
      COLORS.white
    );

    this.textRight(
      "UNIT PRICE",
      priceRight,
      this.y - 18,
      7.5,
      true,
      COLORS.white
    );

    this.textRight(
      "LINE TOTAL",
      totalRight,
      this.y - 18,
      7.5,
      true,
      COLORS.white
    );

    this.y -=
      headerHeight;

    if (!data.items.length) {
      this.page.drawRectangle({
        x: tableX,
        y: this.y - 40,
        width: tableWidth,
        height: 40,
        borderColor:
          COLORS.mediumGray,
        borderWidth: 0.6,
      });

      this.text(
        "No line items available.",
        descriptionX,
        this.y - 24,
        8,
        false,
        COLORS.muted
      );

      this.y -= 40;

      return;
    }

    data.items.forEach(
      (item, index) => {
        const descriptionLines =
          wrapText(
            item.description,
            38
          );

        const rowHeight =
          Math.max(
            34,
            descriptionLines.length *
              11 +
              18
          );

        this.ensureSpace(
          rowHeight + 5
        );

        if (
          index % 2 ===
          0
        ) {
          this.page.drawRectangle(
            {
              x: tableX,
              y:
                this.y -
                rowHeight,
              width: tableWidth,
              height: rowHeight,
              color: rgb(
                0.985,
                0.985,
                0.985
              ),
            }
          );
        }

        this.page.drawRectangle({
          x: tableX,
          y:
            this.y -
            rowHeight,
          width: tableWidth,
          height: rowHeight,
          borderColor:
            COLORS.mediumGray,
          borderWidth: 0.5,
        });

        let textY =
          this.y - 17;

        descriptionLines.forEach(
          (line) => {
            this.text(
              line,
              descriptionX,
              textY,
              8,
              line ===
                descriptionLines[0],
              COLORS.text
            );

            textY -= 11;
          }
        );

        this.textRight(
          formatQuantity(
            item.quantity
          ),
          qtyRight,
          this.y - 17,
          8,
          false,
          COLORS.text
        );

        this.textRight(
          item.unit || "-",
          unitRight,
          this.y - 17,
          8,
          false,
          COLORS.muted
        );

        this.textRight(
          formatMoney(
            item.unitPrice,
            data.currency
          ),
          priceRight,
          this.y - 17,
          8,
          false,
          COLORS.text
        );

        this.textRight(
          formatMoney(
            item.lineTotal,
            data.currency
          ),
          totalRight,
          this.y - 17,
          8,
          true,
          COLORS.text
        );

        this.y -=
          rowHeight;
      }
    );

    this.y -= 20;
  }

  /* ==========================================================
   * TOTALS
   * ==========================================================
   */

  private drawTotals(
    data: ProformaInvoicePdfData
  ) {
    this.ensureSpace(210);

    const boxWidth = 235;

    const boxX =
      PAGE_WIDTH -
      MARGIN_RIGHT -
      boxWidth;

    const boxTop =
      this.y;

    const boxHeight = 174;

    this.page.drawRectangle({
      x: boxX,
      y:
        boxTop -
        boxHeight,
      width: boxWidth,
      height: boxHeight,
      color: COLORS.lightGray,
      borderColor:
        COLORS.mediumGray,
      borderWidth: 0.7,
    });

    this.text(
      "PRICE SUMMARY",
      boxX + 14,
      boxTop - 22,
      8,
      true,
      COLORS.primary
    );

    let y =
      boxTop - 46;

    this.totalRow(
      "Subtotal",
      data.subtotal,
      data.currency,
      boxX,
      boxWidth,
      y
    );

    y -= 22;

    this.totalRow(
      "Discount",
      data.discount,
      data.currency,
      boxX,
      boxWidth,
      y,
      data.discount !== 0
    );

    y -= 22;

    this.totalRow(
      "Freight",
      data.freight,
      data.currency,
      boxX,
      boxWidth,
      y
    );

    y -= 22;

    this.totalRow(
      "Insurance",
      data.insurance,
      data.currency,
      boxX,
      boxWidth,
      y
    );

    y -= 22;

    this.totalRow(
      "Tax",
      data.tax,
      data.currency,
      boxX,
      boxWidth,
      y
    );

    this.page.drawLine({
      start: {
        x: boxX + 12,
        y: y - 12,
      },
      end: {
        x:
          boxX +
          boxWidth -
          12,
        y: y - 12,
      },
      thickness: 0.8,
      color: COLORS.mediumGray,
    });

    y -= 34;

    this.text(
      "GRAND TOTAL",
      boxX + 14,
      y,
      10,
      true,
      COLORS.primary
    );

    this.textRight(
      formatMoney(
        data.grandTotal,
        data.currency
      ),
      boxX +
        boxWidth -
        14,
      y,
      12,
      true,
      COLORS.primary
    );

    this.y =
      boxTop -
      boxHeight -
      22;
  }

  private totalRow(
    label: string,
    value: number,
    currency: string,
    boxX: number,
    boxWidth: number,
    y: number,
    negative = false
  ) {
    this.text(
      label,
      boxX + 14,
      y,
      8,
      false,
      COLORS.muted
    );

    const formatted =
      formatMoney(
        Math.abs(value),
        currency
      );

    this.textRight(
      negative && value !== 0
        ? `-${formatted}`
        : formatted,
      boxX +
        boxWidth -
        14,
      y,
      8,
      false,
      COLORS.text
    );
  }

  /* ==========================================================
   * NOTES
   * ==========================================================
   */

  private drawNotes(
    data: ProformaInvoicePdfData
  ) {
    if (
      !data.notes?.trim()
    ) {
      return;
    }

    const lines =
      wrapText(
        data.notes,
        95
      );

    const requiredHeight =
      32 +
      lines.length * 12;

    this.ensureSpace(
      requiredHeight
    );

    this.sectionTitle(
      "NOTES"
    );

    this.page.drawRectangle({
      x: MARGIN_LEFT,
      y:
        this.y -
        lines.length * 12 -
        18,
      width: CONTENT_WIDTH,
      height:
        lines.length * 12 +
        18,
      color: COLORS.lightGray,
      borderColor:
        COLORS.mediumGray,
      borderWidth: 0.6,
    });

    let y =
      this.y - 16;

    for (
      const line of lines
    ) {
      this.text(
        line,
        MARGIN_LEFT + 12,
        y,
        8,
        false,
        COLORS.text
      );

      y -= 12;
    }

    this.y =
      this.y -
      lines.length * 12 -
      36;
  }

  /* ==========================================================
   * TERMS
   * ==========================================================
   */

  private drawTerms() {
    this.ensureSpace(115);

    this.sectionTitle(
      "TERMS & CONDITIONS"
    );

    const terms = [
      DEFAULT_PAYMENT_TERMS,
      DEFAULT_DELIVERY_TERMS,
      `Incoterms: ${DEFAULT_INCOTERMS}`,
      "This Proforma Invoice is confidential and intended only for the recipient.",
      "Prices are subject to change without prior notice unless otherwise agreed.",
      "Goods remain subject to availability.",
    ];

    let y =
      this.y - 4;

    for (
      const term of terms
    ) {
      const lines =
        wrapText(
          term,
          94
        );

      for (
        let index = 0;
        index < lines.length;
        index++
      ) {
        const prefix =
          index === 0
            ? "• "
            : "  ";

        this.text(
          `${prefix}${lines[index]}`,
          MARGIN_LEFT,
          y,
          7.5,
          false,
          COLORS.muted
        );

        y -= 11;
      }

      y -= 2;
    }

    this.y = y;
  }

  /* ==========================================================
   * SECTION TITLE
   * ==========================================================
   */

  private sectionTitle(
    title: string
  ) {
    this.text(
      title,
      MARGIN_LEFT,
      this.y,
      8,
      true,
      COLORS.primary
    );

    this.page.drawLine({
      start: {
        x:
          MARGIN_LEFT +
          112,
        y: this.y + 2,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y: this.y + 2,
      },
      thickness: 0.6,
      color: COLORS.mediumGray,
    });

    this.y -= 16;
  }

  /* ==========================================================
   * FOOTER
   * ==========================================================
   */

  private drawFooter() {
    const y =
      FOOTER_Y + 18;

    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y,
      },
      thickness: 0.6,
      color: COLORS.mediumGray,
    });

    this.text(
      ROOTYM_COMPANY.name,
      MARGIN_LEFT,
      FOOTER_Y,
      7,
      true,
      COLORS.text
    );

    const contactParts = [
      ROOTYM_COMPANY.city,
      ROOTYM_COMPANY.state,
      ROOTYM_COMPANY.country,
      ROOTYM_COMPANY.email,
      ROOTYM_COMPANY.website,
    ].filter(Boolean);

    this.text(
      contactParts.join(
        "  |  "
      ),
      MARGIN_LEFT,
      FOOTER_Y - 11,
      6.5,
      false,
      COLORS.muted
    );

    this.textRight(
      `Page ${this.pageNumber}`,
      PAGE_WIDTH -
        MARGIN_RIGHT,
      FOOTER_Y,
      7,
      true,
      COLORS.primary
    );
  }

  /* ==========================================================
   * TEXT HELPERS
   * ==========================================================
   */

  private text(
    value: string,
    x: number,
    y: number,
    size = 9,
    bold = false,
    color = COLORS.text
  ) {
    if (!value) {
      return;
    }

    this.page.drawText(
      value,
      {
        x,
        y,
        size,
        font: bold
          ? this.bold
          : this.font,
        color,
      }
    );
  }

  private textRight(
    value: string,
    rightX: number,
    y: number,
    size = 9,
    bold = false,
    color = COLORS.text
  ) {
    if (!value) {
      return;
    }

    const font =
      bold
        ? this.bold
        : this.font;

    const width =
      font.widthOfTextAtSize(
        value,
        size
      );

    this.page.drawText(
      value,
      {
        x:
          rightX - width,
        y,
        size,
        font,
        color,
      }
    );
  }
}