"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

import {
  FollowUpPriority,
  FollowUpStatus,
} from "@/lib/generated/prisma";


export interface FollowUpTableItem {
  id: string;

  title: string;

  actionType: string;

  category: string;

  priority: FollowUpPriority;

  status: FollowUpStatus;

  scheduledAt: string | Date;

  inquiry: {
    companyName: string;
  };

  assignedTo?: {
    name: string;
  } | null;
}


interface Props {
  followUps: FollowUpTableItem[];
}


function priorityBadge(
  priority: FollowUpPriority,
) {
  switch (priority) {
    case "URGENT":
      return "bg-red-100 text-red-700";

    case "HIGH":
      return "bg-orange-100 text-orange-700";

    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}


function statusBadge(
  status: FollowUpStatus,
) {
  switch (status) {

    case "COMPLETED":
      return "bg-green-100 text-green-700";

    case "PENDING":
      return "bg-blue-100 text-blue-700";

    default:
      return "bg-gray-100 text-gray-700";

  }
}



function FollowUpMobileCard({
  item,
}: {
  item: FollowUpTableItem;
}) {

  return (
    <div
      className="
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <div>
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Buyer
        </p>

        <h3 className="mt-1 text-lg font-semibold text-slate-900">
          {item.inquiry.companyName}
        </h3>
      </div>


      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          FollowUp
        </p>

        <p className="mt-1 font-medium text-slate-800">
          {item.title}
        </p>
      </div>


      <div className="mt-4">
        <p className="text-xs uppercase tracking-wide text-gray-400">
          Next Action
        </p>

        <p className="mt-1 text-sm text-slate-700">
          {item.actionType}
        </p>
      </div>


      <div className="mt-5 flex flex-wrap gap-2">

        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${statusBadge(item.status)}
          `}
        >
          {item.status}
        </span>


        <span
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${priorityBadge(item.priority)}
          `}
        >
          {item.priority}
        </span>

      </div>


      <div className="mt-4 text-sm text-gray-600">
        Due:

        <span className="ml-2 font-medium text-slate-900">
          {new Date(
            item.scheduledAt,
          ).toLocaleDateString()}
        </span>
      </div>


      <div className="mt-2 text-sm text-gray-600">
        Assigned:

        <span className="ml-2 font-medium text-slate-900">
          {item.assignedTo?.name ?? "Unassigned"}
        </span>
      </div>


      <div className="mt-5">
        <Link
          href={`/admin/followups/${item.id}`}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            px-4
            py-3
            text-sm
            font-medium
            hover:bg-gray-50
          "
        >
          <Eye size={16} />

          Open FollowUp
        </Link>
      </div>

    </div>
  );
}
export default function FollowUpTable({
  followUps,
}: Props) {


  if (!followUps.length) {

    return (
      <div className="rounded-lg border bg-white p-12 text-center">

        <h3 className="text-lg font-semibold">
          No follow-ups found
        </h3>


        <p className="mt-2 text-sm text-gray-500">
          Try changing the filters.
        </p>

      </div>
    );

  }



  return (

    <>

      {/* Mobile Sales Cockpit */}

      <div
        className="
          space-y-4
          lg:hidden
        "
      >

        {followUps.map(
          (item) => (

            <FollowUpMobileCard
              key={item.id}
              item={item}
            />

          )
        )}

      </div>





      {/* Desktop Table */}

      <div
        className="
          hidden
          overflow-hidden
          rounded-lg
          border
          bg-white
          lg:block
        "
      >

        <div className="overflow-x-auto">


          <table className="min-w-full text-sm">


            <thead className="bg-gray-100">

              <tr>

                <th className="px-5 py-3 text-left font-semibold">
                  Title
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Inquiry
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Action
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Category
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Scheduled
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Status
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Priority
                </th>


                <th className="px-5 py-3 text-left font-semibold">
                  Assigned
                </th>


                <th className="px-5 py-3 text-center font-semibold">
                  Action
                </th>

              </tr>

            </thead>




            <tbody>


              {followUps.map(
                (item) => (

                  <tr
                    key={item.id}
                    className="
                      border-t
                      hover:bg-gray-50
                    "
                  >


                    <td className="px-5 py-4 font-medium">

                      {item.title}

                    </td>



                    <td className="px-5 py-4">

                      {item.inquiry.companyName}

                    </td>



                    <td className="px-5 py-4">

                      {item.actionType}

                    </td>



                    <td className="px-5 py-4">

                      {item.category}

                    </td>



                    <td className="px-5 py-4">

                      {new Date(
                        item.scheduledAt,
                      ).toLocaleDateString()}

                    </td>




                    <td className="px-5 py-4">

                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${statusBadge(item.status)}
                        `}
                      >

                        {item.status}

                      </span>

                    </td>




                    <td className="px-5 py-4">


                      <span
                        className={`
                          rounded-full
                          px-3
                          py-1
                          text-xs
                          font-semibold
                          ${priorityBadge(
                            item.priority,
                          )}
                        `}
                      >

                        {item.priority}

                      </span>


                    </td>




                    <td className="px-5 py-4">

                      {
                        item.assignedTo?.name ??
                        "Unassigned"
                      }

                    </td>




                    <td className="px-5 py-4 text-center">


                      <Link

                        href={`/admin/followups/${item.id}`}

                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-md
                          border
                          px-3
                          py-2
                          text-sm
                          hover:bg-gray-100
                        "

                      >

                        <Eye size={16} />

                        View


                      </Link>


                    </td>


                  </tr>

                )
              )}


            </tbody>


          </table>


        </div>


      </div>


    </>

  );

}