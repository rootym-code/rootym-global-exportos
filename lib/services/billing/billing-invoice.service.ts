/**
 * Author: Prem Singh
 * Purpose: Generates immutable GST invoice records from captured ROOTYM SaaS payments.
 */

import {
    BillingInvoiceStatus,
    BillingTaxType,
    PaymentStatus,
  } from "@/lib/generated/prisma";
  
  import prisma from "@/lib/prisma";
  
  import {
    getActiveBillingTaxConfiguration,
  } from "@/lib/services/billing/billing-tax-configuration.service";
  
  import {
    getBillingCustomerDetails,
  } from "@/lib/services/billing/billing-customer-details.service";
  
  const ROOTYM_REGISTERED_STATE = "MAHARASHTRA";
  
  interface InvoiceAmountBreakdown {
    taxableAmount: number;
    totalTaxAmount: number;
    totalAmount: number;
    taxRate: number;
    taxType: BillingTaxType;
    cgstRate: number;
    cgstAmount: number;
    sgstRate: number;
    sgstAmount: number;
    igstRate: number;
    igstAmount: number;
  }
  
  interface GenerateInvoiceInput {
    paymentId: string;
  }
  
  function normalizeState(value: string): string {
    return value
      .trim()
      .replace(/\s+/g, " ")
      .toUpperCase();
  }
  
  function roundCurrency(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  
  function calculateInclusiveTax(
    totalAmount: number,
    taxType: BillingTaxType,
    cgstRate: number,
    sgstRate: number,
    igstRate: number,
  ): InvoiceAmountBreakdown {
    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      throw new Error(
        "Invoice amount must be greater than zero.",
      );
    }
  
    const totalRate =
      taxType === BillingTaxType.IGST
        ? igstRate
        : taxType === BillingTaxType.CGST_SGST
          ? cgstRate + sgstRate
          : 0;
  
    if (totalRate <= 0) {
      return {
        taxableAmount: roundCurrency(totalAmount),
        totalTaxAmount: 0,
        totalAmount: roundCurrency(totalAmount),
        taxRate: 0,
        taxType: BillingTaxType.NONE,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        igstRate: 0,
        igstAmount: 0,
      };
    }
  
    const taxableAmount = roundCurrency(
      totalAmount / (1 + totalRate / 100),
    );
  
    const totalTaxAmount = roundCurrency(
      totalAmount - taxableAmount,
    );
  
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
  
    if (taxType === BillingTaxType.CGST_SGST) {
      cgstAmount = roundCurrency(
        (taxableAmount * cgstRate) / 100,
      );
  
      sgstAmount = roundCurrency(
        totalTaxAmount - cgstAmount,
      );
    }
  
    if (taxType === BillingTaxType.IGST) {
      igstAmount = roundCurrency(
        (taxableAmount * igstRate) / 100,
      );
    }
  
    return {
      taxableAmount,
      totalTaxAmount,
      totalAmount: roundCurrency(
        taxableAmount +
          cgstAmount +
          sgstAmount +
          igstAmount,
      ),
      taxRate: totalRate,
      taxType,
      cgstRate:
        taxType === BillingTaxType.CGST_SGST
          ? cgstRate
          : 0,
      cgstAmount,
      sgstRate:
        taxType === BillingTaxType.CGST_SGST
          ? sgstRate
          : 0,
      sgstAmount,
      igstRate:
        taxType === BillingTaxType.IGST
          ? igstRate
          : 0,
      igstAmount,
    };
  }
  
  function getTaxType(
    customerState: string,
    registeredState: string,
    gstEnabled: boolean,
    gstRegistered: boolean,
    cgstRate: number,
    sgstRate: number,
    igstRate: number,
  ): BillingTaxType {
    if (!gstEnabled || !gstRegistered) {
      return BillingTaxType.NONE;
    }
  
    if (
      normalizeState(customerState) ===
      normalizeState(registeredState)
    ) {
      if (cgstRate <= 0 || sgstRate <= 0) {
        throw new Error(
          "CGST and SGST rates must be configured for intra-state GST invoices.",
        );
      }
  
      return BillingTaxType.CGST_SGST;
    }
  
    if (igstRate <= 0) {
      throw new Error(
        "IGST rate must be configured for inter-state GST invoices.",
      );
    }
  
    return BillingTaxType.IGST;
  }
  
  function buildInvoiceNumber(
    prefix: string,
    sequence: number,
  ): string {
    return `${prefix}-${new Date().getFullYear()}-${String(
      sequence,
    ).padStart(6, "0")}`;
  }
  
  async function getNextInvoiceNumber(
    tx: Parameters<
      Parameters<typeof prisma.$transaction>[0]
    >[0],
    prefix: string,
    year: number,
  ): Promise<string> {
    const sequence = await tx.numberSequence.upsert({
      where: {
        type_year: {
          type: "INVOICE",
          year,
        },
      },
      create: {
        type: "INVOICE",
        year,
        lastValue: 1,
      },
      update: {
        lastValue: {
          increment: 1,
        },
      },
    });
  
    return buildInvoiceNumber(
      prefix,
      sequence.lastValue,
    );
  }
  
  export async function generateBillingInvoice(
    input: GenerateInvoiceInput,
  ) {
    const paymentId = input.paymentId.trim();
  
    if (!paymentId) {
      throw new Error("Payment ID is required.");
    }
  
    const payment = await prisma.payment.findUnique({
      where: {
        id: paymentId,
      },
      include: {
        invoice: true,
        subscription: {
          include: {
            plan: true,
          },
        },
        planChange: {
          include: {
            toPlan: true,
          },
        },
        tenant: true,
      },
    });
  
    if (!payment) {
      throw new Error("Payment not found.");
    }
  
    if (payment.status !== PaymentStatus.CAPTURED) {
      throw new Error(
        "Only captured payments can generate invoices.",
      );
    }
  
    if (!payment.paidAt) {
      throw new Error(
        "Captured payment does not have a payment date.",
      );
    }
  
    if (!payment.providerPaymentId) {
      throw new Error(
        "Captured payment does not have a provider payment ID.",
      );
    }
  
    if (payment.invoice) {
      return payment.invoice;
    }
  
    const billingDetails =
      await getBillingCustomerDetails(
        payment.tenantId,
      );
  
    if (!billingDetails) {
      throw new Error(
        "Billing customer details are required before an invoice can be generated.",
      );
    }
  
    const taxConfiguration =
      await getActiveBillingTaxConfiguration(
        payment.paidAt,
      );
  
    if (!taxConfiguration) {
      throw new Error(
        "No active billing tax configuration is available for the payment date.",
      );
    }
  
    if (
      taxConfiguration.gstEnabled &&
      !taxConfiguration.gstin
    ) {
      throw new Error(
        "ROOTYM GSTIN is not configured.",
      );
    }
  
    const registeredState =
      taxConfiguration.registeredState ??
      ROOTYM_REGISTERED_STATE;
  
    const cgstRate =
      Number(taxConfiguration.cgstRate);
    const sgstRate =
      Number(taxConfiguration.sgstRate);
    const igstRate =
      Number(taxConfiguration.igstRate);
  
    const taxType = getTaxType(
      billingDetails.state,
      registeredState,
      taxConfiguration.gstEnabled,
      billingDetails.gstRegistered,
      cgstRate,
      sgstRate,
      igstRate,
    );
  
    const amountInMinorUnits = payment.amount;
  
    if (
      !Number.isInteger(amountInMinorUnits) ||
      amountInMinorUnits <= 0
    ) {
      throw new Error(
        "Payment amount is invalid for invoice generation.",
      );
    }
  
    const totalAmount =
      amountInMinorUnits / 100;
  
    const breakdown = calculateInclusiveTax(
      totalAmount,
      taxType,
      cgstRate,
      sgstRate,
      igstRate,
    );
  
    const plan =
      payment.planChange?.toPlan ??
      payment.subscription?.plan ??
      null;
  
    const description =
      plan?.name ??
      "ROOTYM SaaS Subscription";
  
    const quantity = 1;
    const unit = "subscription";
    const unitPrice = roundCurrency(
      totalAmount,
    );
  
    const invoice = await prisma.$transaction(
      async (tx) => {
        const existingInvoice =
          await tx.billingInvoice.findUnique({
            where: {
              paymentId: payment.id,
            },
          });
  
        if (existingInvoice) {
          return existingInvoice;
        }
  
        const invoiceNumber =
          await getNextInvoiceNumber(
            tx,
            taxConfiguration.invoicePrefix,
            payment.paidAt!.getFullYear(),
          );
  
        return tx.billingInvoice.create({
          data: {
            tenantId: payment.tenantId,
            paymentId: payment.id,
            subscriptionId:
              payment.subscriptionId,
            planChangeId:
              payment.planChangeId,
            invoiceNumber,
            invoiceDate: payment.paidAt!,
            currency:
              payment.currency || "INR",
  
            customerName:
              billingDetails.customerName,
            customerEmail:
              billingDetails.email,
            customerMobile:
              billingDetails.mobile,
  
            billingAddressLine1:
              billingDetails.billingAddressLine1,
            billingAddressLine2:
              billingDetails.billingAddressLine2,
            billingCity:
              billingDetails.city,
            billingState:
              billingDetails.state,
            billingPostalCode:
              billingDetails.postalCode,
            billingCountry:
              billingDetails.country,
            customerGstin:
              billingDetails.gstin,
  
            taxType:
              breakdown.taxType,
            taxRate:
              breakdown.taxRate,
            taxableAmount:
              breakdown.taxableAmount,
            cgstRate:
              breakdown.cgstRate,
            cgstAmount:
              breakdown.cgstAmount,
            sgstRate:
              breakdown.sgstRate,
            sgstAmount:
              breakdown.sgstAmount,
            igstRate:
              breakdown.igstRate,
            igstAmount:
              breakdown.igstAmount,
            totalTaxAmount:
              breakdown.totalTaxAmount,
            totalAmount:
              breakdown.totalAmount,
  
            status:
              BillingInvoiceStatus.PENDING,
  
            provider:
              payment.provider,
            providerPaymentId:
              payment.providerPaymentId,
            providerInvoiceId:
              payment.providerInvoiceId,
  
            items: {
              create: {
                description,
                quantity,
                unit,
                unitPrice,
                taxableAmount:
                  breakdown.taxableAmount,
              },
            },
          },
        });
      },
    );
  
    return invoice;
  }
  
  export async function generatePendingInvoiceForPayment(
    paymentId: string,
  ) {
    return generateBillingInvoice({
      paymentId,
    });
  }
  