/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the ROOTYM GST billing invoice PDF template
 *          used by the asynchronous billing invoice generation
 *          workflow.
 *
 * Layout:
 * - Single-page professional SaaS tax invoice
 * - Width-safe text wrapping based on actual PDF font metrics
 * - Seller and customer information in a compact two-column panel
 * - Tax summary and total shown side-by-side
 * - SaaS terms, non-refundable payment condition, and support
 *   contacts presented in a compact two-column footer panel
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

export type BillingInvoicePdfTaxType =
  | "NONE"
  | "CGST_SGST"
  | "IGST";

export interface BillingInvoicePdfItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  taxableAmount: number;
}

export interface BillingInvoicePdfData {
  invoiceNumber: string;
  invoiceDate: string;

  seller: {
    legalBusinessName: string;
    gstin?: string;
    registeredAddress?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  customer: {
    name: string;
    email: string;
    mobile: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    gstin?: string;
  };

  paymentReference?: string;
  subscriptionReference?: string;

  currency: string;

  items: BillingInvoicePdfItem[];

  taxableAmount: number;

  taxType: BillingInvoicePdfTaxType;
  taxRate: number;

  cgstRate: number;
  cgstAmount: number;

  sgstRate: number;
  sgstAmount: number;

  igstRate: number;
  igstAmount: number;

  totalTaxAmount: number;
  totalAmount: number;

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

const FOOTER_Y = 28;
const CONTENT_BOTTOM = 58;

/* ============================================================
 * COLORS
 * ============================================================
 */

const COLORS = {
  primary: rgb(0.08, 0.36, 0.25),
  secondary: rgb(0.14, 0.47, 0.34),
  border: rgb(0.78, 0.83, 0.81),
  text: rgb(0.12, 0.15, 0.14),
  muted: rgb(0.37, 0.42, 0.40),

  white: rgb(1, 1, 1),
  black: rgb(0, 0, 0),

  lightGray: rgb(0.965, 0.975, 0.972),
  mediumGray: rgb(0.88, 0.90, 0.89),
  lightGreen: rgb(0.93, 0.97, 0.95),
};

/* ============================================================
 * TEXT / MONEY HELPERS
 * ============================================================
 */

function formatMoney(
  value: number,
  currency: string,
): string {
  try {
    const formatted = new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency,
        currencyDisplay:
          currency.toUpperCase() === "INR"
            ? "code"
            : "symbol",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      },
    ).format(value);

    // StandardFonts.Helvetica uses WinAnsi and cannot encode
    // the Unicode Indian Rupee symbol. INR is therefore rendered
    // as the ISO currency code in the PDF.
    return formatted.replace(/\u00a0/g, " ");
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

function formatQuantity(
  value: number,
): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}

function normalizeText(
  value: string | undefined | null,
): string {
  return (value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Wrap text using the actual embedded font width.
 * This is deliberately width-based rather than character-count based
 * so long GSTINs, email addresses, references, and names do not escape
 * their visual column.
 */
function wrapTextToWidth(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
  maxLines = 10,
): string[] {
  const normalized = normalizeText(text);

  if (!normalized) {
    return [""];
  }

  const words = normalized.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  const pushCurrent = () => {
    if (current) {
      lines.push(current);
      current = "";
    }
  };

  for (const word of words) {
    const candidate = current
      ? `${current} ${word}`
      : word;

    if (
      font.widthOfTextAtSize(candidate, size) <=
      maxWidth
    ) {
      current = candidate;
      continue;
    }

    if (current) {
      pushCurrent();
    }

    // A single token such as an email/reference can itself exceed
    // the column. Split it safely by characters instead of allowing
    // it to overflow the page.
    if (
      font.widthOfTextAtSize(word, size) >
      maxWidth
    ) {
      let partial = "";

      for (const char of word) {
        const candidatePartial =
          partial + char;

        if (
          font.widthOfTextAtSize(
            candidatePartial,
            size,
          ) <= maxWidth
        ) {
          partial = candidatePartial;
        } else {
          if (partial) {
            lines.push(partial);
          }
          partial = char;
        }

        if (lines.length >= maxLines) {
          break;
        }
      }

      if (
        partial &&
        lines.length < maxLines
      ) {
        current = partial;
      }

      if (lines.length >= maxLines) {
        break;
      }
    } else {
      current = word;
    }
  }

  if (
    current &&
    lines.length < maxLines
  ) {
    lines.push(current);
  }

  return lines.length > 0
    ? lines.slice(0, maxLines)
    : [""];
}

function drawWrappedText(
  page: PDFPage,
  text: string,
  options: {
    x: number;
    y: number;
    font: PDFFont;
    size: number;
    color: ReturnType<typeof rgb>;
    maxWidth: number;
    lineHeight: number;
    maxLines?: number;
  },
): number {
  const lines = wrapTextToWidth(
    text,
    options.font,
    options.size,
    options.maxWidth,
    options.maxLines ?? 10,
  );

  let y = options.y;

  for (const line of lines) {
    page.drawText(line, {
      x: options.x,
      y,
      font: options.font,
      size: options.size,
      color: options.color,
    });

    y -= options.lineHeight;
  }

  return y;
}

/* ============================================================
 * TEMPLATE
 * ============================================================
 */

export class BillingInvoiceTemplate {
  private pdf!: PDFDocument;
  private page!: PDFPage;
  private font!: PDFFont;
  private bold!: PDFFont;
  private logo?: PDFImage;

  async render(
    data: BillingInvoicePdfData,
  ): Promise<Uint8Array> {
    this.pdf =
      await PDFDocument.create();

    this.font =
      await this.pdf.embedFont(
        StandardFonts.Helvetica,
      );

    this.bold =
      await this.pdf.embedFont(
        StandardFonts.HelveticaBold,
      );

    await this.loadLogo();

    // Intentionally one page only. The layout is compact and
    // width-safe for the ROOTYM SaaS invoice structure.
    this.page =
      this.pdf.addPage([
        PAGE_WIDTH,
        PAGE_HEIGHT,
      ]);

    this.drawHeader(data);
    this.drawPartyAndInvoicePanel(data);
    this.drawItems(data);
    this.drawTaxAndTotal(data);
    this.drawTermsAndSupport(data);
    this.drawFooter();

    return this.pdf.save();
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
          "rootym-logo.svg",
        );

      const svg =
        await fs.readFile(
          logoPath,
          "utf8",
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
          png,
        );
    } catch (error) {
      console.warn(
        "ROOTYM billing invoice logo could not be loaded:",
        error,
      );

      this.logo = undefined;
    }
  }

  /* ==========================================================
   * HEADER
   * ==========================================================
   */

  private drawHeader(
    data: BillingInvoicePdfData,
  ) {
    const topLineY =
      PAGE_HEIGHT - 7;

    this.page.drawRectangle({
      x: 0,
      y: topLineY,
      width: PAGE_WIDTH,
      height: 7,
      color: COLORS.primary,
    });

    const logoTop =
      PAGE_HEIGHT - 28;

    if (this.logo) {
      const logoDims =
        this.logo.scaleToFit(
          145,
          48,
        );

      this.page.drawImage(
        this.logo,
        {
          x: MARGIN_LEFT,
          y:
            logoTop -
            logoDims.height,
          width: logoDims.width,
          height: logoDims.height,
        },
      );
    } else {
      this.page.drawText(
        "ROOTYM",
        {
          x: MARGIN_LEFT,
          y: logoTop - 28,
          font: this.bold,
          size: 24,
          color: COLORS.primary,
        },
      );
    }

    this.page.drawText(
      "Build | Manage | Grow Globally",
      {
        x: MARGIN_LEFT + 2,
        y: 772,
        font: this.font,
        size: 7,
        color: COLORS.muted,
      },
    );

    const titleX =
      PAGE_WIDTH -
      MARGIN_RIGHT -
      155;

    this.page.drawText(
      "TAX INVOICE",
      {
        x: titleX,
        y: 794,
        font: this.bold,
        size: 19,
        color: COLORS.primary,
      },
    );

    const invoiceNumberWidth =
      this.font.widthOfTextAtSize(
        data.invoiceNumber,
        9,
      );

    this.page.drawText(
      data.invoiceNumber,
      {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT -
          invoiceNumberWidth,
        y: 775,
        font: this.font,
        size: 9,
        color: COLORS.muted,
      },
    );

    this.drawHeaderMeta(
      "Invoice Date",
      data.invoiceDate,
      728,
    );

    if (data.paymentReference) {
      this.drawHeaderMeta(
        "Payment Ref.",
        data.paymentReference,
        713,
      );
    }

    if (data.subscriptionReference) {
      this.drawHeaderMeta(
        "Subscription Ref.",
        data.subscriptionReference,
        698,
      );
    }
  }

  private drawHeaderMeta(
    label: string,
    value: string,
    y: number,
  ) {
    const labelX = 370;
    const valueX = 452;
    const maxWidth =
      PAGE_WIDTH -
      MARGIN_RIGHT -
      valueX;

    this.page.drawText(
      `${label}`,
      {
        x: labelX,
        y,
        font: this.bold,
        size: 7.5,
        color: COLORS.text,
      },
    );

    this.page.drawText(
      ":",
      {
        x: 446,
        y,
        font: this.bold,
        size: 7.5,
        color: COLORS.text,
      },
    );

    const lines =
      wrapTextToWidth(
        value,
        this.font,
        7.5,
        maxWidth,
        2,
      );

    let valueY = y;

    for (const line of lines) {
      this.page.drawText(
        line,
        {
          x: valueX,
          y: valueY,
          font: this.font,
          size: 7.5,
          color: COLORS.text,
        },
      );

      valueY -= 9;
    }
  }

  /* ==========================================================
   * SELLER / CUSTOMER / INVOICE PANEL
   * ==========================================================
   */

  private drawPartyAndInvoicePanel(
    data: BillingInvoicePdfData,
  ) {
    const top = 678;
    const height = 112;
    const bottom = top - height;
    const midX =
      MARGIN_LEFT +
      CONTENT_WIDTH / 2;

    this.page.drawRectangle({
      x: MARGIN_LEFT,
      y: bottom,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.lightGreen,
      borderColor: COLORS.border,
      borderWidth: 0.8,
    });

    this.page.drawLine({
      start: {
        x: midX,
        y: bottom,
      },
      end: {
        x: midX,
        y: top,
      },
      thickness: 0.6,
      color: COLORS.border,
    });

    this.drawSellerPanel(
      data,
      MARGIN_LEFT + 12,
      top - 16,
      CONTENT_WIDTH / 2 - 24,
    );

    this.drawCustomerPanel(
      data,
      midX + 12,
      top - 16,
      CONTENT_WIDTH / 2 - 24,
    );
  }

  private drawSellerPanel(
    data: BillingInvoicePdfData,
    x: number,
    headingY: number,
    width: number,
  ) {
    this.page.drawText(
      "SELLER",
      {
        x,
        y: headingY,
        font: this.bold,
        size: 9,
        color: COLORS.secondary,
      },
    );

    let y =
      headingY - 16;

    y =
      drawWrappedText(
        this.page,
        data.seller.legalBusinessName,
        {
          x,
          y,
          font: this.bold,
          size: 8.5,
          color: COLORS.text,
          maxWidth: width,
          lineHeight: 10,
          maxLines: 2,
        },
      ) - 1;

    if (data.seller.gstin) {
      y =
        drawWrappedText(
          this.page,
          `GSTIN: ${data.seller.gstin}`,
          {
            x,
            y,
            font: this.font,
            size: 7.8,
            color: COLORS.text,
            maxWidth: width,
            lineHeight: 9,
            maxLines: 1,
          },
        ) - 1;
    }

    const address = [
      data.seller.registeredAddress,
      [
        data.seller.city,
        data.seller.state,
        data.seller.postalCode,
      ]
        .filter(Boolean)
        .join(", "),
      data.seller.country,
    ]
      .filter(Boolean)
      .join(", ");

    drawWrappedText(
      this.page,
      address,
      {
        x,
        y,
        font: this.font,
        size: 7.8,
        color: COLORS.text,
        maxWidth: width,
        lineHeight: 9,
        maxLines: 4,
      },
    );
  }

  private drawCustomerPanel(
    data: BillingInvoicePdfData,
    x: number,
    headingY: number,
    width: number,
  ) {
    this.page.drawText(
      "BILL TO",
      {
        x,
        y: headingY,
        font: this.bold,
        size: 9,
        color: COLORS.secondary,
      },
    );

    const contentY =
      headingY - 16;

    const leftWidth =
      Math.min(145, width * 0.48);

    const rightX =
      x + leftWidth + 10;

    const rightWidth =
      width -
      leftWidth -
      10;

    drawWrappedText(
      this.page,
      data.customer.name,
      {
        x,
        y: contentY,
        font: this.bold,
        size: 8.5,
        color: COLORS.text,
        maxWidth: leftWidth,
        lineHeight: 10,
        maxLines: 2,
      },
    );

    const address =
      [
        data.customer.addressLine1,
        data.customer.addressLine2,
        [
          data.customer.city,
          data.customer.state,
          data.customer.postalCode,
        ]
          .filter(Boolean)
          .join(", "),
        data.customer.country,
      ]
        .filter(Boolean)
        .join(", ");

    drawWrappedText(
      this.page,
      address,
      {
        x,
        y: contentY - 20,
        font: this.font,
        size: 7.8,
        color: COLORS.text,
        maxWidth: leftWidth,
        lineHeight: 9,
        maxLines: 5,
      },
    );

    this.drawCompactLabelValue(
      "Email",
      data.customer.email,
      rightX,
      contentY,
      rightWidth,
    );

    this.drawCompactLabelValue(
      "Mobile",
      data.customer.mobile,
      rightX,
      contentY - 15,
      rightWidth,
    );

    this.drawCompactLabelValue(
      "GSTIN",
      data.customer.gstin ??
        "Not registered",
      rightX,
      contentY - 30,
      rightWidth,
    );
  }

  private drawCompactLabelValue(
    label: string,
    value: string,
    x: number,
    y: number,
    width: number,
  ) {
    const labelText =
      `${label}:`;

    this.page.drawText(
      labelText,
      {
        x,
        y,
        font: this.bold,
        size: 7.3,
        color: COLORS.text,
      },
    );

    const labelWidth =
      this.bold.widthOfTextAtSize(
        labelText,
        7.3,
      );

    const valueX =
      x + labelWidth + 4;

    const valueWidth =
      Math.max(
        35,
        width -
          labelWidth -
          4,
      );

    const lines =
      wrapTextToWidth(
        value,
        this.font,
        7.3,
        valueWidth,
        2,
      );

    let valueY = y;

    for (const line of lines) {
      this.page.drawText(
        line,
        {
          x: valueX,
          y: valueY,
          font: this.font,
          size: 7.3,
          color: COLORS.text,
        },
      );

      valueY -= 9;
    }
  }

  /* ==========================================================
   * ITEMS
   * ==========================================================
   */

  private drawItems(
    data: BillingInvoicePdfData,
  ) {
    const top = 548;

    const headerHeight = 23;
    const rowHeight =
      data.items.length > 1
        ? 32
        : 38;

    const x = MARGIN_LEFT;

    // Columns total exactly to CONTENT_WIDTH (515 pt).
    const columns = {
      description: x,
      quantity: x + 220,
      unit: x + 260,
      unitPrice: x + 330,
      taxable: x + 415,
    };

    const widths = {
      description: 220,
      quantity: 40,
      unit: 70,
      unitPrice: 85,
      taxable: 100,
    };

    this.page.drawRectangle({
      x,
      y: top - headerHeight,
      width: CONTENT_WIDTH,
      height: headerHeight,
      color: COLORS.lightGreen,
      borderColor: COLORS.border,
      borderWidth: 0.7,
    });

    const headerY =
      top - 15;

    this.page.drawText(
      "DESCRIPTION",
      {
        x: columns.description + 8,
        y: headerY,
        font: this.bold,
        size: 7.5,
        color: COLORS.primary,
      },
    );

    this.page.drawText(
      "QTY",
      {
        x: columns.quantity + 10,
        y: headerY,
        font: this.bold,
        size: 7.5,
        color: COLORS.primary,
      },
    );

    this.page.drawText(
      "UNIT",
      {
        x: columns.unit + 8,
        y: headerY,
        font: this.bold,
        size: 7.5,
        color: COLORS.primary,
      },
    );

    this.page.drawText(
      "UNIT PRICE",
      {
        x: columns.unitPrice + 7,
        y: headerY,
        font: this.bold,
        size: 7.5,
        color: COLORS.primary,
      },
    );

    this.page.drawText(
      "TAXABLE AMOUNT",
      {
        x: columns.taxable + 6,
        y: headerY,
        font: this.bold,
        size: 7.5,
        color: COLORS.primary,
      },
    );

    // Vertical column guides.
    const guideXs = [
      columns.quantity,
      columns.unit,
      columns.unitPrice,
      columns.taxable,
    ];

    for (const guideX of guideXs) {
      this.page.drawLine({
        start: {
          x: guideX,
          y: top - headerHeight,
        },
        end: {
          x: guideX,
          y:
            top -
            headerHeight -
            rowHeight,
        },
        thickness: 0.45,
        color: COLORS.border,
      });
    }

    let currentTop =
      top - headerHeight;

    const items =
      data.items.length > 0
        ? data.items
        : [
            {
              description:
                "ROOTYM SaaS Subscription",
              quantity: 1,
              unit: "subscription",
              unitPrice:
                data.totalAmount,
              taxableAmount:
                data.taxableAmount,
            },
          ];

    items.forEach(
      (item, index) => {
        const actualRowHeight =
          index < 2
            ? rowHeight
            : 28;

        this.page.drawRectangle({
          x,
          y:
            currentTop -
            actualRowHeight,
          width: CONTENT_WIDTH,
          height: actualRowHeight,
          color: COLORS.white,
          borderColor: COLORS.border,
          borderWidth: 0.45,
        });

        const itemY =
          currentTop - 14;

        drawWrappedText(
          this.page,
          item.description,
          {
            x:
              columns.description + 8,
            y: itemY,
            font: this.font,
            size: 7.7,
            color: COLORS.text,
            maxWidth:
              widths.description - 14,
            lineHeight: 9,
            maxLines: 2,
          },
        );

        this.page.drawText(
          formatQuantity(
            item.quantity,
          ),
          {
            x:
              columns.quantity + 10,
            y: itemY,
            font: this.font,
            size: 7.7,
            color: COLORS.text,
          },
        );

        drawWrappedText(
          this.page,
          item.unit,
          {
            x:
              columns.unit + 7,
            y: itemY,
            font: this.font,
            size: 7.5,
            color: COLORS.text,
            maxWidth:
              widths.unit - 12,
            lineHeight: 9,
            maxLines: 2,
          },
        );

        this.drawRightAlignedText(
          formatMoney(
            item.unitPrice,
            data.currency,
          ),
          columns.unitPrice +
            widths.unitPrice -
            7,
          itemY,
          7.3,
          this.font,
        );

        this.drawRightAlignedText(
          formatMoney(
            item.taxableAmount,
            data.currency,
          ),
          columns.taxable +
            widths.taxable -
            7,
          itemY,
          7.3,
          this.font,
        );

        currentTop -=
          actualRowHeight;
      },
    );
  }

  /* ==========================================================
   * TAX SUMMARY + TOTAL
   * ==========================================================
   */

  private drawTaxAndTotal(
    data: BillingInvoicePdfData,
  ) {
    const top = 468;
    const gap = 18;
    const taxWidth = 300;
    const totalWidth =
      CONTENT_WIDTH -
      taxWidth -
      gap;

    const taxX = MARGIN_LEFT;
    const totalX =
      taxX +
      taxWidth +
      gap;

    const boxHeight = 94;
    const bottom =
      top - boxHeight;

    this.page.drawRectangle({
      x: taxX,
      y: bottom,
      width: taxWidth,
      height: boxHeight,
      color: COLORS.lightGray,
      borderColor: COLORS.border,
      borderWidth: 0.7,
    });

    this.page.drawText(
      "TAX SUMMARY",
      {
        x: taxX + 12,
        y: top - 17,
        font: this.bold,
        size: 9,
        color: COLORS.primary,
      },
    );

    let y =
      top - 34;

    this.drawAmountRow(
      "Taxable Amount",
      data.taxableAmount,
      data.currency,
      taxX + 12,
      taxX + taxWidth - 12,
      y,
    );

    y -= 15;

    if (
      data.taxType ===
      "CGST_SGST"
    ) {
      this.drawAmountRow(
        `CGST (${data.cgstRate.toFixed(2)}%)`,
        data.cgstAmount,
        data.currency,
        taxX + 12,
        taxX + taxWidth - 12,
        y,
      );

      y -= 15;

      this.drawAmountRow(
        `SGST (${data.sgstRate.toFixed(2)}%)`,
        data.sgstAmount,
        data.currency,
        taxX + 12,
        taxX + taxWidth - 12,
        y,
      );
    } else if (
      data.taxType === "IGST"
    ) {
      this.drawAmountRow(
        `IGST (${data.igstRate.toFixed(2)}%)`,
        data.igstAmount,
        data.currency,
        taxX + 12,
        taxX + taxWidth - 12,
        y,
      );
    } else {
      this.page.drawText(
        "GST not applicable",
        {
          x: taxX + 12,
          y,
          font: this.font,
          size: 8,
          color: COLORS.muted,
        },
      );
    }

    y -= 15;

    this.page.drawLine({
      start: {
        x: taxX + 12,
        y: y + 5,
      },
      end: {
        x: taxX + taxWidth - 12,
        y: y + 5,
      },
      thickness: 0.45,
      color: COLORS.border,
    });

    this.drawAmountRow(
      "Total GST",
      data.totalTaxAmount,
      data.currency,
      taxX + 12,
      taxX + taxWidth - 12,
      y - 5,
    );

    this.page.drawRectangle({
      x: totalX,
      y: bottom,
      width: totalWidth,
      height: boxHeight,
      color: COLORS.lightGreen,
      borderColor: COLORS.secondary,
      borderWidth: 0.9,
    });

    this.page.drawText(
      "TOTAL AMOUNT",
      {
        x: totalX + 12,
        y: top - 20,
        font: this.bold,
        size: 9,
        color: COLORS.primary,
      },
    );

    const totalText =
      formatMoney(
        data.totalAmount,
        data.currency,
      );

    const totalSize = 15;
    const totalMaxWidth =
      totalWidth - 24;

    const fittedTotalSize =
      this.fitFontSize(
        totalText,
        this.bold,
        totalSize,
        11,
        totalMaxWidth,
      );

    this.page.drawText(
      totalText,
      {
        x: totalX + 12,
        y: top - 46,
        font: this.bold,
        size: fittedTotalSize,
        color: COLORS.primary,
      },
    );

    const words =
      this.amountInWords(
        data.totalAmount,
        data.currency,
      );

    drawWrappedText(
      this.page,
      words,
      {
        x: totalX + 12,
        y: top - 65,
        font: this.font,
        size: 6.8,
        color: COLORS.text,
        maxWidth:
          totalWidth - 24,
        lineHeight: 8,
        maxLines: 2,
      },
    );
  }

  /* ==========================================================
   * TERMS + SUPPORT
   * ==========================================================
   */

  private drawTermsAndSupport(
    data: BillingInvoicePdfData,
  ) {
    const top = 350;
    const height = 230;
    const bottom =
      top - height;

    this.page.drawRectangle({
      x: MARGIN_LEFT,
      y: bottom,
      width: CONTENT_WIDTH,
      height,
      color: COLORS.white,
      borderColor: COLORS.border,
      borderWidth: 0.7,
    });

    const dividerX =
      MARGIN_LEFT +
      390;

    this.page.drawLine({
      start: {
        x: dividerX,
        y: bottom + 12,
      },
      end: {
        x: dividerX,
        y: top - 12,
      },
      thickness: 0.6,
      color: COLORS.border,
    });

    this.drawTerms(
      data,
      MARGIN_LEFT + 12,
      top - 17,
      dividerX -
        MARGIN_LEFT -
        24,
    );

    this.drawSupport(
      MARGIN_LEFT +
        402,
      top - 17,
      PAGE_WIDTH -
        MARGIN_RIGHT -
        (MARGIN_LEFT + 402) -
        10,
    );
  }

  private drawTerms(
    data: BillingInvoicePdfData,
    x: number,
    headingY: number,
    width: number,
  ) {
    this.page.drawText(
      "TERMS & CONDITIONS",
      {
        x,
        y: headingY,
        font: this.bold,
        size: 9,
        color: COLORS.primary,
      },
    );

    const terms = [
      "1. Subscription: This invoice relates to ROOTYM SaaS software subscription services.",
      "2. Payment: Subscription fees are payable as agreed at the time of purchase or renewal.",
      "3. Non-refundable: Payments are non-refundable once the subscription has been purchased, renewed, or activated, except where required by applicable law.",
      "4. Service access: Access to ROOTYM SaaS is subject to the applicable subscription plan, billing period, service availability, and ROOTYM's then-current service terms.",
      "5. Taxes: Applicable GST and other statutory taxes are charged as shown on this invoice.",
      "6. Customer information: The customer is responsible for providing accurate billing, GSTIN, and contact information and for promptly notifying ROOTYM of any changes.",
      "7. Cancellation / renewal: Renewal, cancellation or changes to a subscription are governed by the applicable ROOTYM SaaS subscription terms and do not automatically create a refund right.",
      "8. Electronic invoice: This invoice is an electronically generated tax invoice and is valid without a physical signature unless a signature is specifically required by applicable law.",
      "9. Governing terms: Use of ROOTYM SaaS is subject to the applicable ROOTYM SaaS Terms of Service / Agreement and applicable laws of India.",
    ];

    let y =
      headingY - 15;

    for (const term of terms) {
      const lines =
        wrapTextToWidth(
          term,
          this.font,
          6.65,
          width,
          2,
        );

      for (const line of lines) {
        this.page.drawText(
          line,
          {
            x,
            y,
            font: this.font,
            size: 6.65,
            color: COLORS.muted,
          },
        );

        y -= 8;
      }

      y -= 2;
    }

    if (data.notes) {
      y -= 2;

      this.page.drawText(
        "Notes:",
        {
          x,
          y,
          font: this.bold,
          size: 6.7,
          color: COLORS.text,
        },
      );

      y -= 8;

      drawWrappedText(
        this.page,
        data.notes,
        {
          x,
          y,
          font: this.font,
          size: 6.5,
          color: COLORS.muted,
          maxWidth: width,
          lineHeight: 8,
          maxLines: 2,
        },
      );
    }
  }

  private drawSupport(
    x: number,
    headingY: number,
    width: number,
  ) {
    this.page.drawText(
      "CUSTOMER SUPPORT",
      {
        x,
        y: headingY,
        font: this.bold,
        size: 9,
        color: COLORS.primary,
      },
    );

    let y =
      headingY - 20;

    this.page.drawText(
      "Support",
      {
        x,
        y,
        font: this.bold,
        size: 7.3,
        color: COLORS.text,
      },
    );

    y -= 11;

    drawWrappedText(
      this.page,
      "support@rootym.com",
      {
        x,
        y,
        font: this.font,
        size: 7.3,
        color: COLORS.secondary,
        maxWidth: width,
        lineHeight: 9,
        maxLines: 2,
      },
    );

    y -= 22;

    this.page.drawText(
      "Support Mobile",
      {
        x,
        y,
        font: this.bold,
        size: 7.3,
        color: COLORS.text,
      },
    );

    y -= 11;

    this.page.drawText(
      "+91-7083089752",
      {
        x,
        y,
        font: this.font,
        size: 7.3,
        color: COLORS.text,
      },
    );

    y -= 23;

    this.page.drawLine({
      start: {
        x,
        y,
      },
      end: {
        x:
          x + width,
        y,
      },
      thickness: 0.45,
      color: COLORS.border,
    });

    y -= 18;

    drawWrappedText(
      this.page,
      "For billing, payment or account related queries, please reach out to our support team.",
      {
        x,
        y,
        font: this.font,
        size: 7,
        color: COLORS.muted,
        maxWidth: width,
        lineHeight: 10,
        maxLines: 6,
      },
    );
  }

  /* ==========================================================
   * FOOTER
   * ==========================================================
   */

  private drawFooter() {
    this.page.drawLine({
      start: {
        x: MARGIN_LEFT,
        y: FOOTER_Y + 15,
      },
      end: {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT,
        y: FOOTER_Y + 15,
      },
      thickness: 0.6,
      color: COLORS.border,
    });

    this.page.drawText(
      "Thank you for choosing ROOTYM!",
      {
        x: MARGIN_LEFT,
        y: FOOTER_Y + 2,
        font: this.font,
        size: 7,
        color: COLORS.text,
      },
    );

    this.page.drawText(
      "ROOTYM ExportOS",
      {
        x: MARGIN_LEFT,
        y: FOOTER_Y - 9,
        font: this.font,
        size: 6.5,
        color: COLORS.muted,
      },
    );

    const pageText =
      "Page 1 of 1";

    const pageWidth =
      this.font.widthOfTextAtSize(
        pageText,
        7,
      );

    this.page.drawText(
      pageText,
      {
        x:
          PAGE_WIDTH -
          MARGIN_RIGHT -
          pageWidth,
        y: FOOTER_Y + 2,
        font: this.font,
        size: 7,
        color: COLORS.muted,
      },
    );
  }

  /* ==========================================================
   * SMALL DRAW HELPERS
   * ==========================================================
   */

  private drawAmountRow(
    label: string,
    amount: number,
    currency: string,
    labelX: number,
    amountX: number,
    y: number,
  ) {
    this.page.drawText(
      label,
      {
        x: labelX,
        y,
        font: this.font,
        size: 7.7,
        color: COLORS.text,
      },
    );

    const value =
      formatMoney(
        amount,
        currency,
      );

    const valueWidth =
      this.font.widthOfTextAtSize(
        value,
        7.7,
      );

    this.page.drawText(
      value,
      {
        x:
          amountX -
          valueWidth,
        y,
        font: this.font,
        size: 7.7,
        color: COLORS.text,
      },
    );
  }

  private drawRightAlignedText(
    text: string,
    rightX: number,
    y: number,
    size: number,
    font: PDFFont,
  ) {
    const width =
      font.widthOfTextAtSize(
        text,
        size,
      );

    this.page.drawText(
      text,
      {
        x: rightX - width,
        y,
        font,
        size,
        color: COLORS.text,
      },
    );
  }

  private fitFontSize(
    text: string,
    font: PDFFont,
    preferredSize: number,
    minimumSize: number,
    maxWidth: number,
  ): number {
    let size =
      preferredSize;

    while (
      size > minimumSize &&
      font.widthOfTextAtSize(
        text,
        size,
      ) > maxWidth
    ) {
      size -= 0.5;
    }

    return size;
  }

  /**
   * Lightweight amount-in-words helper for INR invoice presentation.
   * The numeric amount remains the authoritative amount on the invoice.
   */
  private amountInWords(
    amount: number,
    currency: string,
  ): string {
    if (
      currency.toUpperCase() !== "INR"
    ) {
      return "";
    }

    const rounded =
      Math.round(
        amount,
      );

    if (rounded < 0) {
      return "";
    }

    const words = this.numberToIndianWords(
      rounded,
    );

    return words
      ? `(${words} Only)`
      : "";
  }

  private numberToIndianWords(
    value: number,
  ): string {
    if (value === 0) {
      return "Indian Rupees Zero";
    }

    const belowTwenty = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];

    const twoDigitWords = (
      number: number,
    ): string => {
      if (number < 20) {
        return belowTwenty[number];
      }

      const ten =
        Math.floor(
          number / 10,
        );
      const one =
        number % 10;

      return (
        tens[ten] +
        (one
          ? ` ${belowTwenty[one]}`
          : "")
      );
    };

    const parts: string[] = [];

    const crore =
      Math.floor(
        value / 10000000,
      );

    let remainder =
      value % 10000000;

    const lakh =
      Math.floor(
        remainder / 100000,
      );

    remainder %= 100000;

    const thousand =
      Math.floor(
        remainder / 1000,
      );

    remainder %= 1000;

    const hundred =
      Math.floor(
        remainder / 100,
      );

    const lastTwo =
      remainder % 100;

    if (crore) {
      parts.push(
        `${this.numberToIndianWords(crore).replace(/^Indian Rupees /, "")} Crore`,
      );
    }

    if (lakh) {
      parts.push(
        `${this.numberToIndianWords(lakh).replace(/^Indian Rupees /, "")} Lakh`,
      );
    }

    if (thousand) {
      parts.push(
        `${this.numberToIndianWords(thousand).replace(/^Indian Rupees /, "")} Thousand`,
      );
    }

    if (hundred) {
      parts.push(
        `${belowTwenty[hundred]} Hundred`,
      );
    }

    if (lastTwo) {
      parts.push(
        twoDigitWords(lastTwo),
      );
    }

    return `Indian Rupees ${parts.join(" ")}`;
  }
}
