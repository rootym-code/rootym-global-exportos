// components/admin/InquiryFilters.tsx

"use client";

import { Search } from "lucide-react";
import { InquiryStatus } from "@/lib/generated/prisma";

interface Props {
  search: string;
  status: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export default function InquiryFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-white p-4 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
          placeholder="Search company, contact, email..."
          className="w-full rounded-md border py-2 pl-10 pr-4 outline-none focus:border-green-600"
        />
      </div>

      <select
        value={status}
        onChange={(e) =>
          onStatusChange(e.target.value)
        }
        className="rounded-md border px-4 py-2 outline-none focus:border-green-600"
      >
        <option value="">All Status</option>

        {Object.values(InquiryStatus).map((item) => (
          <option key={item} value={item}>
            {item.replaceAll("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
}