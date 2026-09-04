/**
 * ============================================================
 * ROOTYM Team & Access Member Actions
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides authorized workspace member role update
 *          and removal controls while preserving server-side
 *          tenant and role authorization.
 * ============================================================
 */

"use client";

import {
  useState,
} from "react";

import {
  Loader2,
  Pencil,
  Trash2,
} from "lucide-react";

type MembershipRole =
  | "OWNER"
  | "ADMIN"
  | "MEMBER";

type TeamAccessMemberActionsProps = {
  membershipId: string;
  userId: string;
  name: string;
  email: string;
  role: MembershipRole;
  currentUserId: string;
  currentUserRole: MembershipRole;
};

function getRoleLabel(
  role: MembershipRole,
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

export default function TeamAccessMemberActions({
  membershipId,
  userId,
  name,
  email,
  role,
  currentUserId,
  currentUserRole,
}: TeamAccessMemberActionsProps) {
  const [selectedRole, setSelectedRole] =
    useState<MembershipRole>(role);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [isRemoving, setIsRemoving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const isCurrentUser =
    userId === currentUserId;

  const canManageMember =
    !isCurrentUser &&
    role !== "OWNER" &&
    (currentUserRole === "OWNER" ||
      currentUserRole === "ADMIN");

  const canAssignAdmin =
    currentUserRole === "OWNER";

  if (!canManageMember) {
    return null;
  }

  async function handleUpdateRole() {
    if (selectedRole === role) {
      return;
    }

    setError(null);
    setIsUpdating(true);

    try {
      const response = await fetch(
        `/api/workspace/business/team-access/members/${encodeURIComponent(
          membershipId,
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            role: selectedRole,
          }),
        },
      );

      const payload =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        setError(
          typeof payload?.error ===
            "string"
            ? payload.error
            : "Unable to update the workspace member.",
        );

        setSelectedRole(role);
        return;
      }

      window.location.reload();
    } catch {
      setError(
        "Unable to connect to the member management service. Please try again.",
      );

      setSelectedRole(role);
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleRemoveMember() {
    const confirmed =
      window.confirm(
        `Remove ${name || email} from this workspace? This will remove their workspace membership but will not delete their ROOTYM account.`,
      );

    if (!confirmed) {
      return;
    }

    setError(null);
    setIsRemoving(true);

    try {
      const response = await fetch(
        `/api/workspace/business/team-access/members/${encodeURIComponent(
          membershipId,
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const payload =
        await response
          .json()
          .catch(() => null);

      if (!response.ok) {
        setError(
          typeof payload?.error ===
            "string"
            ? payload.error
            : "Unable to remove the workspace member.",
        );

        return;
      }

      window.location.reload();
    } catch {
      setError(
        "Unable to connect to the member management service. Please try again.",
      );
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <div className="mt-3 flex flex-col items-end gap-2">
      <div className="flex flex-wrap items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor={`member-role-${membershipId}`}
            className="sr-only"
          >
            Update role for {name || email}
          </label>

          <select
            id={`member-role-${membershipId}`}
            value={selectedRole}
            onChange={(event) =>
              setSelectedRole(
                event.target
                  .value as MembershipRole,
              )
            }
            disabled={
              isUpdating ||
              isRemoving
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            <option value="MEMBER">
              Member
            </option>

            {canAssignAdmin ? (
              <option value="ADMIN">
                Administrator
              </option>
            ) : null}
          </select>

          <button
            type="button"
            onClick={
              handleUpdateRole
            }
            disabled={
              isUpdating ||
              isRemoving ||
              selectedRole === role
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Pencil className="h-3.5 w-3.5" />
            )}

            {isUpdating
              ? "Updating..."
              : "Update Role"}
          </button>
        </div>

        <button
          type="button"
          onClick={
            handleRemoveMember
          }
          disabled={
            isUpdating ||
            isRemoving
          }
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRemoving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}

          {isRemoving
            ? "Removing..."
            : "Remove"}
        </button>
      </div>

      {error ? (
        <p className="max-w-md text-right text-xs leading-5 text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}