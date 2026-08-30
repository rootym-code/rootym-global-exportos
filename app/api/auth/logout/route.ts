/**
 * Author: Prem Singh
 * Purpose: Clears the ROOTYM SaaS customer session.
 */

import { NextResponse } from "next/server";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  CUSTOMER_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth/customer-jwt";

export async function POST() {
  const response =
    NextResponse.json({
      success: true,
    });

  response.cookies.set(
    CUSTOMER_AUTH_COOKIE_NAME,
    "",
    {
      ...CUSTOMER_AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    }
  );

  return response;
}