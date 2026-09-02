/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Completes Google OAuth and establishes the ROOTYM
 *          SaaS customer session on the correct SaaS hostname.
 *
 * Local OAuth:
 *   localhost callback
 *     → customer/workspace resolution
 *     → short-lived signed handoff
 *     → app.export.localhost callback
 *     → customer session cookie
 *
 * Production OAuth:
 *   app.export.rootym.com callback
 *     → customer/workspace resolution
 *     → customer session cookie
 *
 * SaaS origins are centralized through:
 *   lib/config/urls.ts
 * ============================================================
 */

import { jwtVerify, SignJWT } from "jose";

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

import { SAAS_APP_URL } from "@/lib/config/urls";

const STATE_COOKIE =
  "rootym_google_oauth_state";

const LOCAL_OAUTH_HOST =
  "localhost:3000";

const LOCAL_OAUTH_ORIGIN =
  "http://localhost:3000";

const GOOGLE_TOKEN_ENDPOINT =
  "https://oauth2.googleapis.com/token";

const GOOGLE_USERINFO_ENDPOINT =
  "https://openidconnect.googleapis.com/v1/userinfo";

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
 * The public SaaS origin is centralized through:
 *
 *   NEXT_PUBLIC_SAAS_APP_URL
 *
 * Local:
 *   http://app.export.localhost:3000
 *
 * Production:
 *   https://app.export.rootym.com
 *
 * The localhost OAuth bootstrap remains separate because
 * Google OAuth uses localhost as the local redirect URI.
 * ============================================================
 */
function getSaaSOrigin(
  request: NextRequest,
) {
  const host =
    request.headers.get("host") ??
    "";

  const configuredUrl =
    new URL(SAAS_APP_URL);

  const configuredHostname =
    configuredUrl.hostname.toLowerCase();

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
      `Invalid SaaS OAuth callback host: ${host}`,
    );
  }

  if (
    configuredPort &&
    requestPort &&
    configuredPort !== requestPort
  ) {
    throw new Error(
      `Invalid SaaS OAuth callback port: ${host}`,
    );
  }

  return SAAS_APP_URL;
}

/**
 * ============================================================
 * Create the short-lived local OAuth handoff.
 * ============================================================
 *
 * The Google callback happens on localhost because Google does
 * not accept app.export.localhost as a redirect URI.
 *
 * The handoff carries only the ROOTYM customer identifiers
 * required to establish the SaaS session on the actual
 * configured SaaS hostname.
 *
 * It is deliberately short-lived.
 * ============================================================
 */
