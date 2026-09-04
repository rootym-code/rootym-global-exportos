/**
 * ============================================================
 * ROOTYM Team & Access Page
 * ============================================================
 * Author: Prem Singh
 * Purpose: Displays tenant-scoped workspace members and their
 *          roles and provides authorized Owners/Admins with
 *          workspace invitation and member-management controls.
 * ============================================================
 */

import Link from "next/link";

import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Mail,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  getTeamAccess,
} from "@/app/lib/workspace/business/team-access.service";

import {
  requireWorkspaceAccess,
} from "@/app/lib/workspace/require-workspace-access";

import TeamAccessInviteForm from "./TeamAccessInviteForm";
import TeamAccessMemberActions from "./TeamAccessMemberActions";

export const dynamic = "force-dynamic";

function getRoleLabel(role: string) {
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

function getRoleDescription(role: string) {
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

export default async function TeamAccessPage() {
  const { tenant, membership } =
    await requireWorkspaceAccess();

  const teamAccess =
    await getTeamAccess();

  const activeMembers =
    teamAccess.members.filter(
      (member) => member.isActive,
    );

  const inactiveMembers =
    teamAccess.members.filter(
      (member) => !member.isActive,
    );

  const canManageAccess =
    membership.role === "OWNER" ||
    membership.role === "ADMIN";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/app/workspace/business"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
              <Building2 className="h-5 w-5" />
            </div>

            <div>
              <div className="text-sm font-semibold tracking-wide text-slate-900">
                ROOTYM
              </div>

              <div className="text-xs text-slate-500">
                Business Configuration
              </div>
            </div>
          </Link>

          <Link
            href="/app/settings"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            Settings
          </Link>
        </div>
      </header>

      {/* Module Header */}
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
            <Link
              href="/app/workspace/business"
              className="transition hover:text-white"
            >
              Business Configuration
            </Link>

            <ChevronRight className="h-4 w-4" />

            <span className="text-slate-300">
              Team & Access
            </span>
          </div>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <ShieldCheck className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Business Configuration
                  </p>

                  <h1 className="text-3xl font-semibold tracking-tight">
                    Team & Access
                  </h1>
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-slate-300">
                View the users who have access to this ROOTYM
                workspace, manage authorized invitations and
                review their assigned membership roles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
                Authenticated
              </span>

              <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
                {canManageAccess
                  ? "Admin Access"
                  : "View Access"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Team & Access is available
              </h2>

              <p className="mt-1 text-sm text-slate-600">
                Membership information is loaded from the
                authenticated workspace and is scoped to the
                current tenant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <UsersRound className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Total Members
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {teamAccess.members.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Active Members
                </p>

                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {activeMembers.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                <ShieldCheck className="h-5 w-5 text-slate-700" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Your Role
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {getRoleLabel(
                    membership.role,
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation Management */}
      {canManageAccess ? (
        <TeamAccessInviteForm />
      ) : null}

      {/* Team Members */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Workspace Members
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Users currently associated with this
                  workspace.
                </p>
              </div>

              <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                {teamAccess.members.length}{" "}
                {teamAccess.members.length === 1
                  ? "member"
                  : "members"}
              </div>
            </div>
          </div>

          {teamAccess.members.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <UsersRound className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                No workspace members found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are currently no membership records for
                this workspace.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {teamAccess.members.map(
                (member) => (
                  <div
                    key={member.membershipId}
                    className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserRound className="h-5 w-5 text-slate-500" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {member.name}
                          </p>

                          {member.isActive ? (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                              Active
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                              Inactive
                            </span>
                          )}
                        </div>

                        <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                          <Mail className="h-3.5 w-3.5 shrink-0" />

                          <span className="truncate">
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
                            {getRoleLabel(
                              member.role,
                            )}
                          </span>

                          <p className="mt-1 max-w-xs text-xs text-slate-400">
                            {getRoleDescription(
                              member.role,
                            )}
                          </p>
                        </div>
                      </div>

                      <TeamAccessMemberActions
                        membershipId={member.membershipId}
                        userId={member.userId}
                        name={member.name}
                        email={member.email}
                        role={member.role}
                        currentUserId={membership.userId}
                        currentUserRole={membership.role}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </section>

      {/* Access Information */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <ShieldCheck className="h-5 w-5 text-slate-700" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Access Information
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Workspace access is tenant-scoped. Owners and
                Administrators can create invitations and assign
                membership roles. Invitation acceptance requires
                authentication with the invited email address.
              </p>

              <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs font-medium text-slate-500">
                  Current workspace
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {tenant.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/app/workspace/business"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Business Configuration
            </Link>

            <div className="flex flex-wrap gap-4 text-sm">
              <Link
                href="/app/workspace/business/financial-settings"
                className="text-slate-400 transition hover:text-white"
              >
                Financial Settings
              </Link>

              <Link
                href="/app/workspace/business/export-credentials"
                className="text-slate-400 transition hover:text-white"
              >
                Export Credentials
              </Link>

              <Link
                href="/app/workspace/business/tax-compliance"
                className="text-slate-400 transition hover:text-white"
              >
                Tax & Compliance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-xs text-slate-500">
            ROOTYM Global ExportOS · Business Configuration ·
            Team & Access
          </p>
        </div>
      </footer>
    </main>
  );
}