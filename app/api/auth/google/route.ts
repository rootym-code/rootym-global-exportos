/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Starts the Google OAuth flow for ROOTYM SaaS
 *          customers while supporting the deterministic
 *          SaaS hostname architecture.
 *
 * Local OAuth:
 *   app.export.localhost
 *     → localhost OAuth bootstrap
 *     → Google
 *     → localhost callback
 *
 * Production OAuth:
 *   app.export.rootym.com
 *     → Google
 *     → app.export.rootym.com callback
 * ============================================================
 */

import { randomBytes } from "node:crypto";

import { SignJWT } from "jose";

import {
  NextRequest,
  NextResponse,
} from "next/server";

const STATE_COOKIE =
  "rootym_google_oauth_state";

const LOCAL_OAUTH_HOST =
  "localhost:3000";

const LOCAL_SAAS_ORIGIN =
  "http://app.export.localhost:3000";

const PRODUCTION_SAAS_ORIGIN =
  "https://app.export.rootym.com";

const GOOGLE_AUTHORIZATION_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";

const secret =
  process.env.CUSTOMER_JWT_SECRET;

if (!secret) {
  throw new Error(
    "CUSTOMER_JWT_SECRET is not defined."
  );
}

const secretKey =
  new TextEncoder().encode(secret);

/**
 * ============================================================
 * Resolve the current SaaS origin.
 * ============================================================
 *
 * Only the two deterministic SaaS hosts are accepted here.
 * The marketing hosts must never initiate the customer OAuth
 * flow.
 * ============================================================
 */
function getSaaSOrigin(
  request: NextRequest
) {
  const host =
    request.headers.get("host") ??
    "";

  if (
    host ===
    "app.export.localhost:3000"
  ) {
    return LOCAL_SAAS_ORIGIN;
  }

  if (
    host ===
    "app.export.localhost"
  ) {
    return "http://app.export.localhost";
  }

  if (
    host ===
    "app.export.rootym.com"
  ) {
    return PRODUCTION_SAAS_ORIGIN;
  }

  throw new Error(
    `Invalid SaaS OAuth host: ${host}`
  );
}

/**
 * ============================================================
 * Build the Google authorization URL.
 * ============================================================
 */
async function createAuthorizationResponse(
  request: NextRequest,
  redirectUri: string,
  returnOrigin: string
) {
  const clientId =
    process.env.GOOGLE_CLIENT_ID;

  if (!clientId) {
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
      returnOrigin,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("10m")
      .sign(secretKey);

  const googleUrl =
    new URL(
      GOOGLE_AUTHORIZATION_ENDPOINT
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

export async function GET(
  request: NextRequest
) {
  try {
    const host =
      request.headers.get("host") ??
      "";

    /*
     * ========================================================
     * LOCAL DEVELOPMENT
     * ========================================================
     *
     * Google accepts localhost as a local OAuth redirect
     * URI, but rejects app.export.localhost.
     *
     * Therefore the browser is temporarily moved to the
     * localhost OAuth endpoint. The signed state records the
     * intended SaaS origin so the callback can safely return
     * to app.export.localhost.
     * ========================================================
     */

    if (
      host ===
        "app.export.localhost:3000" ||
      host ===
        "app.export.localhost"
    ) {
      const appOrigin =
        getSaaSOrigin(request);

      const bootstrapUrl =
        new URL(
          `http://${LOCAL_OAUTH_HOST}/api/auth/google`
        );

      bootstrapUrl.searchParams.set(
        "local",
        "1"
      );

      bootstrapUrl.searchParams.set(
        "return_origin",
        appOrigin
      );

      return NextResponse.redirect(
        bootstrapUrl
      );
    }

    /*
     * ========================================================
     * LOCALHOST OAUTH BOOTSTRAP
     * ========================================================
     *
     * This request is generated only by the SaaS hostname
     * above. The return origin is therefore restricted to the
     * known local SaaS origin.
     *
     * The OAuth state cookie is created on localhost because
     * Google's callback will also arrive on localhost.
     * ========================================================
     */

    if (
      host === LOCAL_OAUTH_HOST &&
      request.nextUrl.searchParams.get(
        "local"
      ) === "1"
    ) {
      const returnOrigin =
        request.nextUrl.searchParams.get(
          "return_origin"
        );

      if (
        returnOrigin !==
        LOCAL_SAAS_ORIGIN
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid local SaaS OAuth origin.",
          },
          {
            status: 400,
          }
        );
      }

      return createAuthorizationResponse(
        request,
        `http://${LOCAL_OAUTH_HOST}/api/auth/google/callback`,
        returnOrigin
      );
    }

    /*
     * ========================================================
     * PRODUCTION
     * ========================================================
     *
     * Production uses the actual SaaS hostname directly.
     * ========================================================
     */

    if (
      host ===
      "app.export.rootym.com"
    ) {
      const appOrigin =
        getSaaSOrigin(request);

      return createAuthorizationResponse(
        request,
        `${appOrigin}/api/auth/google/callback`,
        appOrigin
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Google OAuth is available only from the ROOTYM SaaS host.",
      },
      {
        status: 400,
      }
    );
  } catch (error) {
    console.error(
      "Google OAuth start failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to start Google OAuth.",
      },
      {
        status: 500,
      }
    );
  }
}