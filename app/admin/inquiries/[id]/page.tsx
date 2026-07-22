"use client";


import {
  use,
  useEffect,
  useState,
} from "react";


import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import WhatsAppApprovalCard, {
  WhatsAppDraft,
} from "@/components/admin/whatsapp/WhatsAppApprovalCard";


import {
  InquiryStatus,
  SalesStage,
} from "@/lib/generated/prisma";



interface Note {

  id: string;

  note: string;

  createdAt: string;

  admin?: {
    name: string;
  };

}



interface StatusHistory {

  id: string;

  oldStatus: InquiryStatus | null;

  newStatus: InquiryStatus;

  createdAt: string;

  admin?: {
    name: string;
  };

}



interface Inquiry {


  id: string;


  inquiryNumber: string;


  companyName: string;


  contactPerson: string;


  email: string;


  phone: string;


  country: string;


  product: string;


  quantity: string;


  message: string;


  priority: string;


  status: InquiryStatus;


  salesStage: SalesStage;


  source: string;


  createdAt: string;


  notes: Note[];


  statusHistory: StatusHistory[];


}



export default function InquiryDetailsPage({

  params,

}: {

  params: Promise<{
    id: string;
  }>;

}) {



  const {
    id,
  } = use(params);




  const [loading, setLoading] =
    useState(true);



  const [savingStatus, setSavingStatus] =
    useState(false);



  const [savingStage, setSavingStage] =
    useState(false);



  const [savingNote, setSavingNote] =
    useState(false);

    const [loadingWhatsApp, setLoadingWhatsApp] =
    useState(false);
  
  const [drafts, setDrafts] =
    useState<WhatsAppDraft[]>([]);

  const [note, setNote] =
    useState("");




  const [status, setStatus] =
    useState<InquiryStatus>("NEW");




  const [salesStage, setSalesStage] =
    useState<SalesStage>("NEW");




  const [inquiry, setInquiry] =
    useState<Inquiry | null>(null);





    useEffect(() => {
      loadInquiry();
      loadWhatsAppDrafts();
    }, []);






  async function loadInquiry() {


    try {


      setLoading(true);



      const res =
        await fetch(
          `/api/admin/inquiries/${id}`
        );



      const data =
        await res.json();



      setInquiry(
        data.inquiry
      );



      setStatus(
        data.inquiry.status
      );



      setSalesStage(
        data.inquiry.salesStage ?? "NEW"
      );



    } finally {


      setLoading(false);


    }


  }



  async function loadWhatsAppDrafts() {
    try {
      setLoadingWhatsApp(true);
  
      const res = await fetch(
        `/api/admin/inquiries/${id}/whatsapp`
      );
  
      const data = await res.json();
  
      if (!data.success) {
        setDrafts([]);
        return;
      }
  

      console.log("WhatsApp API Response:", data);
      console.log("Messages:", data.messages);
      console.log(
        "Statuses:",
        data.messages?.map((m: any) => m.status)
      );


      setDrafts(
        (data.messages ?? []).map((item: any) => ({
          id: item.id,
          message: item.message,
          status: item.status,
          generatedBy: "R-CAPTAIN",
          generatedAt: item.createdAt,
          approvedAt: item.approvedAt,
          approvedBy: item.approvedBy?.name,
          attachments:
            item.attachments?.map((attachment: any) => ({
              id: attachment.id,
              fileName:
                attachment.media?.fileName ??
                "Attachment",
              fileType:
                attachment.media?.mimeType ?? "",
              url:
                attachment.media?.url ?? "",
              size:
                attachment.media?.size,
            })) ?? [],
        }))
      );
    } catch (error) {
      console.error(
        "Failed to load WhatsApp drafts",
        error
      );
      setDrafts([]);
    } finally {
      setLoadingWhatsApp(false);
    }
  }

  async function approveDraft(messageId: string) {
    await fetch(
      `/api/admin/inquiries/${id}/whatsapp/${messageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "APPROVE",
        }),
      }
    );
  
    await loadWhatsAppDrafts();
  }
  
  async function rejectDraft(messageId: string) {
    await fetch(
      `/api/admin/inquiries/${id}/whatsapp/${messageId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "REJECT",
        }),
      }
    );
  
    await loadWhatsAppDrafts();
  }
  
  async function regenerateDraft(
    _messageId: string
  ) {
    // Placeholder until regenerate API is implemented.
    await loadWhatsAppDrafts();
  }

  async function updateStatus() {


    try {


      setSavingStatus(true);



      await fetch(
        `/api/admin/inquiries/${id}`,
        {

          method: "PATCH",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            status,

          }),

        }
      );



      await loadInquiry();



    } finally {


      setSavingStatus(false);


    }


  }






  async function updateSalesStage() {


    try {


      setSavingStage(true);



      await fetch(
        `/api/admin/inquiries/${id}`,
        {

          method: "PATCH",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            salesStage,

          }),

        }
      );



      await loadInquiry();



    } finally {


      setSavingStage(false);


    }


  }  async function addNote() {

    if (!note.trim()) return;


    try {


      setSavingNote(true);



      await fetch(
        `/api/admin/inquiries/${id}/notes`,
        {

          method: "POST",

          headers: {

            "Content-Type":
              "application/json",

          },

          body: JSON.stringify({

            note,

          }),

        }
      );



      setNote("");



      await loadInquiry();



    } finally {


      setSavingNote(false);


    }

  }






  if (loading) {


    return (

      <div className="rounded-lg border bg-white p-8">

        Loading...

      </div>

    );

  }





  if (!inquiry) {


    return (

      <div className="rounded-lg border bg-white p-8">

        Inquiry not found.

      </div>

    );

  }






  return (

    <div className="space-y-6">





      {/* Header */}

      <div className="rounded-lg border bg-white p-6">


        <div className="flex items-center justify-between">


          <div>


            <h1 className="text-2xl font-bold">

              {inquiry.inquiryNumber}

            </h1>


            <p className="text-gray-500">

              {inquiry.companyName}

            </p>


          </div>



          <InquiryStatusBadge

            status={inquiry.status}

          />


        </div>


      </div>







      {/* Buyer Snapshot */}


      <div className="rounded-lg border bg-white p-6">


        <h2 className="mb-5 text-lg font-semibold">

          Buyer Snapshot

        </h2>




        <div className="grid gap-4 md:grid-cols-4">


          <InfoCard

            label="Company"

            value={inquiry.companyName}

          />



          <InfoCard

            label="Contact"

            value={inquiry.contactPerson}

          />



          <InfoCard

            label="WhatsApp"

            value={inquiry.phone}

          />



          <InfoCard

            label="Country"

            value={inquiry.country}

          />


        </div>


      </div>







      {/* Requirement Summary */}


      <div className="grid gap-6 lg:grid-cols-2">



        <div className="rounded-lg border bg-white p-6">


          <h2 className="mb-5 text-lg font-semibold">

            Requirement Summary

          </h2>



          <Row

            label="Product"

            value={inquiry.product}

          />



          <Row

            label="Quantity"

            value={inquiry.quantity}

          />



          <Row

            label="Source"

            value={inquiry.source}

          />



          <Row

            label="Priority"

            value={inquiry.priority}

          />


        </div>







        {/* R-CAPTAIN Intelligence */}


        <div className="rounded-lg border bg-white p-6">


          <h2 className="mb-5 text-lg font-semibold">

            R-CAPTAIN Intelligence

          </h2>




          <Row

            label="Lead Source"

            value="R-CAPTAIN AI"

          />



          <Row

            label="Intent"

            value="BUYING REQUEST"

          />



          <Row

            label="Lead Quality"

            value="HOT"

          />



        </div>



      </div>








      {/* Sales Pipeline */}


      <div className="rounded-lg border bg-white p-6">


        <h2 className="mb-5 text-lg font-semibold">

          Sales Pipeline

        </h2>




        <div className="flex flex-wrap gap-3">


          {Object.values(
            SalesStage
          ).map(

            (stage) => (

              <button


                key={stage}


                onClick={() =>

                  setSalesStage(stage)

                }


                className={

                  `rounded-full border px-4 py-2 text-sm ${
                    
                    salesStage === stage

                    ? "bg-green-600 text-white"

                    : "bg-white"

                  }`

                }


              >

                {stage.replaceAll(

                  "_",

                  " "

                )}

              </button>

            )

          )}



        </div>





        <button

          onClick={updateSalesStage}

          disabled={savingStage}

          className="mt-5 rounded-md bg-green-600 px-5 py-2 text-white"

        >

          {savingStage

            ? "Saving..."

            : "Update Sales Stage"}

        </button>



      </div>







      {/* WhatsApp Automation Placeholder */}


      <div className="rounded-lg border bg-white p-6">


        <h2 className="mb-3 text-lg font-semibold">

          WhatsApp Follow-up

        </h2>


        <p className="text-gray-600">

          Automation is pending admin approval.

        </p>



        <button

          disabled

          className="mt-4 rounded-md bg-gray-300 px-5 py-2 text-gray-600"

        >

          Approve WhatsApp Follow-up

        </button>



      </div>
                  {/* WhatsApp Approval Center */}

      <div className="rounded-lg border bg-white p-6">

        <h2 className="mb-3 text-lg font-semibold">
          WhatsApp Follow-up
        </h2>

        <p className="mb-4 text-gray-600">
          WhatsApp approval workflow is enabled.
        </p>

        <WhatsAppApprovalCard
  drafts={drafts}
  loading={loadingWhatsApp}
  onApprove={approveDraft}
  onReject={rejectDraft}
  onRegenerate={regenerateDraft}
/>

      </div>

      {/* Customer Message */}

            <div className="rounded-lg border bg-white p-6">


<h2 className="mb-4 text-lg font-semibold">

  Customer Message

</h2>


<p className="whitespace-pre-wrap text-gray-700">

  {inquiry.message || "-"}

</p>


</div>








{/* Update Status */}


<div className="rounded-lg border bg-white p-6">


<h2 className="mb-4 text-lg font-semibold">

  Update Status

</h2>




<div className="flex gap-3">


  <select

    value={status}

    onChange={(e) =>

      setStatus(

        e.target.value as InquiryStatus

      )

    }

    className="flex-1 rounded-md border px-3 py-2"

  >


    {Object.values(

      InquiryStatus

    ).map((item) => (


      <option

        key={item}

        value={item}

      >

        {item.replaceAll(

          "_",

          " "

        )}

      </option>


    ))}


  </select>





  <button

    onClick={updateStatus}

    disabled={savingStatus}

    className="rounded-md bg-green-600 px-5 py-2 text-white"

  >

    {savingStatus

      ? "Saving..."

      : "Save"}

  </button>



</div>


</div>








{/* Internal Notes */}


<div className="rounded-lg border bg-white p-6">


<h2 className="mb-4 text-lg font-semibold">

  Internal Notes

</h2>




<textarea


  value={note}


  onChange={(e) =>

    setNote(e.target.value)

  }


  rows={4}


  placeholder="Add internal note..."


  className="w-full rounded-md border p-3"


/>





<button


  onClick={addNote}


  disabled={savingNote}


  className="mt-3 rounded-md bg-blue-600 px-5 py-2 text-white"


>

  {savingNote

    ? "Saving..."

    : "Add Note"}


</button>







<div className="mt-6 space-y-4">


  {inquiry.notes.length === 0 ? (


    <p className="text-sm text-gray-500">

      No internal notes yet.

    </p>


  ) : (


    inquiry.notes.map((item) => (


      <div

        key={item.id}

        className="rounded-md border p-4"

      >


        <p>

          {item.note}

        </p>



        <p className="mt-2 text-xs text-gray-500">

          {item.admin?.name ?? "Admin"}

          {" • "}

          {new Date(

            item.createdAt

          ).toLocaleString()}


        </p>


      </div>


    ))


  )}


</div>


</div>









{/* Status History */}


<div className="rounded-lg border bg-white p-6">


<h2 className="mb-5 text-lg font-semibold">

  Status History

</h2>





{inquiry.statusHistory.length === 0 ? (


  <p className="text-gray-500">

    No status changes available.

  </p>


) : (


  <div className="space-y-4">


    {inquiry.statusHistory.map((item) => (


      <div

        key={item.id}

        className="rounded-md border p-4"

      >


        <div className="font-medium">


          {(item.oldStatus ?? "-").replaceAll(

            "_",

            " "

          )}


          {" → "}


          {item.newStatus.replaceAll(

            "_",

            " "

          )}


        </div>





        <div className="mt-2 text-xs text-gray-500">


          {item.admin?.name ?? "Admin"}

          {" • "}

          {new Date(

            item.createdAt

          ).toLocaleString()}


        </div>


      </div>


    ))}


  </div>


)}


</div>




</div>

);

}







function InfoCard({

label,

value,

}: {

label: string;

value?: string | null;

}) {


return (

<div className="rounded-lg bg-gray-50 p-4">


<p className="text-sm text-gray-500">

{label}

</p>


<p className="mt-1 font-medium">

{value || "-"}

</p>


</div>

);

}







function Row({

label,

value,

}: {

label: string;

value?: string | null;

}) {


return (

<div className="flex items-center justify-between border-b py-3 last:border-0">


<span className="font-medium text-gray-600">

{label}

</span>


<span className="text-right">

{value || "-"}

</span>


</div>

);

}


// END OF FILE