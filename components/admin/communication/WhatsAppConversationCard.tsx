"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bot,
  Loader2,
  MessageSquare,
  RefreshCcw,
  Send,
  SquarePen,
  CheckCircle2,
  Clock3,
  Truck,
  Eye,
  Copy,
} from "lucide-react";

import Card from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export type CommunicationStatus =
  | "DRAFT"
  | "APPROVED"
  | "QUEUED"
  | "SENT"
  | "DELIVERED"
  | "READ"
  | "FAILED"
  | "REJECTED";

  export interface WhatsAppMessage {
    id: string;
    message: string;
    status: CommunicationStatus;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface WhatsAppDraft {
    id: string;
    message: string;
    status: CommunicationStatus;
    updatedAt?: string;
  }
  
  export interface WhatsAppConversationCardProps {
    inquiryId: string;
  
    loading?: boolean;
  
    generating?: boolean;
  
    draft?: WhatsAppDraft | null;
  
    /**
     * Complete conversation history.
     * Oldest → Newest.
     */
    messages?: WhatsAppMessage[];
  
    onGenerate?: () => void | Promise<void>;
  
    onApprove?: () => void | Promise<void>;
  
    onSaveEdit?: (
      message: string
    ) => void | Promise<void>;
  
    onRegenerate?: () => void | Promise<void>;
  
    onSend?: () => void | Promise<void>;
  }





const STATUS = {
  DRAFT: {
    label: "Draft",
    icon: SquarePen,
    className:
      "bg-gray-100 text-gray-700 border-gray-300",
  },

  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700 border-green-300",
  },

  FAILED: {
    label: "Failed",
    icon: Clock3,
    className:
      "bg-red-100 text-red-700 border-red-300",
  },

  REJECTED: {
    label: "Rejected",
    icon: Clock3,
    className:
      "bg-red-100 text-red-700 border-red-300",
  },

  QUEUED: {
    label: "Queued",
    icon: Clock3,
    className:
      "bg-amber-100 text-amber-700 border-amber-300",
  },

  SENT: {
    label: "Sent",
    icon: Send,
    className:
      "bg-blue-100 text-blue-700 border-blue-300",
  },

  DELIVERED: {
    label: "Delivered",
    icon: Truck,
    className:
      "bg-green-100 text-green-700 border-green-300",
  },

  READ: {
    label: "Read",
    icon: Eye,
    className:
      "bg-emerald-100 text-emerald-700 border-emerald-300",
  },
} satisfies Record<
  CommunicationStatus,
  {
    label: string;
    icon: React.ElementType;
    className: string;
  }
>;

const TIMELINE: CommunicationStatus[] = [
  "DRAFT",
  "APPROVED",
  "SENT",
  "DELIVERED",
  "READ",
];

export default function WhatsAppConversationCard({
  inquiryId,
  loading = false,
  generating = false,
  draft,
  messages = [],
  onGenerate,
  onSaveEdit,
  onRegenerate,
  onApprove,
  onSend,
}: WhatsAppConversationCardProps)


