"use client";

import { Loader2, Save } from "lucide-react";

interface SaveBarProps {
  saving: boolean;
  onSave: () => void;
}

export default function SaveBar({
  saving,
  onSave,
}: SaveBarProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Save Changes
          </h3>

          <p className="text-sm text-slate-500">
            Save your company information to make it available across
            the ROOTYM Global Export Platform.
          </p>
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}