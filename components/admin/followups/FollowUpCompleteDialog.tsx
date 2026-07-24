"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/followups/FollowUpCompleteDialog.tsx
 * Sprint 10.4.2
 * ============================================================
 */

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  FollowUpResult,
} from "@/lib/generated/prisma";


interface Props {
  open: boolean;

  loading?: boolean;

  onClose: () => void;

  onSave: (
    result: FollowUpResult,
    notes: string,
    actualMinutes?: number,
  ) => void;
}


export default function FollowUpCompleteDialog({
  open,
  loading = false,
  onClose,
  onSave,
}: Props) {

    const [result, setResult] =
    useState<FollowUpResult>(
      FollowUpResult.BUYER_RESPONDED,
    );

  const [notes, setNotes] =
    useState("");

  const [actualMinutes, setActualMinutes] =
    useState("");


  useEffect(() => {
    if (!open) return;

    setResult(
        FollowUpResult.BUYER_RESPONDED,
      );
    setNotes("");

    setActualMinutes("");

  }, [open]);


  if (!open) {
    return null;
  }


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

      <div className="w-full max-w-lg rounded-xl border bg-background shadow-2xl">


        <div className="border-b px-6 py-5">

          <h2 className="text-xl font-semibold">
            Complete FollowUp
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Mark this follow-up as completed and
            record the outcome.
          </p>

        </div>


        <div className="space-y-5 p-6">


          <div>

            <label className="mb-2 block text-sm font-medium">
              Result
            </label>


            <select
              value={result}
              disabled={loading}
              onChange={(e) =>
                setResult(
                  e.target.value as FollowUpResult,
                )
              }
              className="h-11 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            >

              {Object.values(
                FollowUpResult,
              ).map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item.replaceAll("_", " ")}
                </option>

              ))}

            </select>

          </div>



          <div>

            <label className="mb-2 block text-sm font-medium">
              Actual Minutes
            </label>


            <input
              type="number"
              min="0"
              disabled={loading}
              value={actualMinutes}
              onChange={(e) =>
                setActualMinutes(
                  e.target.value,
                )
              }
              placeholder="Time spent"
              className="h-11 w-full rounded-lg border px-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>



          <div>

            <label className="mb-2 block text-sm font-medium">
              Notes
            </label>


            <textarea
              rows={5}
              disabled={loading}
              value={notes}
              onChange={(e) =>
                setNotes(
                  e.target.value,
                )
              }
              placeholder="Completion notes..."
              className="w-full rounded-lg border p-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />

          </div>


        </div>



        <div className="flex justify-end gap-3 border-t px-6 py-5">


          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-lg border px-5 py-2.5 hover:bg-muted disabled:opacity-60"
          >
            Cancel
          </button>


          <button
            type="button"
            disabled={loading}
            onClick={() =>
              onSave(
                result,
                notes,
                actualMinutes
                  ? Number(actualMinutes)
                  : undefined,
              )
            }
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
          >

            {loading && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}

            Complete FollowUp

          </button>


        </div>


      </div>

    </div>
  );
}