{
  const [editOpen, setEditOpen] =
    useState(false);

  const [editedMessage, setEditedMessage] =
    useState("");
    const [copied, setCopied] = useState(false);

    const editorRef = useRef<HTMLTextAreaElement>(null);
    const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    if (draft) {
      setEditedMessage(draft.message);
    }
  }, [draft]);

  useEffect(() => {
    if (editOpen) {
      editorRef.current?.focus();
    }
  }, [editOpen]);


  const currentStep = useMemo(() => {
    if (!draft) return -1;

    return TIMELINE.indexOf(draft.status);
  }, [draft]);

  const conversation = useMemo(() => {
    return [...messages].sort((a, b) => {
      const first =
        a.createdAt ?? a.updatedAt ?? "";
  
      const second =
        b.createdAt ?? b.updatedAt ?? "";
  
      return (
        new Date(first).getTime() -
        new Date(second).getTime()
      );
    });
  }, [messages]);


  if (loading) {
    return (
      <Card className="rounded-xl border shadow-sm">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-green-600" />

          <span className="font-medium text-gray-600">
            Loading communication...
          </span>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-xl border shadow-sm">
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3">
              <MessageSquare className="h-5 w-5 text-green-700" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Customer Communication
              </h2>

              <p className="text-sm text-gray-500">
                WhatsApp
              </p>
            </div>
          </div>

          <div className="rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-700">
            Powered by R-CAPTAIN
          </div>
        </div>

        <div className="space-y-6 p-6">
        {!draft ? (
            <div className="rounded-xl border border-dashed p-10 text-center">
              <Bot className="mx-auto mb-5 h-14 w-14 text-gray-300" />

              <h3 className="text-lg font-semibold">
                No AI Reply Generated
              </h3>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Generate a professional WhatsApp reply using
                R-CAPTAIN AI.
              </p>

             
             
             
              <Button
                className="mt-8 bg-green-600 hover:bg-green-700"
                onClick={async () => {
                  if (!onGenerate) return;
                
                  setActionInProgress(true);
                
                  try {
                    await onGenerate();
                  } finally {
                    setActionInProgress(false);
                  }
                }}
                disabled={
                  loading ||
                  generating ||
                  actionInProgress
                }
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Bot className="mr-2 h-4 w-4" />
                    Generate AI Reply
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">




              <div>
  <h3 className="font-semibold">
    Active Draft
  </h3>

  <p className="mt-1 text-sm text-gray-500">
    Latest editable AI-generated WhatsApp message.
  </p>

  {draft.updatedAt && (
    <p className="mt-1 text-xs text-gray-400">
      Last updated:{" "}
      {new Date(draft.updatedAt).toLocaleString()}
    </p>
  )}
</div>



                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                    STATUS[draft.status].className
                  }`}
                >
                  {(() => {
                    const Icon = STATUS[draft.status].icon;
                    return <Icon className="h-4 w-4" />;
                  })()}

                  {STATUS[draft.status].label}
                </div>
              </div>




              <div className="max-h-80 overflow-y-auto rounded-xl bg-gray-50 p-5">
  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
    {draft.message}
  </p>
</div>




              <div className="flex flex-wrap items-center gap-3">
              
              
              
              <Button
    variant="outline" 
    disabled={copied}
    onClick={async () => {
      try {
        await navigator.clipboard.writeText(draft.message);
    
        setCopied(true);
    
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      } catch (error) {
        console.error("Failed to copy message:", error);
       alert("Unable to copy the message to the clipboard.");
    //toast.error("Unable to copy the message.");

      }
    }}
  >
<Copy className="mr-2 h-4 w-4" />
{copied ? "Copied!" : "Copy"}
  </Button>


              {draft.status === "DRAFT" && !loading && !generating && (
                <Button
  variant="outline"
  onClick={() => {
    if (!draft?.message.trim()) return;
    setEditOpen(true);
  }}
  disabled={loading || generating}
>
    <SquarePen className="mr-2 h-4 w-4" />
    Edit Draft
  </Button>
)}

  {[
  "SENT",
  "DELIVERED",
  "READ",
  "FAILED",
  "REJECTED",
].includes(draft.status) && (
<Button
  variant="outline"
  onClick={async () => {
    if (!onRegenerate) return;
  
    setActionInProgress(true);
  
    try {
      await onRegenerate();
    } finally {
      setActionInProgress(false);
    }
  }}
  disabled={
    generating ||
    loading ||
    actionInProgress
  }
>
    <RefreshCcw className="mr-2 h-4 w-4" />
    Generate New Draft
  </Button>
)}






{draft.status === "DRAFT" && (
  
  
  
  <Button
    variant="outline"
    onClick={async () => {
      if (!onApprove) return;
    
      setActionInProgress(true);
    
      try {
        await onApprove();
      } finally {
        setActionInProgress(false);
      }
    }}
    disabled={
      loading ||
      actionInProgress ||
      !draft?.message.trim()
    }
  >
{actionInProgress ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Approving...
  </>
) : (
  <>
    <CheckCircle2 className="mr-2 h-4 w-4" />
    Approve
  </>
)}
  </Button>
)}








  {draft.status === "APPROVED" && (
    <Button
  className="bg-green-600 hover:bg-green-700"



  onClick={async () => {
    if (
      !confirm(
        "Are you sure you want to send this WhatsApp message?"
      )
    ) {
      return;
    }
  
    if (!onSend) return;
  
    setActionInProgress(true);
  
    try {
      await onSend();
    } finally {
      setActionInProgress(false);
    }
  }}


  disabled={
    loading ||
    actionInProgress ||
    !draft?.message.trim()
  }

>
{actionInProgress ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Sending...
  </>
) : (
  <>
    <Send className="mr-2 h-4 w-4" />
    Send WhatsApp
  </>
)}
    </Button>
  )}



</div>




              <div className="rounded-xl border bg-gray-50 p-5">
                <h4 className="mb-4 font-semibold">
                  Communication Timeline
                </h4>

                <div className="space-y-3">
                  {TIMELINE.map((step, index) => {
                    const complete =
                      index <= currentStep;

                    const Icon = STATUS[step].icon;

                    return (
                      <div
                        key={step}
                        className="flex items-center gap-3"
                      >
                        {complete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                        )}

                        <Icon className="h-4 w-4 text-gray-500" />

                        <span
                          className={
                            complete
                              ? "font-medium text-gray-900"
                              : "text-gray-500"
                          }
                        >
                          {STATUS[step].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

             
             
             
              {conversation.filter(
  (message) => message.id !== draft?.id
).length > 0 ? (
  <div className="rounded-xl border bg-white p-5">
   
   
   <h4 className="mb-4 font-semibold">
  Conversation History
  <span className="ml-2 text-sm font-normal text-gray-500">
    (
    {
      conversation.filter(
        (message) => message.id !== draft?.id
      ).length
    }
    )
  </span>
</h4>



    <div className="space-y-4">



    {[...conversation]
  .filter(
    (message) => message.id !== draft?.id
  )
  .reverse()
  .map((message) => {



          const Icon = STATUS[message.status].icon;

          return (
            <div
              key={message.id}
              className="rounded-lg border p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <div
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                    STATUS[message.status].className
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {STATUS[message.status].label}
                </div>



                <div className="text-right">
  <p className="text-xs text-gray-600">
    {message.updatedAt
      ? new Date(message.updatedAt).toLocaleString()
      : "-"}
  </p>
</div>




              </div>

              <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
                {message.message}
              </p>
            </div>
          );
        })}
    </div>
  </div>
) : (
  <div className="rounded-xl border bg-white p-5">
<h4 className="mb-4 font-semibold">
  Conversation History
  <span className="ml-2 text-sm font-normal text-gray-500">
    (
    {
      conversation.filter(
        (message) => message.id !== draft?.id
      ).length
    }
    )
  </span>
</h4>

    <p className="text-sm text-gray-500">
      No previous communication available.
      Once this draft is sent and a new draft is
      generated, the conversation history will
      appear here.
    </p>
  </div>
)}

              //------------

            </>
          )}
        </div>
      </Card>

      {editOpen && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="border-b px-6 py-4">
              <h3 className="text-lg font-semibold">
                Edit WhatsApp Draft
              </h3>
            </div>

            <div className="p-6">
             
             
             
              <textarea
              ref={editorRef}
                value={editedMessage}



                onChange={(e) =>
                  setEditedMessage(e.target.value)
                }
                onKeyDown={async (e) => {
                  if (
                    (e.ctrlKey || e.metaKey) &&
                    e.key === "Enter" &&
                    editedMessage.trim() &&
                    editedMessage.trim() !== draft.message.trim() &&
                    !loading
                  ) {
                    e.preventDefault();
                    await onSaveEdit?.(editedMessage);
                    setEditOpen(false);
                  }
                }}



                rows={10}
                className="w-full rounded-lg border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
<div className="mt-2 flex justify-end">
  <span className="text-xs text-gray-500">
    {editedMessage.length} characters
  </span>
</div>

            </div>

            <div className="flex justify-end gap-3 border-t px-6 py-4">
             
             
             
              <Button
                variant="outline"
               
               
                onClick={() => {
                  if (
                    editedMessage !== draft.message &&
                    !confirm(
                      "Discard your unsaved changes?"
                    )
                  ) {
                    return;
                  }
                
                  setEditedMessage(draft.message);
                  setEditOpen(false);
                }}


              >
                Cancel
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700"
               
               
               
                onClick={async () => {
                  if (!onSaveEdit) return;
                
                  setActionInProgress(true);
                
                  try {
                    await onSaveEdit(editedMessage);
                    setEditOpen(false);
                  } finally {
                    setActionInProgress(false);
                  }
                }}

                disabled={
                  loading ||
                  actionInProgress ||
                  !editedMessage.trim() ||
                  editedMessage.trim() === draft.message.trim()
                }



              >
                {actionInProgress ? (
  <>
    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    Saving...
  </>
) : (
  "Save Changes"
)}
              </Button>



            </div>
          </div>
        </div>
      )}
    </>
  );
}