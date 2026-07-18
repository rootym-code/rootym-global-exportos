/**
 * ============================================================
 * ROOTYM PDF Table Renderer
 * File: lib/pdf/table.ts
 * Sprint 8
 * ============================================================
 */

import { PDFPage, PDFFont, rgb } from "pdf-lib";

export interface TableColumn<T> {
  header: string;
  width: number;
  align?: "left" | "center" | "right";
  value: (row: T) => string;
}

export interface TableOptions<T> {
  page: PDFPage;
  font: PDFFont;
  boldFont: PDFFont;
  columns: TableColumn<T>[];
  rows: T[];
  startX: number;
  startY: number;
  rowHeight?: number;
  fontSize?: number;
}

export class PdfTable<T> {
  constructor(private readonly options: TableOptions<T>) {}

  render(): number {
    const {
      page,
      font,
      boldFont,
      columns,
      rows,
      startX,
      rowHeight = 18,
      fontSize = 10,
    } = this.options;

    let y = this.options.startY;

    // Header
    let x = startX;
    for (const col of columns) {
      page.drawRectangle({
        x,
        y: y - rowHeight + 3,
        width: col.width,
        height: rowHeight,
        borderWidth: 0.5,
        borderColor: rgb(0.75, 0.75, 0.75),
      });

      page.drawText(col.header, {
        x: x + 4,
        y: y - 12,
        font: boldFont,
        size: fontSize,
      });

      x += col.width;
    }

    y -= rowHeight;

    // Rows
    for (const row of rows) {
      x = startX;

      for (const col of columns) {
        page.drawRectangle({
          x,
          y: y - rowHeight + 3,
          width: col.width,
          height: rowHeight,
          borderWidth: 0.25,
          borderColor: rgb(0.85, 0.85, 0.85),
        });

        const text = col.value(row);

        const textWidth = font.widthOfTextAtSize(text, fontSize);

        let tx = x + 4;

        if (col.align === "center") {
          tx = x + (col.width - textWidth) / 2;
        } else if (col.align === "right") {
          tx = x + col.width - textWidth - 4;
        }

        page.drawText(text, {
          x: tx,
          y: y - 12,
          font,
          size: fontSize,
        });

        x += col.width;
      }

      y -= rowHeight;
    }

    return y;
  }
}