async function createLocalHandoff(
  returnOrigin: string,
  userId: string,
  tenantId: string,
  membershipId: string,
) {
  return new SignJWT({
    type:
      "customer_oauth_handoff",
    returnOrigin,
    userId,
    tenantId,
    membershipId,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("60s")
    .sign(secretKey);
}

/**
 * ============================================================
 * Complete a local handoff on the SaaS hostname.
 * ============================================================
 */
async function completeLocalHandoff(
  request: NextRequest,
) {
  const appOrigin =
    getSaaSOrigin(request);

  const handoff =
    request.nextUrl.searchParams.get(
      "handoff",
    );

  if (!handoff) {
    return null;
  }

  const { payload } =
    await jwtVerify(
      handoff,
      secretKey,
    );

  if (
    payload.type !==
      "customer_oauth_handoff" ||
    payload.returnOrigin !==
      appOrigin ||
    typeof payload.userId !==
      "string" ||
    typeof payload.tenantId !==
      "string" ||
    typeof payload.membershipId !==
      "string"
  ) {
    throw new Error(
      "Invalid OAuth handoff.",
    );
  }

  const customerToken =
    await signCustomerToken({
      userId:
        payload.userId,
      tenantId:
        payload.tenantId,
      membershipId:
        payload.membershipId,
    });

  const response =
    NextResponse.redirect(
      `${appOrigin}/`,
    );

  response.cookies.set(
    CUSTOMER_AUTH_COOKIE_NAME,
    customerToken,
    CUSTOMER_AUTH_COOKIE_OPTIONS,
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
     * LOCAL HANDOFF COMPLETION
     * ========================================================
     *
     * The localhost callback redirects here after the Google
     * profile has been resolved and the customer workspace has
     * been created.
     *
     * This request is now on the configured SaaS hostname,
     * allowing the final customer session cookie to be created
     * on the SaaS hostname.
     * ========================================================
     */

    const configuredSaaSUrl =
      new URL(SAAS_APP_URL);

    const configuredSaaSHost =
      configuredSaaSUrl.host;

    if (
      host ===
        configuredSaaSHost ||
      host ===
        configuredSaaSUrl.hostname
    ) {
      const handoffResponse =
        await completeLocalHandoff(
          request,
        );

      if (handoffResponse) {
        return handoffResponse;
      }
    }

    /**
     * ========================================================
     * Determine callback mode.
     * ========================================================
     *
     * Local development:
     *
     *   localhost:3000
     *
     * Production:
     *
     *   configured SaaS hostname
     * ========================================================
     */

    const isLocalCallback =
      host === LOCAL_OAUTH_HOST;

    const appOrigin =
      isLocalCallback
        ? SAAS_APP_URL
        : getSaaSOrigin(request);

    const redirectUri =
      isLocalCallback
        ? `${LOCAL_OAUTH_ORIGIN}/api/auth/google/callback`
        : `${appOrigin}/api/auth/google/callback`;

    /**
     * ========================================================
     * Read Google OAuth response.
     * ========================================================
     */

    const code =
      request.nextUrl.searchParams.get(
        "code",
      );

    const state =
      request.nextUrl.searchParams.get(
        "state",
      );

    const storedState =
      request.cookies.get(
        STATE_COOKIE,
      )?.value;

    const clientId =
      process.env.GOOGLE_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_CLIENT_SECRET;

    if (
      !code ||
      !state ||
      !storedState
    ) {
      return NextResponse.redirect(
        `${appOrigin}/login?error=oauth_state`,
      );
    }

    /**
     * ========================================================
     * Verify signed OAuth state.
     * ========================================================
     */

    const { payload } =
      await jwtVerify(
        storedState,
        secretKey,
      );

    if (
      payload.state !== state
    ) {
      throw new Error(
        "OAuth state mismatch.",
      );
    }

    /**
     * ========================================================
     * Validate the expected return origin.
     * ========================================================
     */

    const stateReturnOrigin =
      payload.returnOrigin;

    if (
      typeof stateReturnOrigin !==
        "string" ||
      stateReturnOrigin !==
        appOrigin
    ) {
      throw new Error(
        "Invalid OAuth return origin.",
      );
    }

    if (
      !clientId ||
      !clientSecret
    ) {
      throw new Error(
        "Google OAuth is not configured.",
      );
    }

    /**
     * ========================================================
     * Exchange authorization code for Google access token.
     * ========================================================
     */

    const tokenResponse =
      await fetch(
        GOOGLE_TOKEN_ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
          },
          body:
            new URLSearchParams({
              code,
              client_id:
                clientId,
              client_secret:
                clientSecret,
              redirect_uri:
                redirectUri,
              grant_type:
                "authorization_code",
            }),
          cache: "no-store",
        },
      );

    if (!tokenResponse.ok) {
      throw new Error(
        "Google token exchange failed.",
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
        "Google access token missing.",
      );
    }

    /**
     * ========================================================
     * Retrieve verified Google profile.
     * ========================================================
     */

    const profileResponse =
      await fetch(
        GOOGLE_USERINFO_ENDPOINT,
        {
          headers: {
            Authorization:
              `Bearer ${tokenData.access_token}`,
          },
          cache: "no-store",
        },
      );

    if (!profileResponse.ok) {
      throw new Error(
        "Google profile lookup failed.",
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
        "Google account email could not be verified.",
      );
    }

    /**
     * ========================================================
     * Resolve/create ROOTYM SaaS customer, workspace and trial.
     * ========================================================
     */

    const workspace =
      await createCustomerWorkspace({
        email:
          profile.email,
        name:
          profile.name ||
          profile.email.split("@")[0],
        avatarUrl:
          profile.picture ?? null,
        provider:
          "google",
        providerAccountId:
          profile.sub,
        providerEmail:
          profile.email,
      });

    /**
     * ========================================================
     * LOCAL DEVELOPMENT HANDOFF
     * ========================================================
     *
     * Google returned to localhost, so the final SaaS
     * customer cookie cannot be established on the SaaS
     * hostname from this response.
     *
     * Create a short-lived signed handoff and return to the
     * deterministic configured SaaS hostname.
     * ========================================================
     */

    if (isLocalCallback) {
      const handoff =
        await createLocalHandoff(
          appOrigin,
          workspace.user.id,
          workspace.membership.tenantId,
          workspace.membership.id,
        );

      const response =
        NextResponse.redirect(
          `${appOrigin}/api/auth/google/callback?handoff=${encodeURIComponent(
            handoff,
          )}`,
        );

      /**
       * Clear the localhost OAuth state cookie.
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
        },
      );

      return response;
    }

    /**
     * ========================================================
     * PRODUCTION / CONFIGURED SAAS CUSTOMER SESSION
     * ========================================================
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
        `${appOrigin}/`,
      );

    response.cookies.set(
      CUSTOMER_AUTH_COOKIE_NAME,
      customerToken,
      CUSTOMER_AUTH_COOKIE_OPTIONS,
    );

    /**
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
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Google OAuth callback failed:",
      error,
    );

    /**
     * ========================================================
     * Safe error destination
     * ========================================================
     *
     * Prefer the configured SaaS URL rather than maintaining
     * a separate production hostname constant.
     *
     * During localhost OAuth, the browser has not yet reached
     * the SaaS hostname, so the configured SaaS URL remains the
     * intended customer-facing destination.
     * ========================================================
     */

    let errorOrigin =
      SAAS_APP_URL;

    try {
      const host =
        request.headers.get("host") ??
        "";

      const configuredSaaSUrl =
        new URL(SAAS_APP_URL);

      const configuredSaaSHost =
        configuredSaaSUrl.host;

      if (
        host ===
          configuredSaaSHost ||
        host ===
          configuredSaaSUrl.hostname
      ) {
        errorOrigin =
          getSaaSOrigin(request);
      }
    } catch {
      /**
       * Keep the configured SaaS URL as the safe fallback.
       */
    }

    return NextResponse.redirect(
      `${errorOrigin}/login?error=oauth_failed`,
    );
  }
}