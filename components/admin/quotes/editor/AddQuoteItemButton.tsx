"use client";

/**
 * ============================================================
 * ROOTYM Admin
 * File: components/admin/quotes/editor/AddQuoteItemButton.tsx
 * Sprint 8.1
 * ============================================================
 */

import { Plus } from "lucide-react";

interface Props {
  onClick: () => void;
}

export default function AddQuoteItemButton({
  onClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        items-center
        gap-2
        rounded-lg
        border
        border-dashed
        px-4
        py-2.5
        text-sm
        font-medium
        transition
        hover:bg-muted
        hover:border-primary
      "
    >
      <Plus className="h-4 w-4" />
      Add Line Item
    </button>
  );
}