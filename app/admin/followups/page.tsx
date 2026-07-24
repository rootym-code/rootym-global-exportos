"use client";

import { useEffect, useState } from "react";

import FollowUpFilters from "@/components/admin/FollowUpFilters";
import FollowUpTable, {
  FollowUpTableItem,
} from "@/components/admin/FollowUpTable";

interface DashboardSummary {
  pending: number;
  overdue: number;
  today: number;
  upcoming: number;
  completed: number;
}

interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

interface FollowUpResponse {
  success: boolean;
  followUps: FollowUpTableItem[];
  pagination: Pagination;
}

interface DashboardResponse {
  success: boolean;
  summary: DashboardSummary;
}

export default function FollowUpsPage() {
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [priority, setPriority] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit,
      totalRecords: 0,
      totalPages: 1,
    });

  const [followUps, setFollowUps] = useState<
    FollowUpTableItem[]
  >([]);

  const [summary, setSummary] =
    useState<DashboardSummary>({
      pending: 0,
      overdue: 0,
      today: 0,
      upcoming: 0,
      completed: 0,
    });

  useEffect(() => {
    loadData();
  }, [page, status, priority]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  async function loadData(
    currentPage = page,
  ) {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set(
        "page",
        currentPage.toString(),
      );

      params.set(
        "limit",
        limit.toString(),
      );

      if (search) {
        params.set("search", search);
      }

      if (status) {
        params.set("status", status);
      }

      if (priority) {
        params.set("priority", priority);
      }

      const [listResponse, dashboardResponse] =
        await Promise.all([
          fetch(
            `/api/admin/followups?${params.toString()}`
          ),
          fetch(
            "/api/admin/followups/dashboard",
          ),
        ]);

      const list =
        (await listResponse.json()) as FollowUpResponse;

      const dashboard =
        (await dashboardResponse.json()) as DashboardResponse;

      if (list.success) {
        setFollowUps(
          list.followUps ?? [],
        );

        setPagination(
          list.pagination,
        );
      }

      if (dashboard.success) {
        setSummary(
          dashboard.summary,
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function DashboardCard({
    title,
    value,
  }: {
    title: string;
    value: number;
  }) {
    return (
      <div className="rounded-lg border bg-white p-5">
        <div className="text-sm text-gray-500">
          {title}
        </div>

        <div className="mt-2 text-3xl font-bold">
          {value}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          FollowUp Center
        </h1>

        <p className="mt-1 text-gray-500">
          Manage customer follow-ups.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <DashboardCard
          title="Pending"
          value={summary.pending}
        />

        <DashboardCard
          title="Overdue"
          value={summary.overdue}
        />

        <DashboardCard
          title="Today"
          value={summary.today}
        />

        <DashboardCard
          title="Upcoming"
          value={summary.upcoming}
        />

        <DashboardCard
          title="Completed"
          value={summary.completed}
        />
      </div>

      <FollowUpFilters
        search={search}
        status={status}
        priority={priority}
        onSearchChange={(value) => {
          setSearch(value);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
        onPriorityChange={(value) => {
          setPriority(value);
          setPage(1);
        }}
      />

      {loading ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          Loading...
        </div>
      ) : (
        <>
          <FollowUpTable
            followUps={followUps}
          />

          <div className="flex items-center justify-between rounded-lg border bg-white px-6 py-4">
            <div className="text-sm text-gray-600">
              Showing page{" "}
              <span className="font-semibold">
                {pagination.page}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {pagination.totalPages}
              </span>{" "}
              ({pagination.totalRecords} records)
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) =>
                    Math.max(
                      prev - 1,
                      1,
                    ),
                  )
                }
                className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <button
                type="button"
                disabled={
                  page >=
                  pagination.totalPages
                }
                onClick={() =>
                  setPage((prev) =>
                    Math.min(
                      prev + 1,
                      pagination.totalPages,
                    ),
                  )
                }
                className="rounded-md border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}