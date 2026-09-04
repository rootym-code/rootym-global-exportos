/**
 * ============================================================
 * ROOTYM Team & Access Invitation Form
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Owner/Admin invitation interface for
 *          creating tenant-scoped workspace invitations.
 * ============================================================
 */

"use client";

import { FormEvent, useState } from "react";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";

type MembershipRole = "OWNER" | "ADMIN" | "MEMBER";

type InvitationResult = {
  invitationId: string;
  email: string;
  role: MembershipRole;
  expiresAt: string;
  invitationToken: string;
};

function getRoleLabel(role: MembershipRole) {
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

function formatExpiry(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString();
}

export default function TeamAccessInviteForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] =
    useState<MembershipRole>("MEMBER");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  const [success, setSuccess] =
    useState<InvitationResult | null>(null);

  const [copied, setCopied] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setSuccess(null);
    setCopied(false);

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter an email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "/api/workspace/business/team-access/invite",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: normalizedEmail,
            role,
          }),
        },
      );

      const payload = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        setError(
          typeof payload?.error === "string"
            ? payload.error
            : typeof payload?.message === "string"
              ? payload.message
              : "Unable to create the workspace invitation.",
        );

        return;
      }

      if (payload?.type !== "invitation") {
        setError(
          typeof payload?.message === "string"
            ? payload.message
            : "The user already has workspace access.",
        );

        return;
      }

      if (
        typeof payload.invitationId !== "string" ||
        typeof payload.email !== "string" ||
        typeof payload.role !== "string" ||
        typeof payload.expiresAt !== "string" ||
        typeof payload.invitationToken !== "string"
      ) {
        setError(
          "The invitation response was invalid. Please try again.",
        );

        return;
      }

      if (
        payload.role !== "OWNER" &&
        payload.role !== "ADMIN" &&
        payload.role !== "MEMBER"
      ) {
        setError(
          "The invitation returned an invalid membership role.",
        );

        return;
      }

      setSuccess({
        invitationId: payload.invitationId,
        email: payload.email,
        role: payload.role,
        expiresAt: payload.expiresAt,
        invitationToken:
          payload.invitationToken,
      });

      setEmail("");
    } catch {
      setError(
        "Unable to connect to the invitation service. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function getInvitationUrl() {
    if (!success) {
      return "";
    }

    return (
      window.location.origin +
      "/app/workspace/business/team-access/invite/accept?token=" +
      encodeURIComponent(
        success.invitationToken,
      )
    );
  }

  async function copyInvitationLink() {
    const invitationUrl =
      getInvitationUrl();

    if (!invitationUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        invitationUrl,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError(
        "Unable to copy the invitation link. Please use the Open Invitation button.",
      );
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Send className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Invite Team Member
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Invite a user to this ROOTYM workspace and
                assign their membership role.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_240px_auto] md:items-end">
              <div>
                <label
                  htmlFor="team-invite-email"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    id="team-invite-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="team-invite-role"
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Workspace role
                </label>

                <select
                  id="team-invite-role"
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target
                        .value as MembershipRole,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
                >
                  <option value="MEMBER">
                    Member
                  </option>

                  <option value="ADMIN">
                    Administrator
                  </option>

                  <option value="OWNER">
                    Owner
                  </option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" />

                {isSubmitting
                  ? "Creating..."
                  : "Create Invitation"}
              </button>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm leading-6 text-red-700">
                  {error}
                </p>
              </div>
            ) : null}
          </form>

          {success ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-emerald-900">
                    Invitation created successfully
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-emerald-800">
                    An invitation has been created for{" "}
                    <span className="font-semibold">
                      {success.email}
                    </span>{" "}
                    with{" "}
                    <span className="font-semibold">
                      {getRoleLabel(success.role)}
                    </span>{" "}
                    access.
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Role
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {getRoleLabel(
                          success.role,
                        )}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-200 bg-white/70 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Invitation expires
                      </p>

                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        {formatExpiry(
                          success.expiresAt,
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-600" />

                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Invitation Link
                      </p>
                    </div>

                    <p className="mt-2 break-all text-xs leading-5 text-slate-600">
                      {getInvitationUrl()}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={
                          copyInvitationLink
                        }
                        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                      >
                        <Copy className="h-4 w-4" />

                        {copied
                          ? "Copied"
                          : "Copy Invitation Link"}
                      </button>

                      <a
                        href={getInvitationUrl()}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open Invitation
                      </a>
                    </div>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-emerald-800">
                    Treat this invitation link as a
                    private credential. Share it only with
                    the invited user.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}