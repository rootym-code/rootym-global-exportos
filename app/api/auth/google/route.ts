/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Starts the Google OAuth flow for ROOTYM SaaS
 *          customers while supporting the deterministic
 *          SaaS hostname architecture and secure workspace
 *          invitation OAuth handoff.
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
 * Invitation OAuth:
 *   invitation token
 *     → server-side invitation validation
 *     → signed invitation context
 *     → signed OAuth state
 *
 * SaaS origins are centralized through:
 *   lib/config/urls.ts
 * ============================================================
 */

import { randomBytes } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { SAAS_APP_URL } from "@/lib/config/urls";

import {
  getWorkspaceInvitationForAcceptance,
} from "@/app/lib/workspace/business/workspace-invitation-acceptance.service";

const STATE_COOKIE =
  "rootym_google_oauth_state";

const LOCAL_OAUTH_HOST =
  "localhost:3000";

const LOCAL_OAUTH_ORIGIN =
  "http://localhost:3000";

const GOOGLE_AUTHORIZATION_ENDPOINT =
  "https://accounts.google.com/o/oauth2/v2/auth";

const INVITATION_CONTEXT_EXPIRY =
  "5m";

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
 * Create a short-lived signed invitation context.
 * ============================================================
 *
 * IMPORTANT:
 *
 * The raw invitation token is intentionally NOT included.
 *
 * The token has already been validated by the existing
 * Workspace Invitation Acceptance Service.
 *
 * Only the server-resolved invitation ID and trusted SaaS
 * return origin are carried forward.
 *
 * The invitation ID itself does not determine authorization.
 * The OAuth callback must load the WorkspaceInvitation record
 * from the database before accepting the invitation.
 * ============================================================
 */
async function createInvitationContext(
  invitationId: string,
  returnOrigin: string,
) {
  return new SignJWT({
    type:
      "customer_invitation_oauth",
    invitationId,
    returnOrigin,
  })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime(
      INVITATION_CONTEXT_EXPIRY,
    )
    .sign(secretKey);
}

/**
 * ============================================================
 * Verify a short-lived signed invitation context.
 * ============================================================
 *
 * This is used by the localhost OAuth bootstrap.
 *
 * The localhost bootstrap never accepts tenantId, role, email
 * or a raw invitation token from the browser.
 *
 * It accepts only a ROOTYM-signed invitation context.
 * ============================================================
 */
async function verifyInvitationContext(
  context: string,
  expectedReturnOrigin: string,
) {
  const { payload } =
    await jwtVerify(
      context,
      secretKey,
    );

  if (
    payload.type !==
      "customer_invitation_oauth" ||
    typeof payload.invitationId !==
      "string" ||
    !payload.invitationId ||
    payload.returnOrigin !==
      expectedReturnOrigin
  ) {
    throw new Error(
      "Invalid invitation OAuth context.",
    );
  }

  return {
    invitationId:
      payload.invitationId,
    returnOrigin:
      payload.returnOrigin,
  };
}

/**
 * ============================================================
 * Build the Google authorization URL.
 * ============================================================
 *
 * Optional invitation context is included only in the signed
 * server-side OAuth state.
 *
 * The raw invitation token is never sent to Google.
 * ============================================================
 */
async function createAuthorizationResponse(
  request: NextRequest,
  redirectUri: string,
  returnOrigin: string,
  invitationId?: string,
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
      ...(invitationId
        ? {
            type:
              "customer_invitation_oauth",
            invitationId,
          }
        : {}),
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

/**
 * ============================================================
 * Start an invitation-aware Google OAuth flow.
 * ============================================================
 *
 * The invitation token is received through the POST body.
 *
 * It is immediately validated by the existing invitation
 * acceptance service. Only the resulting invitation ID is
 * carried into the signed OAuth context.
 *
 * No tenant ID is accepted from the browser.
 * ============================================================
 */
async function startInvitationOAuth(
  request: NextRequest,
) {
  const contentType =
    request.headers.get("content-type") ?? "";

  let token: unknown;

  if (contentType.includes("application/json")) {
    const body =
      (await request.json()) as {
        token?: unknown;
      };

    token = body.token;
  } else if (
    contentType.includes(
      "application/x-www-form-urlencoded",
    ) ||
    contentType.includes("multipart/form-data")
  ) {
    const formData = await request.formData();
    token = formData.get("token");
  }

  if (typeof token !== "string") {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invitation token is required.",
      },
      {
        status: 400,
      },
    );
  }

  /**
   * ==========================================================
   * Validate invitation using the existing authoritative
   * invitation service.
   *
   * This service performs the existing token normalization,
   * SHA-256 hashing and invitation-state checks.
   * ==========================================================
   */
  const invitation =
    await getWorkspaceInvitationForAcceptance(
      token,
    );

  const host =
    request.headers.get("host") ??
    "";

  /**
   * ==========================================================
   * Local development
   * ==========================================================
   *
   * The local SaaS request is intentionally handled before
   * getSaaSOrigin() because the OAuth bootstrap runs on
   * localhost:3000.
   *
   * The return origin remains server-controlled through
   * SAAS_APP_URL and is never taken from the browser.
   * ==========================================================
   */
  if (
    host ===
      "app.export.localhost:3000" ||
    host ===
      "app.export.localhost"
  ) {
    const appOrigin =
      getConfiguredSaaSOrigin();
  
    const invitationContext =
      await createInvitationContext(
        invitation.invitationId,
        appOrigin,
      );
  
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
  
    bootstrapUrl.searchParams.set(
      "invitation_context",
      invitationContext,
    );
  
    return NextResponse.redirect(
      bootstrapUrl,
      {
        status: 303,
      },
    );
  }

  const appOrigin =
    getSaaSOrigin(request);

  /**
   * ==========================================================
   * Production / configured SaaS host
   * ==========================================================
   *
   * The invitation ID is inserted directly into the signed
   * OAuth state. The raw invitation token never enters the
   * OAuth authorization URL.
   * ==========================================================
   */
  return createAuthorizationResponse(
    request,
    `${appOrigin}/api/auth/google/callback`,
    appOrigin,
    invitation.invitationId,
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    return await startInvitationOAuth(
      request,
    );
  } catch (error) {
    console.error(
      "Invitation OAuth start failed:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to start invitation OAuth.",
      },
      {
        status: 400,
      },
    );
  }
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
     *
     * If an invitation context is present, it must first pass
     * signature and return-origin validation.
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

      const invitationContext =
        request.nextUrl.searchParams.get(
          "invitation_context",
        );

      if (invitationContext) {
        const context =
          await verifyInvitationContext(
            invitationContext,
            returnOrigin,
          );

        return createAuthorizationResponse(
          request,
          `${LOCAL_OAUTH_ORIGIN}/api/auth/google/callback`,
          returnOrigin,
          context.invitationId,
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