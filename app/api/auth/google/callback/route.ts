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

const STATE_COOKIE =
  "rootym_google_oauth_state";

const LOCAL_OAUTH_HOST =
  "localhost:3000";

const LOCAL_SAAS_ORIGIN =
  "http://app.export.localhost:3000";

const PRODUCTION_SAAS_ORIGIN =
  "https://app.export.rootym.com";

const GOOGLE_TOKEN_ENDPOINT =
  "https://oauth2.googleapis.com/token";

const GOOGLE_USERINFO_ENDPOINT =
  "https://openidconnect.googleapis.com/v1/userinfo";

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
 * Validate SaaS callback origin.
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
    `Invalid SaaS OAuth callback host: ${host}`
  );
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
 * app.export.localhost host.
 *
 * It is deliberately short-lived.
 * ============================================================
 */
async function createLocalHandoff(
  returnOrigin: string,
  userId: string,
  tenantId: string,
  membershipId: string
) {
  return new SignJWT({
    type: "customer_oauth_handoff",
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
  request: NextRequest
) {
  const appOrigin =
    getSaaSOrigin(request);

  const handoff =
    request.nextUrl.searchParams.get(
      "handoff"
    );

  if (!handoff) {
    return null;
  }

  const { payload } =
    await jwtVerify(
      handoff,
      secretKey
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
      "Invalid OAuth handoff."
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
      `${appOrigin}/`
    );

  response.cookies.set(
    CUSTOMER_AUTH_COOKIE_NAME,
    customerToken,
    CUSTOMER_AUTH_COOKIE_OPTIONS
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
     * LOCAL HANDOFF COMPLETION
     * ========================================================
     *
     * The localhost callback redirects here after the Google
     * profile has been resolved and the customer workspace has
     * been created.
     *
     * This request is now on app.export.localhost, allowing the
     * final customer session cookie to be created on the SaaS
     * hostname.
     * ========================================================
     */

    if (
      host ===
        "app.export.localhost:3000" ||
      host ===
        "app.export.localhost"
    ) {
      const handoffResponse =
        await completeLocalHandoff(
          request
        );

      if (handoffResponse) {
        return handoffResponse;
      }
    }

    /*
     * ========================================================
     * Determine callback mode.
     * ========================================================
     */

    const isLocalCallback =
      host === LOCAL_OAUTH_HOST;

    const appOrigin =
      isLocalCallback
        ? LOCAL_SAAS_ORIGIN
        : getSaaSOrigin(request);

    const redirectUri =
      isLocalCallback
        ? `http://${LOCAL_OAUTH_HOST}/api/auth/google/callback`
        : `${appOrigin}/api/auth/google/callback`;

    /*
     * ========================================================
     * Read Google OAuth response.
     * ========================================================
     */

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

    if (
      !code ||
      !state ||
      !storedState
    ) {
      return NextResponse.redirect(
        `${appOrigin}/login?error=oauth_state`
      );
    }

    /*
     * ========================================================
     * Verify signed OAuth state.
     * ========================================================
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

    /*
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
        "Invalid OAuth return origin."
      );
    }

    if (
      !clientId ||
      !clientSecret
    ) {
      throw new Error(
        "Google OAuth is not configured."
      );
    }

    /*
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

    /*
     * ========================================================
     * LOCAL DEVELOPMENT HANDOFF
     * ========================================================
     *
     * Google returned to localhost, so the final SaaS
     * customer cookie cannot be established on
     * app.export.localhost from this response.
     *
     * Create a short-lived signed handoff and return to the
     * deterministic SaaS hostname.
     * ========================================================
     */

    if (isLocalCallback) {
      const handoff =
        await createLocalHandoff(
          appOrigin,
          workspace.user.id,
          workspace.membership.tenantId,
          workspace.membership.id
        );

      const response =
        NextResponse.redirect(
          `${appOrigin}/api/auth/google/callback?handoff=${encodeURIComponent(
            handoff
          )}`
        );

      /*
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
        }
      );

      return response;
    }

    /*
     * ========================================================
     * PRODUCTION CUSTOMER SESSION
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
        `${appOrigin}/`
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

    let errorOrigin =
      LOCAL_SAAS_ORIGIN;

    try {
      const host =
        request.headers.get("host") ??
        "";

      if (
        host ===
          "app.export.localhost:3000" ||
        host ===
          "app.export.localhost"
      ) {
        errorOrigin =
          getSaaSOrigin(request);
      } else if (
        host ===
        "app.export.rootym.com"
      ) {
        errorOrigin =
          getSaaSOrigin(request);
      }
    } catch {
      /*
       * Keep the safe local SaaS fallback.
       */
    }

    return NextResponse.redirect(
      `${errorOrigin}/login?error=oauth_failed`
    );
  }
}