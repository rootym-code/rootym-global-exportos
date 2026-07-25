"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

import type {
  BuyerIntelligenceResult,
} from "@/lib/brain/buyer/types";

import {
  FollowUpPriority,
  FollowUpResult,
  FollowUpStatus,
} from "@/lib/generated/prisma";

import FollowUpCompleteDialog from "@/components/admin/followups/FollowUpCompleteDialog";

import AddActivityForm from "@/components/admin/followups/AddActivityForm";


interface PageProps {
  params: Promise<{
    id: string;
  }>;
}


interface FollowUpDetail {

  id: string;

  title: string;

  description: string | null;

  notes: string | null;


  status: FollowUpStatus;

  priority: FollowUpPriority;


  actionType: string;

  category: string;


  scheduledAt: string;

  dueAt: string | null;


  estimatedMinutes: number | null;

  actualMinutes: number | null;


  createdAt: string;

  completedAt: string | null;


  inquiry: {

    id: string;

    inquiryNumber: string;

    companyName: string;

    contactPerson: string;

    email: string;

    phone: string;

    country: string;

    product: string;

  };


  assignedTo?: {

    id: string;

    name: string;

    email: string;

  } | null;


  completedBy?: {

    id: string;

    name: string;

    email: string;

  } | null;

}


interface ApiResponse {

  success: boolean;

  followUp: FollowUpDetail;

  message?: string;

}


interface ActivityTimelineItem {

  id: string;

  action: string;

  title: string;

  description: string | null;

  metadata: unknown;

  createdAt: string;

  actorType: string;

  performedBy?: {

    id: string;

    name: string;

    email: string;

  } | null;

}


interface TimelineResponse {

  success: boolean;

  activities: ActivityTimelineItem[];

}

interface BuyerIntelligenceResponse {

  success: boolean;

  intelligence?: BuyerIntelligenceResult;

  message?: string;

}

export default function FollowUpDetailPage({
  params,
}: PageProps) {


  const { id } = use(params);



  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");



  const [followUp, setFollowUp] =
    useState<FollowUpDetail | null>(
      null,
    );



  const [timeline, setTimeline] =
    useState<ActivityTimelineItem[]>(
      [],
    );

    const [
      buyerIntelligence,
      setBuyerIntelligence,
    ] =
      useState<
        BuyerIntelligenceResponse["intelligence"] | null
      >(null);


  const [
    completeDialogOpen,
    setCompleteDialogOpen,
  ] = useState(false);



  const [
    completeLoading,
    setCompleteLoading,
  ] = useState(false);




  useEffect(() => {

    loadFollowUp();
  
    loadTimeline();
  
  }, [id]);

  useEffect(() => {

    if (followUp) {
  
      loadBuyerIntelligence();
  
    }
  
  }, [followUp]);


  async function loadFollowUp() {

    try {

      setLoading(true);

      setError("");



      const response =
        await fetch(
          `/api/admin/followups/${id}`,
        );



      const result =
        (await response.json()) as ApiResponse;



      if (
        !response.ok ||
        !result.success
      ) {

        throw new Error(
          result.message ??
            "Unable to load follow-up.",
        );

      }



      setFollowUp(
        result.followUp,
      );


    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Unexpected error",
      );


    } finally {

      setLoading(false);

    }

  }




  async function loadTimeline() {

    try {

      const response =
        await fetch(
          `/api/admin/followups/${id}/timeline`,
        );



      const result =
        (await response.json()) as TimelineResponse;



      if (
        response.ok &&
        result.success
      ) {

        setTimeline(
          result.activities ?? [],
        );

      }


    } catch (error) {

      console.error(
        "Timeline loading error:",
        error,
      );

    }

  }

