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
 *
 * SaaS origins are centralized through:
 *   lib/config/urls.ts
 * ============================================================
 */

import { randomBytes } from "node:crypto";
import { SignJWT } from "jose";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { SAAS_APP_URL } from "@/lib/config/urls";

const STATE_COOKIE = "rootym_google_oauth_state";

const LOCAL_OAUTH_HOST = "localhost:3000";

const LOCAL_OAUTH_ORIGIN =
  "http://localhost:3000";

const GOOGLE_AUTHORIZATION_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";

const secret =
  process.env.CUSTOMER_JWT_SECRET;

if (!secret) {
  throw new Error(
    "CUSTOMER_JWT_SECRET is not defined.",
  );
}

const secretKey =
  new TextEncoder().encode(secret);

/**
 * ============================================================
 * Resolve the configured SaaS origin.
 * ============================================================
 *
 * The public SaaS destination is controlled by:
 *
 *   NEXT_PUBLIC_SAAS_APP_URL
 *
 * Local:
 *   http://app.export.localhost:3000
 *
 * Production:
 *   https://app.export.rootym.com
 *
 * The configured value is also used by the production OAuth
 * flow so the SaaS hostname is not duplicated in this route.
 * ============================================================
 */
function getConfiguredSaaSOrigin() {
  return SAAS_APP_URL;
}

/**
 * ============================================================
 * Validate a SaaS origin.
 * ============================================================
 *
 * Only the configured SaaS origin is accepted for the normal
 * SaaS OAuth flow.
 *
 * The localhost OAuth bootstrap remains a separate, explicit
 * exception because Google OAuth redirects to localhost during
 * local development.
 * ============================================================
 */
function isConfiguredSaaSOrigin(
  origin: string,
) {
  return (
    origin ===
    getConfiguredSaaSOrigin()
  );
}

/**
 * ============================================================
 * Resolve the current SaaS origin.
 * ============================================================
 *
 * For the normal SaaS request, the browser must already be
 * using the configured SaaS hostname.
 *
 * During local development:
 *
 *   app.export.localhost:3000
 *
 * is represented by SAAS_APP_URL.
 *
 * Production:
 *
 *   app.export.rootym.com
 *
 * is represented by SAAS_APP_URL.
 * ============================================================
 */
function getSaaSOrigin(
  request: NextRequest,
) {
  const host =
    request.headers.get("host") ??
    "";

  const configuredOrigin =
    getConfiguredSaaSOrigin();

  const configuredUrl =
    new URL(configuredOrigin);

  const configuredHostname =
    configuredUrl.hostname;

  const configuredPort =
    configuredUrl.port;

  const requestHostname =
    host.split(":")[0].toLowerCase();

  const requestPort =
    host.includes(":")
      ? host.split(":")[1]
      : "";

  if (
    requestHostname !==
    configuredHostname
  ) {
    throw new Error(
      `Invalid SaaS OAuth host: ${host}`,
    );
  }

  /**
   * ==========================================================
   * Local configured SaaS host
   * ==========================================================
   *
   * When the configured URL explicitly uses port 3000,
   * accept the development request with that port.
   * ==========================================================
   */
  if (
    configuredPort &&
    requestPort &&
    configuredPort !== requestPort
  ) {
    throw new Error(
      `Invalid SaaS OAuth port: ${host}`,
    );
  }

  return configuredOrigin;
}

/**
 * ============================================================
 * Build the Google authorization URL.
 * ============================================================
 */
async function createAuthorizationResponse(
  request: NextRequest,
  redirectUri: string,
  returnOrigin: string,
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
      },
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
      GOOGLE_AUTHORIZATION_ENDPOINT,
    );

  googleUrl.searchParams.set(
    "client_id",
    clientId,
  );

  googleUrl.searchParams.set(
    "redirect_uri",
    redirectUri,
  );

  googleUrl.searchParams.set(
    "response_type",
    "code",
  );

  googleUrl.searchParams.set(
    "scope",
    "openid email profile",
  );

  googleUrl.searchParams.set(
    "state",
    state,
  );

  googleUrl.searchParams.set(
    "access_type",
    "online",
  );

  const response =
    NextResponse.redirect(
      googleUrl,
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
    },
  );

  return response;
}

export async function GET(
  request: NextRequest,
) {
  try {
    const host =
      request.headers.get("host") ??
      "";

    /**
     * ========================================================
     * LOCAL DEVELOPMENT
     * ========================================================
     *
     * Google accepts localhost as a local OAuth redirect URI,
     * but does not use app.export.localhost as the callback
     * destination.
     *
     * Therefore the browser is temporarily moved to:
     *
     *   http://localhost:3000/api/auth/google
     *
     * The signed state records the configured SaaS origin so
     * the callback can safely return to the SaaS application.
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
          `http://${LOCAL_OAUTH_HOST}/api/auth/google`,
        );

      bootstrapUrl.searchParams.set(
        "local",
        "1",
      );

      bootstrapUrl.searchParams.set(
        "return_origin",
        appOrigin,
      );

      return NextResponse.redirect(
        bootstrapUrl,
      );
    }

    /**
     * ========================================================
     * LOCALHOST OAUTH BOOTSTRAP
     * ========================================================
     *
     * This request is generated only by the local SaaS
     * hostname above.
     *
     * The OAuth state cookie is created on localhost because
     * Google's callback will also arrive on localhost.
     * ========================================================
     */
    if (
      host === LOCAL_OAUTH_HOST &&
      request.nextUrl.searchParams.get(
        "local",
      ) === "1"
    ) {
      const returnOrigin =
        request.nextUrl.searchParams.get(
          "return_origin",
        );

      if (
        !returnOrigin ||
        !isConfiguredSaaSOrigin(
          returnOrigin,
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid local SaaS OAuth origin.",
          },
          {
            status: 400,
          },
        );
      }

      return createAuthorizationResponse(
        request,
        `${LOCAL_OAUTH_ORIGIN}/api/auth/google/callback`,
        returnOrigin,
      );
    }

    /**
     * ========================================================
     * PRODUCTION / CONFIGURED SAAS HOST
     * ========================================================
     *
     * The normal SaaS OAuth flow uses the configured SaaS
     * application origin directly.
     *
     * This removes the production hostname from this route.
     * ========================================================
     */
    const appOrigin =
      getSaaSOrigin(request);

    return createAuthorizationResponse(
      request,
      `${appOrigin}/api/auth/google/callback`,
      appOrigin,
    );
  } catch (error) {
    console.error(
      "Google OAuth start failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to start Google OAuth.",
      },
      {
        status: 500,
      },
    );
  }
}