/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Completes Google OAuth and establishes the ROOTYM
 *          SaaS customer session on the correct SaaS hostname,
 *          including invitation-aware workspace membership.
 * ============================================================
 */

import { jwtVerify, SignJWT } from "jose";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createCustomerWorkspace,
  resolveCustomerIdentity,
} from "@/lib/services/saas/trial.service";

import {
  acceptWorkspaceInvitationById,
  getWorkspaceInvitationById,
} from "@/app/lib/workspace/business/workspace-invitation-acceptance.service";

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

/**
 * ============================================================
 * Clear the OAuth state cookie.
 * ============================================================
 */
function clearOAuthStateCookie(
  response: NextResponse,
) {
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
}

/**
 * ============================================================
 * Google OAuth callback.
 * ============================================================
 */
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
     */
    const configuredSaaSUrl =
      new URL(SAAS_APP_URL);

    const configuredSaaSHost =
      configuredSaaSUrl.host;

    if (
      host === configuredSaaSHost ||
      host === configuredSaaSUrl.hostname
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

    /**
     * ========================================================
     * Resolve optional invitation context.
     * ========================================================
     *
     * Invitation OAuth state contains only the authoritative
     * invitation ID. No raw bearer token, tenant ID or role is
     * trusted from the browser.
     * ========================================================
     */
    const invitationId =
      payload.type ===
        "customer_invitation_oauth" &&
      typeof payload.invitationId ===
        "string"
        ? payload.invitationId
        : null;

    if (
      payload.type ===
        "customer_invitation_oauth" &&
      !invitationId
    ) {
      throw new Error(
        "Invalid invitation OAuth state.",
      );
    }

    if (
      invitationId
    ) {
      await getWorkspaceInvitationById(
        invitationId,
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
     * INVITATION GOOGLE LOGIN
     * ========================================================
     *
     * The invitation determines the destination workspace.
     * The normal first-login workspace creation path is
     * deliberately bypassed.
     * ========================================================
     */
    if (invitationId) {
      const invitation =
        await getWorkspaceInvitationById(
          invitationId,
        );

      const invitationEmail =
        invitation.email
          .trim()
          .toLowerCase();

      const googleEmail =
        profile.email
          .trim()
          .toLowerCase();

      if (
        invitationEmail !==
        googleEmail
      ) {
        throw new Error(
          "The authenticated email address does not match the invitation.",
        );
      }

      const identity =
        await resolveCustomerIdentity({
          email:
            profile.email,
          name:
            profile.name ||
            profile.email.split("@")[0],
          avatarUrl:
            profile.picture ??
            null,
          provider:
            "google",
          providerAccountId:
            profile.sub,
          providerEmail:
            profile.email,
        });

      const result =
        await acceptWorkspaceInvitationById(
          invitationId,
          identity.user.id,
        );

      /**
       * ======================================================
       * LOCAL DEVELOPMENT HANDOFF
       * ======================================================
       */
      if (isLocalCallback) {
        const handoff =
          await createLocalHandoff(
            appOrigin,
            result.userId,
            result.tenantId,
            result.membershipId,
          );

        const response =
          NextResponse.redirect(
            `${appOrigin}/api/auth/google/callback?handoff=${encodeURIComponent(
              handoff,
            )}`,
          );

        clearOAuthStateCookie(
          response,
        );

        return response;
      }

      /**
       * ======================================================
       * PRODUCTION / CONFIGURED SAAS CUSTOMER SESSION
       * ======================================================
       */
      const customerToken =
        await signCustomerToken({
          userId:
            result.userId,
          tenantId:
            result.tenantId,
          membershipId:
            result.membershipId,
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

      clearOAuthStateCookie(
        response,
      );

      return response;
    }

    /**
     * ========================================================
     * NORMAL GOOGLE LOGIN
     * ========================================================
     *
     * This is the pre-existing behavior. It may create the
     * customer's initial Tenant + OWNER Membership when this
     * is the customer's first SaaS login.
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
          profile.picture ??
          null,
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

      clearOAuthStateCookie(
        response,
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

    clearOAuthStateCookie(
      response,
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
        host === configuredSaaSHost ||
        host ===
          configuredSaaSUrl.hostname
      ) {
        errorOrigin =
          getSaaSOrigin(request);
      }
    } catch {
      /**
       * Keep the configured SaaS URL as the
       * safe fallback.
       */
    }

    return NextResponse.redirect(
      `${errorOrigin}/login?error=oauth_failed`,
    );
  }
}