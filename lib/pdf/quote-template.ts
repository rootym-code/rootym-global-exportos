/**
 * ============================================================
 * ROOTYM PDF Quote Template
 * File: lib/pdf/quote-template.ts
 * Sprint 8
 * ============================================================
 *
 * Production template scaffold using pdf-lib.
 * This file provides the reusable layout foundation for
 * quotation PDF generation.
 */

import {
  PDFDocument,
  PDFPage,
  PDFFont,
  StandardFonts,
  rgb,
} from "pdf-lib";

export interface QuotePdfItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface QuotePdfData {
  quoteNumber: string;
  quoteDate: string;
  validUntil: string;

  buyerName: string;
  buyerCompany?: string;
  buyerAddress?: string;
  buyerCountry?: string;

  currency: string;

  items: QuotePdfItem[];

  subtotal: number;
  discount: number;
  freight: number;
  insurance: number;
  tax: number;
  grandTotal: number;

  notes?: string;
}

export class QuoteTemplate {
  private page!: PDFPage;
  private font!: PDFFont;
  private bold!: PDFFont;

  async render(data: QuotePdfData): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();

    this.font = await pdf.embedFont(StandardFonts.Helvetica);
    this.bold = await pdf.embedFont(StandardFonts.HelveticaBold);

    this.page = pdf.addPage([595.28, 841.89]);

    this.drawHeader();
    this.drawBuyer(data);
    this.drawMeta(data);
    this.drawItems(data);
    this.drawTotals(data);
    this.drawTerms(data);
    this.drawFooter();

    return pdf.save();
  }

  private drawHeader() {
    this.page.drawText("ROOTYM", {
      x: 40,
      y: 800,
      font: this.bold,
      size: 22,
      color: rgb(0,0.45,0),
    });

    this.page.drawText("EXPORT QUOTATION", {
      x: 380,
      y: 800,
      font: this.bold,
      size: 16,
    });
  }

  private drawBuyer(data: QuotePdfData) {
    let y = 760;
    this.text("Buyer",40,y,true);
    y-=18;
    this.text(data.buyerCompany || "",40,y);
    y-=14;
    this.text(data.buyerName,40,y);
    y-=14;
    this.text(data.buyerAddress || "",40,y);
    y-=14;
    this.text(data.buyerCountry || "",40,y);
  }

  private drawMeta(data: QuotePdfData) {
    let y=760;
    this.text(`Quote : ${data.quoteNumber}`,360,y);
    y-=16;
    this.text(`Date : ${data.quoteDate}`,360,y);
    y-=16;
    this.text(`Valid : ${data.validUntil}`,360,y);
  }

  private drawItems(data: QuotePdfData) {
    let y=650;
    this.text("Description",40,y,true);
    this.text("Qty",300,y,true);
    this.text("Price",380,y,true);
    this.text("Total",470,y,true);

    y-=18;

    data.items.forEach(item=>{
      this.text(item.description,40,y);
      this.text(String(item.quantity),300,y);
      this.text(item.unitPrice.toFixed(2),380,y);
      this.text(item.lineTotal.toFixed(2),470,y);
      y-=16;
    });
  }

  private drawTotals(data: QuotePdfData){
    let y=240;
    this.total("Subtotal",data.subtotal,y); y-=16;
    this.total("Discount",data.discount,y); y-=16;
    this.total("Freight",data.freight,y); y-=16;
    this.total("Insurance",data.insurance,y); y-=16;
    this.total("Tax",data.tax,y); y-=16;
    this.total("Grand Total",data.grandTotal,y,true);
  }

  private drawTerms(data: QuotePdfData) {
    let y = 170;
  
    this.text("Notes:", 40, y, true);
    this.text(data.notes || "-", 170, y);
  }

  private drawFooter(){
    this.page.drawLine({
      start:{x:40,y:40},
      end:{x:555,y:40},
      thickness:0.5,
      color:rgb(.6,.6,.6)
    });
    this.text("ROOTYM AGRO HARVEST PRIVATE LIMITED",40,25);
  }

  private text(text:string,x:number,y:number,bold=false){
    this.page.drawText(text,{
      x,y,
      size:10,
      font:bold?this.bold:this.font
    });
  }

  private total(label:string,value:number,y:number,bold=false){
    this.text(label,360,y,bold);
    this.text(value.toFixed(2),470,y,bold);
  }
}
