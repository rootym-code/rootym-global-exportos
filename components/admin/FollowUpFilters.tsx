"use client";

import { Search } from "lucide-react";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";

interface Props {
  search: string;
  status: string;
  priority: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
}

export default function FollowUpFilters({
  search,
  status,
  priority,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-white p-4 lg:flex-row lg:items-center lg:justify-between">

      <div className="relative w-full lg:max-w-md">
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
          placeholder="Search title, company..."
          className="w-full rounded-md border py-2 pl-10 pr-4 outline-none focus:border-green-600"
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value)
          }
          className="rounded-md border px-4 py-2 outline-none focus:border-green-600"
        >
          <option value="">
            All Status
          </option>

          {Object.values(FollowUpStatus).map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item.replaceAll("_", " ")}
              </option>
            ),
          )}
        </select>

        <select
          value={priority}
          onChange={(e) =>
            onPriorityChange(e.target.value)
          }
          className="rounded-md border px-4 py-2 outline-none focus:border-green-600"
        >
          <option value="">
            All Priority
          </option>

          {Object.values(FollowUpPriority).map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item.replaceAll("_", " ")}
              </option>
            ),
          )}
        </select>

      </div>

    </div>
  );
}