async function loadBuyerIntelligence() {

  try {

    if (!followUp?.inquiry.id) {
      return;
    }


    const response =
      await fetch(
        `/api/admin/buyer-intelligence/${followUp.inquiry.id}`,
      );


    const result =
      (await response.json()) as BuyerIntelligenceResponse;


    if (
      response.ok &&
      result.success
    ) {

      setBuyerIntelligence(
        result.intelligence ?? null,
      );

    }


  } catch (error) {

    console.error(
      "Buyer intelligence loading error:",
      error,
    );

  }

}


  async function handleComplete(
    result: FollowUpResult,
    notes: string,
    actualMinutes?: number,
  ) {

    try {

      setCompleteLoading(true);



      const response =
        await fetch(
          `/api/admin/followups/${id}/complete`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              result,
              notes,
              actualMinutes,
            }),
          },
        );



      const data =
        await response.json();



      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ??
            "Unable to complete follow-up.",
        );

      }



      setCompleteDialogOpen(false);



      await loadFollowUp();

      await loadTimeline();



    } catch (error) {

      alert(
        error instanceof Error
          ? error.message
          : "Unexpected error",
      );


    } finally {

      setCompleteLoading(false);

    }

  }
  if (loading) {

    return (
      <div className="rounded-lg border bg-white p-10 text-center">
        Loading follow-up...
      </div>
    );

  }



  if (error || !followUp) {

    return (
      <div className="rounded-lg border bg-white p-10">

        <h2 className="text-xl font-semibold text-red-600">
          Failed to load follow-up
        </h2>


        <p className="mt-2 text-gray-600">
          {error}
        </p>


        <Link
          href="/admin/followups"
          className="mt-6 inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-gray-100"
        >

          <ArrowLeft size={16} />

          Back

        </Link>

      </div>
    );

  }



  return (

    <div className="space-y-6 pb-24 lg:pb-6">



      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <Link
            href="/admin/followups"
            className="mb-4 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
          >

            <ArrowLeft size={16} />

            Back to FollowUps

          </Link>



          <h1 className="text-2xl font-bold text-slate-900 lg:text-3xl">
            {followUp.title}
          </h1>


        </div>


      </div>




      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">


        <SummaryCard
          label="Status"
          value={followUp.status}
        />


        <SummaryCard
          label="Priority"
          value={followUp.priority}
        />


        <SummaryCard
          label="Scheduled"
          value={
            new Date(
              followUp.scheduledAt,
            ).toLocaleString()
          }
        />


        <SummaryCard
          label="Category"
          value={followUp.category}
        />


      </div>





      <div className="rounded-lg border bg-white p-4 lg:p-6">


        <h2 className="mb-5 text-xl font-semibold">
          FollowUp Timeline
        </h2>



        <AddActivityForm

          followUpId={followUp.id}

          onSuccess={() => {

            loadTimeline();

          }}

        />



        <div className="mt-6">


          {timeline.length === 0 ? (

            <div className="text-sm text-gray-500">

              No activity history available.

            </div>


          ) : (


            <div className="space-y-5">


              {timeline.map(

                (item) => (

                  <div

                    key={item.id}

                    className="border-l-2 pl-4"

                  >


                    <div className="font-semibold">

                      {item.title}

                    </div>



                    <div className="text-sm text-gray-600">

                      {item.description ??
                        "No description"}

                    </div>



                    <div className="mt-1 text-xs text-gray-400">

                      {new Date(
                        item.createdAt,
                      ).toLocaleString()}


                      {" • "}


                      {item.actorType}


                    </div>



                    {item.performedBy && (

                      <div className="mt-1 text-xs text-gray-500">

                        By:
                        {" "}
                        {item.performedBy.name}

                      </div>

                    )}


                  </div>

                ),

              )}


            </div>

          )}


        </div>


      </div>
      <div className="rounded-lg border bg-white p-4 lg:p-6">

<h2 className="mb-5 text-xl font-semibold">
  Inquiry Information
</h2>


<div className="grid gap-5 md:grid-cols-2">


  <div>
    <div className="text-sm text-gray-500">
      Inquiry Number
    </div>


    <div className="rounded-lg border bg-white p-4 lg:p-6">

  <h2 className="mb-5 text-xl font-semibold">
    🧠 Buyer Intelligence
  </h2>


  {!buyerIntelligence ? (

    <div className="text-sm text-gray-500">
      Loading buyer intelligence...
    </div>

  ) : (

    <div className="space-y-5">


      <div>

        <div className="text-sm text-gray-500">
          Observations
        </div>

        <div className="mt-1 font-medium">
          {
            buyerIntelligence.observations?.length ??
            0
          }
          {" "}
          signals detected
        </div>

      </div>





<div className="space-y-4">


  <div>

    <div className="text-sm text-gray-500">
      Buyer State
    </div>


    <div className="mt-1 text-lg font-semibold">
      {formatBuyerState(
        buyerIntelligence.reasoning?.buyerState,
      )}
    </div>

  </div>



  <div>

    <div className="text-sm text-gray-500">
      Risk Level
    </div>


    <div className="mt-1 font-semibold">
      {formatBuyerState(
        buyerIntelligence.reasoning?.risk,
      )}
    </div>

  </div>



  <div>

    <div className="text-sm text-gray-500">
      Why
    </div>


    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">

      {
        buyerIntelligence.reasoning?.reasoning?.map(
          (
            item: string,
            index: number,
          ) => (

            <li key={index}>
              {item}
            </li>

          ),
        )
      }

    </ul>

  </div>


</div>




<div>

  <div className="text-sm text-gray-500">
    Recommended Focus
  </div>


  <div className="mt-3 rounded-lg border bg-gray-50 p-4 space-y-4">


    <div>

      <div className="text-xs uppercase text-gray-500">
        🎯 Next Action
      </div>


      <div className="mt-1 font-semibold text-gray-900">
        {
          buyerIntelligence.recommendation
            ?.recommendedAction ??
          "Review buyer requirements before next interaction."
        }
      </div>

    </div>



    <div>

      <div className="text-xs uppercase text-gray-500">
        📊 Confidence
      </div>


      <div className="mt-1 font-semibold text-gray-900">
        {
          buyerIntelligence.recommendation?.confidence
            ? `${Math.round(
                buyerIntelligence.recommendation.confidence * 100,
              )}%`
            : "Not available"
        }
      </div>

    </div>



    <div>

      <div className="text-xs uppercase text-gray-500">
        Preparation
      </div>


      {
        buyerIntelligence.recommendation
          ?.preparation
          ?.length > 0 ? (

          <ul className="mt-2 list-disc pl-5 text-sm">

            {
              buyerIntelligence.recommendation.preparation.map(
                (
                  item: string,
                  index: number,
                ) => (

                  <li key={index}>
                    {item}
                  </li>

                ),
              )
            }

          </ul>

        ) : (

          <div className="mt-1 text-sm text-gray-700">
            No preparation steps available yet.
          </div>

        )
      }

    </div>


  </div>

</div>


    </div>

  )}

</div>

    <div className="font-medium">
      {followUp.inquiry.inquiryNumber}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Company
    </div>

    <div className="font-medium">
      {followUp.inquiry.companyName}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Contact Person
    </div>

    <div className="font-medium">
      {followUp.inquiry.contactPerson}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Email
    </div>

    <div className="font-medium">
      {followUp.inquiry.email}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Phone
    </div>

    <div className="font-medium">
      {followUp.inquiry.phone}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Country
    </div>

    <div className="font-medium">
      {followUp.inquiry.country}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Product
    </div>

    <div className="font-medium">
      {followUp.inquiry.product}
    </div>
  </div>


</div>

</div>




<div className="rounded-lg border bg-white p-4 lg:p-6">

<h2 className="mb-5 text-xl font-semibold">
  FollowUp Information
</h2>


<div className="grid gap-5 md:grid-cols-2">


  <div>
    <div className="text-sm text-gray-500">
      Action Type
    </div>

    <div className="font-medium">
      {followUp.actionType}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Assigned To
    </div>

    <div className="font-medium">
      {followUp.assignedTo?.name ??
        "Unassigned"}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Created At
    </div>

    <div className="font-medium">
      {new Date(
        followUp.createdAt,
      ).toLocaleString()}
    </div>
  </div>



  <div>
    <div className="text-sm text-gray-500">
      Completed At
    </div>

    <div className="font-medium">
      {followUp.completedAt
        ? new Date(
            followUp.completedAt,
          ).toLocaleString()
        : "-"}
    </div>
  </div>


</div>

</div>




<div className="rounded-lg border bg-white p-4 lg:p-6">

<h2 className="mb-4 text-xl font-semibold">
  Description
</h2>


<p className="whitespace-pre-wrap text-gray-700">
  {followUp.description ||
    "No description available."}
</p>

</div>




<div className="rounded-lg border bg-white p-4 lg:p-6">

<h2 className="mb-4 text-xl font-semibold">
  Internal Notes
</h2>


<p className="whitespace-pre-wrap text-gray-700">
  {followUp.notes ||
    "No notes available."}
</p>

</div>




<div className="rounded-lg border bg-white p-4 lg:p-6">

<h2 className="mb-5 text-xl font-semibold">
  Action Panel
</h2>


<div className="grid gap-3 md:grid-cols-4">


  <button
    type="button"
    onClick={() =>
      setCompleteDialogOpen(true)
    }
    disabled={
      completeLoading ||
      followUp.status === "COMPLETED"
    }
    className="rounded-md bg-green-600 px-4 py-3 font-medium text-white disabled:opacity-50"
  >
    ✓ Complete
  </button>


</div>

</div>




<FollowUpCompleteDialog
open={completeDialogOpen}
loading={completeLoading}
onClose={() =>
  setCompleteDialogOpen(false)
}
onSave={handleComplete}
/>


</div>

);

}

function formatBuyerState(
  value?: string,
) {

  if (!value) {
    return "UNKNOWN";
  }


  return value
    .replaceAll("_", " ")
    .toUpperCase();

}

function SummaryCard({
label,
value,
}: {
label: string;
value: string | number;
}) {

return (

<div className="rounded-lg border bg-white p-4 lg:p-5">

<div className="text-sm text-gray-500">
{label}
</div>


<div className="mt-2 text-xl font-semibold">
{value}
</div>


</div>

);

}