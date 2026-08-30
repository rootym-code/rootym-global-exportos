/**
 * Author: Prem Singh
 * Purpose: Starts the Google OAuth flow for ROOTYM SaaS customers.
 */

import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const STATE_COOKIE =
  "rootym_google_oauth_state";

const secret =
  process.env.CUSTOMER_JWT_SECRET;

if (!secret) {
  throw new Error(
    "CUSTOMER_JWT_SECRET is not defined."
  );
}

const secretKey =
  new TextEncoder().encode(secret);

export async function GET() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Google OAuth is not configured.",
      },
      {
        status: 500,
      }
    );
  }

  const state =
    randomBytes(32).toString("hex");

  const signedState =
    await new SignJWT({
      state,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(secretKey);

  const googleUrl =
    new URL(
      "https://accounts.google.com/o/oauth2/v2/auth"
    );

  googleUrl.searchParams.set(
    "client_id",
    clientId
  );

  googleUrl.searchParams.set(
    "redirect_uri",
    redirectUri
  );

  googleUrl.searchParams.set(
    "response_type",
    "code"
  );

  googleUrl.searchParams.set(
    "scope",
    "openid email profile"
  );

  googleUrl.searchParams.set(
    "state",
    state
  );

  googleUrl.searchParams.set(
    "access_type",
    "online"
  );

  const response =
    NextResponse.redirect(
      googleUrl
    );

  response.cookies.set(
    STATE_COOKIE,
    signedState,
    {
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10,
    }
  );

  return response;
}