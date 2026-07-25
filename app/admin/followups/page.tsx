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

  const [loading, setLoading] =
    useState(true);


  const [search, setSearch] =
    useState("");


  const [status, setStatus] =
    useState("");


  const [priority, setPriority] =
    useState("");


  const [myFollowUps, setMyFollowUps] =
    useState(false);


  const [page, setPage] =
    useState(1);


  const limit = 10;


  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit,
      totalRecords: 0,
      totalPages: 1,
    });


  const [followUps, setFollowUps] =
    useState<FollowUpTableItem[]>([]);


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

  }, [
    page,
    status,
    priority,
    myFollowUps,
  ]);


  useEffect(() => {

    const timer =
      setTimeout(() => {

        setPage(1);

        loadData(1);

      }, 400);


    return () =>
      clearTimeout(timer);


  }, [search]);



  async function loadData(
    currentPage = page,
  ) {

    try {

      setLoading(true);


      const params =
        new URLSearchParams();


      params.set(
        "page",
        currentPage.toString(),
      );


      params.set(
        "limit",
        limit.toString(),
      );


      if (search) {

        params.set(
          "search",
          search,
        );

      }


      if (status) {

        params.set(
          "status",
          status,
        );

      }


      if (priority) {

        params.set(
          "priority",
          priority,
        );

      }


      if (myFollowUps) {

        params.set(
          "mine",
          "true",
        );

      }


      const [
        listResponse,
        dashboardResponse,
      ] =
        await Promise.all([

          fetch(
            `/api/admin/followups?${params.toString()}`
          ),

          fetch(
            "/api/admin/followups/dashboard"
          ),

        ]);



        const list = (
          await listResponse.json()
        ) as FollowUpResponse;
        
        
        
        const dashboard = (
          await dashboardResponse.json()
        ) as DashboardResponse;



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
    description,
  }: {
    title: string;
    value: number;
    description?: string;
  }) {

    return (

      <div className="rounded-xl border bg-white p-5 shadow-sm">

        <div className="text-sm text-gray-500">

          {title}

        </div>


        <div className="mt-2 text-3xl font-bold text-slate-900">

          {value}

        </div>


        {description && (

          <div className="mt-2 text-xs text-gray-500">

            {description}

          </div>

        )}

      </div>

    );

  }
  return (

    <div className="space-y-6">


      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

        <div>

          <h1 className="text-3xl font-bold text-slate-900">

            FollowUp Center

          </h1>


          <p className="mt-1 text-gray-500">

            Manage and track all buyer follow-up activities in one place.

          </p>


        </div>


        <button

          type="button"

          className="rounded-lg bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"

        >

          + Create FollowUp

        </button>


      </div>




      {/* Summary Cards */}

      <div className="grid gap-4 md:grid-cols-5">


        <DashboardCard

          title="Total FollowUps"

          value={
            pagination.totalRecords
          }

          description="All follow-up activities"

        />


        <DashboardCard

          title="Pending"

          value={
            summary.pending
          }

          description="Needs attention"

        />


        <DashboardCard

          title="Overdue"

          value={
            summary.overdue
          }

          description="Past due date"

        />


        <DashboardCard

          title="Completed"

          value={
            summary.completed
          }

          description="Successfully closed"

        />


        <DashboardCard

          title="Due Today"

          value={
            summary.today
          }

          description="Requires action today"

        />


      </div>





      {/* Smart Filters */}

      <div className="rounded-xl border bg-white p-6 shadow-sm">


        <div className="mb-5 flex items-center justify-between">


          <div>


            <h2 className="text-lg font-semibold text-slate-900">

              Smart Filters

            </h2>


            <p className="text-sm text-gray-500">

              Quickly find the follow-ups you want to focus on.

            </p>


          </div>



          <button

            type="button"

            onClick={() => {

              setSearch("");

              setStatus("");

              setPriority("");

              setMyFollowUps(false);

              setPage(1);

            }}

            className="text-sm text-green-700 hover:underline"

          >

            Reset Filters

          </button>


        </div>



        <FollowUpFilters

          search={search}

          status={status}

          priority={priority}

          myFollowUps={myFollowUps}


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


          onMyFollowUpsChange={(value) => {

            setMyFollowUps(value);

            setPage(1);

          }}

        />


      </div>
      {loading ? (

<div className="rounded-xl border bg-white p-12 text-center text-gray-500">

  Loading FollowUps...

</div>


) : (

<>


  {/* FollowUp Table */}

  <div className="rounded-xl border bg-white shadow-sm overflow-hidden">


    <FollowUpTable

      followUps={followUps}

    />


  </div>




  {/* Pagination */}

  <div className="flex flex-col gap-4 rounded-xl border bg-white px-6 py-4 md:flex-row md:items-center md:justify-between">


    <div className="text-sm text-gray-600">

      Showing page{" "}

      <span className="font-semibold">

        {pagination.page}

      </span>


      {" "}of{" "}


      <span className="font-semibold">

        {pagination.totalPages}

      </span>


      {" "}

      ({pagination.totalRecords} records)

    </div>




    <div className="flex gap-2">


      <button

        type="button"

        disabled={
          page <= 1
        }

        onClick={() =>
          setPage(
            (prev) =>
              Math.max(
                prev - 1,
                1,
              ),
          )
        }

        className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"

      >

        Previous

      </button>




      <button

        type="button"

        disabled={
          page >= pagination.totalPages
        }

        onClick={() =>
          setPage(
            (prev) =>
              Math.min(
                prev + 1,
                pagination.totalPages,
              ),
          )
        }

        className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"

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