/**
 * Author: Prem Singh
 * Purpose: Provides authenticated tenant-scoped billing customer details for SaaS checkout.
 */

import { NextRequest, NextResponse } from "next/server";

import { getCustomerSession } from "@/lib/auth/customer";
import {
  getBillingCustomerDetails,
  saveBillingCustomerDetails,
  type BillingCustomerDetailsInput,
} from "@/lib/services/billing/billing-customer-details.service";

export async function GET(request: NextRequest) {
  try {
    const session = await getCustomerSession(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    const details =
      await getBillingCustomerDetails(
        session.tenant.id,
      );

    return NextResponse.json({
      success: true,
      data: details,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Billing details could not be loaded.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getCustomerSession(request);

    if (!session) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer authentication required.",
        },
        { status: 401 },
      );
    }

    const body = (await request.json()) as Partial<
      BillingCustomerDetailsInput
    >;

    const billingDetails: BillingCustomerDetailsInput = {
      customerName:
        typeof body.customerName === "string"
          ? body.customerName
          : "",
      mobile:
        typeof body.mobile === "string"
          ? body.mobile
          : "",
      email:
        typeof body.email === "string"
          ? body.email
          : "",
      billingAddressLine1:
        typeof body.billingAddressLine1 === "string"
          ? body.billingAddressLine1
          : "",
      billingAddressLine2:
        typeof body.billingAddressLine2 === "string"
          ? body.billingAddressLine2
          : null,
      city:
        typeof body.city === "string"
          ? body.city
          : "",
      state:
        typeof body.state === "string"
          ? body.state
          : "",
      postalCode:
        typeof body.postalCode === "string"
          ? body.postalCode
          : "",
      country:
        typeof body.country === "string"
          ? body.country
          : "",
      gstRegistered:
        body.gstRegistered === true,
      gstin:
        typeof body.gstin === "string"
          ? body.gstin
          : null,
    };

    const details =
      await saveBillingCustomerDetails(
        session.tenant.id,
        billingDetails,
      );

    return NextResponse.json({
      success: true,
      data: details,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Billing details could not be saved.";

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: 400 },
    );
  }
}
