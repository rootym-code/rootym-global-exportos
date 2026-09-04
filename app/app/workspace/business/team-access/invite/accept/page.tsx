/**
 * ============================================================
 * ROOTYM Workspace Invitation Acceptance Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Validates a workspace invitation and starts the
 *          invitation-aware Google OAuth flow.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock3,
  Mail,
  ShieldCheck,
} from "lucide-react";

type InvitationDetails = {
  invitationId: string;
  tenantId: string;
  tenantName: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  expiresAt: string;
};

type InvitationState =
  | {
      status: "loading";
    }
  | {
      status: "ready";
      invitation: InvitationDetails;
    }
  | {
      status: "error";
      message: string;
    };

function getRoleLabel(
  role: InvitationDetails["role"],
) {
  switch (role) {
    case "OWNER":
      return "Owner";

    case "ADMIN":
      return "Administrator";

    case "MEMBER":
      return "Member";

    default:
      return role;
  }
}

function getRoleDescription(
  role: InvitationDetails["role"],
) {
  switch (role) {
    case "OWNER":
      return "Full workspace ownership and administrative access.";

    case "ADMIN":
      return "Administrative access to the workspace.";

    case "MEMBER":
      return "Standard workspace member access.";

    default:
      return "Workspace membership access.";
  }
}

function formatExpiry(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

export default function WorkspaceInvitationAcceptancePage() {
  const [state, setState] =
    useState<InvitationState>({
      status: "loading",
    });

  const [invitationToken, setInvitationToken] =
    useState<string | null>(null);

  useEffect(() => {
    const tokenParam = new URLSearchParams(
      window.location.search,
    ).get("token");

    if (!tokenParam) {
      setState({
        status: "error",
        message:
          "This invitation link is incomplete. Please use the invitation link provided to you.",
      });

      return;
    }

    const token = tokenParam;

    setInvitationToken(token);

    const controller = new AbortController();

    async function loadInvitation() {
      try {
        const invitationUrl =
          "/api/workspace/business/team-access/invite/accept?token=" +
          encodeURIComponent(token);

        const response = await fetch(
          invitationUrl,
          {
            method: "GET",
            cache: "no-store",
            signal: controller.signal,
          },
        );

        const payload = await response
          .json()
          .catch(() => null);

        if (!response.ok) {
          setState({
            status: "error",
            message:
              typeof payload?.error === "string"
                ? payload.error
                : typeof payload?.message ===
                    "string"
                  ? payload.message
                  : "This workspace invitation is no longer available.",
          });

          return;
        }

        const invitation =
          payload?.invitation;

        if (
          !invitation ||
          typeof invitation.invitationId !==
            "string" ||
          typeof invitation.tenantId !==
            "string" ||
          typeof invitation.tenantName !==
            "string" ||
          typeof invitation.email !== "string" ||
          typeof invitation.role !== "string" ||
          typeof invitation.expiresAt !== "string"
        ) {
          setState({
            status: "error",
            message:
              "The invitation response was invalid. Please request a new invitation.",
          });

          return;
        }

        if (
          invitation.role !== "OWNER" &&
          invitation.role !== "ADMIN" &&
          invitation.role !== "MEMBER"
        ) {
          setState({
            status: "error",
            message:
              "The invitation contains an invalid workspace role.",
          });

          return;
        }

        setState({
          status: "ready",
          invitation: {
            invitationId:
              invitation.invitationId,
            tenantId:
              invitation.tenantId,
            tenantName:
              invitation.tenantName,
            email: invitation.email,
            role: invitation.role,
            expiresAt:
              invitation.expiresAt,
          },
        });
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          return;
        }

        console.error(
          "Invitation validation failed:",
          error,
        );

        setState({
          status: "error",
          message:
            "Unable to validate this invitation. Please try again.",
        });
      }
    }

    void loadInvitation();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-wide text-slate-900">
                ROOTYM
              </div>

              <div className="text-xs text-slate-500">
                Global ExportOS
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-12">
        {state.status === "loading" ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />

            <h1 className="mt-5 text-lg font-semibold text-slate-900">
              Validating invitation
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Please wait while we verify your
              workspace invitation.
            </p>
          </div>
        ) : state.status === "error" ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>

              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  Invitation unavailable
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {state.message}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="bg-slate-950 px-8 py-8 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Workspace Invitation
                  </p>

                  <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                    Join{" "}
                    {state.invitation.tenantName}
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
                    You have been invited to join this
                    ROOTYM workspace. Review the
                    invitation details below and
                    continue with Google to accept it.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-8">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 text-slate-500" />

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Invited email
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {state.invitation.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Workspace role
                  </p>

                  <p className="mt-2 text-base font-semibold text-slate-900">
                    {getRoleLabel(
                      state.invitation.role,
                    )}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {getRoleDescription(
                      state.invitation.role,
                    )}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-slate-500" />

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Invitation expires
                    </p>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatExpiry(
                      state.invitation.expiresAt,
                    )}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                  <p className="text-sm leading-6 text-emerald-800">
                    For security, you must continue with
                    the Google account matching the invited
                    email address.
                  </p>
                </div>
              </div>

              <form
                method="POST"
                action="/api/auth/google"
              >
                <input
                  type="hidden"
                  name="token"
                  value={invitationToken ?? ""}
                />

                <button
                  type="submit"
                  disabled={!invitationToken}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue with Google
                </button>
              </form>

              <p className="text-center text-xs leading-5 text-slate-400">
                ROOTYM will verify the Google account
                email against this invitation before
                granting workspace access.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}