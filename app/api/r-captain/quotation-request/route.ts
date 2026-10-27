
import { NextRequest, NextResponse } from "next/server";

import {
  resolveRCaptainContext,
} from "@/lib/services/rcaptain/context.service";

import {
  InquiryCreationService,
  type RCaptainQuotationProduct,
} from "@/lib/services/rcaptain/inquiry-creation.service";

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function requiredString(
  value: unknown,
  maxLength: number,
): string | null {
  if (
    typeof value !== "string" ||
    !value.trim() ||
    value.trim().length > maxLength
  ) {
    return null;
  }

  return value.trim();
}

function optionalString(
  value: unknown,
  maxLength: number,
): string | undefined | null {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (
    typeof value !== "string" ||
    value.trim().length > maxLength
  ) {
    return null;
  }

  return value.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid request body is required.",
        },
        { status: 400 },
      );
    }

    const submissionKey = requiredString(
      body.submissionKey,
      200,
    );

    const websiteSlug = optionalString(
      body.websiteSlug,
      200,
    );

    const companyName = requiredString(
      body.companyName,
      150,
    );

    const contactPerson = requiredString(
      body.contactPerson,
      100,
    );

    const email = requiredString(
      body.email,
      255,
    );

    const phone = optionalString(
      body.phone,
      30,
    );

    const country = requiredString(
      body.country,
      100,
    );

    const message = optionalString(
      body.message,
      5000,
    );

    if (
      !submissionKey ||
      websiteSlug === null ||
      !companyName ||
      !contactPerson ||
      !email ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      phone === null ||
      !country ||
      message === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please provide valid buyer contact details and a submission key.",
        },
        { status: 400 },
      );
    }

    const selectedProductsInput = body.selectedProducts;

    if (
      !Array.isArray(selectedProductsInput) ||
      selectedProductsInput.length < 1 ||
      selectedProductsInput.length > 10
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Select between 1 and 10 products.",
        },
        { status: 400 },
      );
    }

    const selectedProducts: RCaptainQuotationProduct[] = [];

    for (const item of selectedProductsInput) {
      if (!isRecord(item)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid product selection.",
          },
          { status: 400 },
        );
      }

      const productId = requiredString(
        item.productId,
        100,
      );

      const quantity = optionalString(
        item.quantity,
        50,
      );

      const unit = optionalString(
        item.unit,
        50,
      );

      if (
        !productId ||
        quantity === null ||
        unit === null
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Each selected product must have a valid ID, quantity, and unit.",
          },
          { status: 400 },
        );
      }

      selectedProducts.push({
        productId,
        ...(quantity !== undefined
          ? { quantity }
          : {}),
        ...(unit !== undefined
          ? { unit }
          : {}),
      });
    }

    const productIds = selectedProducts.map(
      (product) => product.productId,
    );

    if (new Set(productIds).size !== productIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Duplicate product selections are not allowed.",
        },
        { status: 400 },
      );
    }

    const hostname =
      request.headers
        .get("host")
        ?.split(":")[0]
        .trim()
        .toLowerCase() || undefined;

    const context = await resolveRCaptainContext({
      mode: "BUYER",
      websiteSlug: websiteSlug || undefined,
      websiteHostname: websiteSlug
        ? undefined
        : hostname,
    });

    if (!context.website) {
      return NextResponse.json(
        {
          success: false,
          message: "Website context could not be resolved.",
        },
        { status: 400 },
      );
    }

    const inquiryService = new InquiryCreationService();

    const inquiry =
      await inquiryService.createQuotationRequest(
        {
          companyName,
          contactPerson,
          email,
          phone: phone || undefined,
          country,
          message:
            message ||
            "Buyer quotation request submitted through R-CAPTAIN.",
          product: selectedProducts
            .map((item) => item.productId)
            .join(", "),
        },
        context.website.id,
        submissionKey,
        selectedProducts,
      );

    return NextResponse.json(
      {
        success: true,
        message:
          "Your quotation request has been received.",
        inquiry: {
          id: inquiry.id,
          inquiryNumber: inquiry.inquiryNumber,
        },
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          message: "The request body must contain valid JSON.",
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
        const clientErrors = [
            "Website context is required.",
            "A valid submission key is required.",
            "Select between 1 and 10 products.",
            "Product selections must have valid, unique IDs.",
            "Company, contact person, email, and country are required.",
            "Active Website context is required.",
            "One or more selected products are unavailable for this website.",
            "This submission key has already been used for a different request.",
          ];

      if (clientErrors.includes(error.message)) {
        return NextResponse.json(
          {
            success: false,
            message: error.message,
          },
          { status: 400 },
        );
      }
    }

    console.error(
      "R-CAPTAIN quotation-request API error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to submit your quotation request. Please try again.",
      },
      { status: 500 },
    );
  }
}
