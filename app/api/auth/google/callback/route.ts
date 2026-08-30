/**
 * Author: Prem Singh
 * Purpose: Completes Google OAuth and establishes the ROOTYM SaaS customer session.
 */

import { jwtVerify } from "jose";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createCustomerWorkspace,
} from "@/lib/services/saas/trial.service";

import {
  CUSTOMER_AUTH_COOKIE_NAME,
  CUSTOMER_AUTH_COOKIE_OPTIONS,
  signCustomerToken,
} from "@/lib/auth/customer-jwt";

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

export async function GET(
  request: NextRequest
) {
  const code =
    request.nextUrl.searchParams.get(
      "code"
    );

  const state =
    request.nextUrl.searchParams.get(
      "state"
    );

  const storedState =
    request.cookies.get(
      STATE_COOKIE
    )?.value;

  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  const clientSecret =
    process.env.GOOGLE_CLIENT_SECRET;

  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI;

  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl.origin;

  if (
    !code ||
    !state ||
    !storedState
  ) {
    return NextResponse.redirect(
      `${appUrl}/login?error=oauth_state`
    );
  }

  try {
    /*
     * Verify the signed OAuth state.
     */
    const { payload } =
      await jwtVerify(
        storedState,
        secretKey
      );

    if (
      payload.state !== state
    ) {
      throw new Error(
        "OAuth state mismatch."
      );
    }

    if (
      !clientId ||
      !clientSecret ||
      !redirectUri
    ) {
      throw new Error(
        "Google OAuth is not configured."
      );
    }

    /*
     * Exchange authorization code
     * for Google access token.
     */
    const tokenResponse =
      await fetch(
        "https://oauth2.googleapis.com/token",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            new URLSearchParams({
              code,
              client_id: clientId,
              client_secret:
                clientSecret,
              redirect_uri:
                redirectUri,
              grant_type:
                "authorization_code",
            }),
          cache: "no-store",
        }
      );

    if (!tokenResponse.ok) {
      throw new Error(
        "Google token exchange failed."
      );
    }

    const tokenData =
      (await tokenResponse.json()) as {
        access_token?: string;
      };

    if (
      !tokenData.access_token
    ) {
      throw new Error(
        "Google access token missing."
      );
    }

    /*
     * Retrieve verified Google
     * profile information.
     */
    const profileResponse =
      await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        {
          headers: {
            Authorization:
              `Bearer ${tokenData.access_token}`,
          },
          cache: "no-store",
        }
      );

    if (!profileResponse.ok) {
      throw new Error(
        "Google profile lookup failed."
      );
    }

    const profile =
      (await profileResponse.json()) as {
        sub?: string;
        email?: string;
        email_verified?: boolean;
        name?: string;
        picture?: string;
      };

    if (
      !profile.sub ||
      !profile.email ||
      profile.email_verified === false
    ) {
      throw new Error(
        "Google account email could not be verified."
      );
    }

    /*
     * Resolve/create ROOTYM SaaS
     * customer + workspace + trial.
     */
    const workspace =
      await createCustomerWorkspace({
        email: profile.email,
        name:
          profile.name ||
          profile.email.split("@")[0],
        avatarUrl:
          profile.picture ?? null,
        provider: "google",
        providerAccountId:
          profile.sub,
        providerEmail:
          profile.email,
      });

    /*
     * Create the ROOTYM customer
     * session token.
     */
    const customerToken =
      await signCustomerToken({
        userId:
          workspace.user.id,
        tenantId:
          workspace.membership.tenantId,
        membershipId:
          workspace.membership.id,
      });

    const response =
      NextResponse.redirect(
        `${appUrl}/app`
      );

    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAME,
      customerToken,
      CUSTOMER_AUTH_COOKIE_OPTIONS
    );

    /*
     * Clear OAuth state cookie.
     */
    response.cookies.set(
      STATE_COOKIE,
      "",
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Google OAuth callback failed:",
      error
    );

    return NextResponse.redirect(
      `${appUrl}/login?error=oauth_failed`
    );
  }
}