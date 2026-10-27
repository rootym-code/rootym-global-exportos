/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides context-aware R-CAPTAIN chat UI with
 *          concise suggestions, compact messaging, and
 *          screenshot attachment support.
 * ============================================================
 */

"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { ChangeEvent } from "react";

import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface BuyerProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  origin: string | null;
  defaultUnit: string;
  minOrderQty: string | null;
  maxOrderQty: string | null;
  imageUrl: string | null;
}

type RCaptainMode = "MARKETING" | "WORKSPACE" | "BUYER";

interface Attachment {
  name: string;
  type: string;
  size: number;
  previewUrl: string;
}

const suggestionsByMode: Record<RCaptainMode, string[]> = {
  MARKETING: [
    "How does ROOTYM work?",
    "What does the free trial include?",
    "Which plan is right for my business?",
    "How can ROOTYM help my exports?",
  ],
  WORKSPACE: [
    "Is my website ready to go live?",
    "What should I configure next?",
    "Show my pending inquiries",
    "Which follow-ups need attention?",
  ],
  BUYER: [
    "Tell me about this product",
    "I want to request a quote",
    "What packaging options are available?",
    "How can I contact this supplier?",
  ],
};

const introByMode: Record<
  RCaptainMode,
  {
    badge: string;
    title: string;
    description: string;
    helpItems: string[];
  }
> = {
  MARKETING: {
    badge: "ROOTYM SaaS Assistant",
    title: "How can I help?",
    description:
      "Ask about ROOTYM, plans, trials, features, or how ROOTYM can help your export business.",
    helpItems: [
      "ROOTYM features",
      "Plans & free trial",
      "Website & lead generation",
      "Export business workflows",
    ],
  },
  WORKSPACE: {
    badge: "Workspace Captain",
    title: "How can I help with your workspace?",
    description:
      "Ask about your website, products, inquiries, quotes, follow-ups, subscription, or next steps.",
    helpItems: [
      "Website readiness",
      "Products & configuration",
      "Inquiries, quotes & follow-ups",
      "Subscription & workspace",
    ],
  },
  BUYER: {
    badge: "Website Assistant",
    title: "How can I help?",
    description:
      "Ask about products, packaging, quotations, or contacting this business.",
    helpItems: [
      "Product information",
      "Packaging & requirements",
      "Request a quotation",
      "Contact the business",
    ],
  },
};


function resolveContext(): {
  mode: RCaptainMode;
  websiteSlug: string | null;
} {
  if (typeof window === "undefined") {
    return {
      mode: "MARKETING",
      websiteSlug: null,
    };
  }

  const pathname = window.location.pathname;
  const hostname = window.location.hostname.toLowerCase();

  // Workspace host always takes priority, including local development.
  const isWorkspaceHost =
    hostname === "app.export.rootym.com" ||
    hostname === "app.export.localhost";

  const isWorkspaceRoute =
    pathname === "/app/workspace" ||
    pathname.startsWith("/app/workspace/");

  if (isWorkspaceHost && isWorkspaceRoute) {
    return {
      mode: "WORKSPACE",
      websiteSlug: null,
    };
  }

  // Marketing hosts must remain in Marketing mode.
  const isMarketingHost =
    hostname === "export.rootym.com" ||
    hostname === "export.localhost" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1";

  if (isMarketingHost) {
    return {
      mode: "MARKETING",
      websiteSlug: null,
    };
  }

  // Public website preview/storefront routes.
  const websiteMatch = pathname.match(
    /^\/website\/([^/]+)(?:\/|$)/,
  );

  const websiteSlug = websiteMatch?.[1] ?? null;

  if (websiteSlug) {
    return {
      mode: "BUYER",
      websiteSlug,
    };
  }

  // Known customer domains use Buyer mode.
  if (
    hostname !== "app.export.rootym.com" &&
    hostname !== "app.export.localhost"
  ) {
    return {
      mode: "BUYER",
      websiteSlug: null,
    };
  }

  // Keep other workspace-host pages out of Buyer mode.
  return {
    mode: "WORKSPACE",
    websiteSlug: null,
  };
}

export default function RCaptainChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<{
    mode: RCaptainMode;
    websiteSlug: string | null;
  }>({
    mode: "MARKETING",
    websiteSlug: null,
  });
  const [attachment, setAttachment] =
    useState<Attachment | null>(null);
    const [attachmentError, setAttachmentError] =
    useState<string | null>(null);

  const [products, setProducts] = useState<BuyerProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [comparisonProducts, setComparisonProducts] = useState<BuyerProduct[]>([]);
const [comparisonLoading, setComparisonLoading] = useState(false);
const [comparisonError, setComparisonError] = useState<string | null>(null);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const suggestions =
    suggestionsByMode[context.mode];

  const intro = introByMode[context.mode];

  useEffect(() => {
    setContext(resolveContext());
  }, []);
  useEffect(() => {
    if (context.mode !== "BUYER") {
      setProducts([]);
      setProductsError(null);
      setProductsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadProducts() {
      setProductsLoading(true);
      setProductsError(null);

      try {
        const response = await fetch("/api/r-captain/buyer-quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "list_products",
            ...(context.websiteSlug
              ? { websiteSlug: context.websiteSlug }
              : {}),
          }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ?? "Unable to load the product catalogue.",
          );
        }

        if (!cancelled) {
          setProducts(data.products ?? []);
        }
      } catch (error) {
        console.error("R-CAPTAIN product catalogue error:", error);

        if (!cancelled) {
          setProductsError(
            "We couldn't load the product catalogue. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoading(false);
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, [context.mode, context.websiteSlug]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [loading]);

  function handleAttachmentChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setAttachmentError(null);

    if (!file.type.startsWith("image/")) {
      setAttachmentError(
        "Please attach a PNG, JPG, JPEG or WebP image.",
      );
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setAttachmentError(
        "Screenshot must be 5 MB or smaller.",
      );
      event.target.value = "";
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    setAttachment((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.previewUrl);
      }

      return {
        name: file.name,
        type: file.type,
        size: file.size,
        previewUrl,
      };
    });

    event.target.value = "";
  }

  function removeAttachment() {
    if (attachment) {
      URL.revokeObjectURL(attachment.previewUrl);
    }

    setAttachment(null);
    setAttachmentError(null);
  }

  async function compareSelectedProducts() {
    if (
      context.mode !== "BUYER" ||
      selectedProductIds.length < 2 ||
      comparisonLoading
    ) {
      return;
    }

    setComparisonLoading(true);
    setComparisonError(null);
    setComparisonProducts([]);

    try {
      const response = await fetch("/api/r-captain/buyer-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "compare_products",
          productIds: selectedProductIds,
          ...(context.websiteSlug
            ? { websiteSlug: context.websiteSlug }
            : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ?? "Unable to compare the selected products.",
        );
      }

      setComparisonProducts(data.products ?? []);
    } catch (error) {
      console.error("R-CAPTAIN product comparison error:", error);

      setComparisonError(
        error instanceof Error
          ? error.message
          : "Unable to compare the selected products. Please try again.",
      );
    } finally {
      setComparisonLoading(false);
    }
  }

  async function sendMessage(
    customMessage?: string,
  ) {
    const messageText =
      customMessage ?? input.trim();

    if (!messageText || loading) {
      return;
    }

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: messageText,
      },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      /**
       * =====================================================
       * R-CAPTAIN Context Selection
       *
       * The same chat UI is used across ROOTYM marketing,
       * public tenant Websites, and authenticated Workspaces.
       * The API receives the explicit context so the server
       * can apply the correct authentication and data boundary.
       * =====================================================
       */
      const currentContext = resolveContext();

      setContext(currentContext);

      const response = await fetch(
        "/api/r-captain/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            messages: updatedMessages,
            mode: currentContext.mode,
            websiteSlug:
              currentContext.mode === "BUYER"
                ? currentContext.websiteSlug
                : undefined,
            attachment: attachment
              ? {
                  name: attachment.name,
                  type: attachment.type,
                  size: attachment.size,
                }
              : undefined,
          }),
        },
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ??
            data.reply ??
            "I am unable to respond right now.",
        },
      ]);

      /*
       * The current chat API accepts JSON and the backend does
       * not yet process image bytes. We therefore keep the
       * attachment UI local and send only safe attachment
       * metadata for this iteration. Image analysis can be
       * connected at the orchestration boundary later without
       * changing the chat composer UX.
       */
      if (attachment) {
        removeAttachment();
      }
    } catch (error) {
      console.error(
        "R-CAPTAIN error:",
        error,
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am having trouble connecting right now. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-3">
      <div className="min-h-0 flex-1 overflow-y-auto rounded-2xl border border-green-100 bg-white p-4 shadow-inner sm:p-5">
         {messages.length === 0 && (
  <div className="space-y-4">
    {context.mode !== "BUYER" && (
      <div className="space-y-4">
            <div className="space-y-2">
              <div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-semibold text-green-700">
                {intro.badge}
              </div>

              <h2 className="text-xl font-bold text-gray-900">
                {intro.title}
              </h2>

              <p className="max-w-xl text-sm leading-6 text-gray-600">
                {intro.description}
              </p>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50/70 p-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-green-800">
                I can help with
              </h3>

              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                {intro.helpItems.map((item) => (
                  <div
                    key={item}
                    className="text-xs leading-5 text-gray-700"
                  >
                    • {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                Suggested Questions
              </p>

              <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto pr-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() =>
                      sendMessage(suggestion)
                    }
                    className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-medium leading-4 text-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            </div>
    )}
            {context.mode === "BUYER" && (
              <div className="space-y-3 rounded-xl border border-green-100 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Explore Products
                  </h3>
                  <span className="text-xs text-gray-500">
                    {products.length} available
                  </span>
                </div>

                {productsLoading && (
                  <p className="text-sm text-gray-500">
                    Loading products...
                  </p>
                )}

                {productsError && (
                  <p className="text-sm text-red-600">
                    {productsError}
                  </p>
                )}

                {!productsLoading &&
                  !productsError &&
                  products.length === 0 && (
                    <p className="text-sm text-gray-500">
                      No published products are available yet.
                    </p>
                  )}

                <div className="grid gap-3 sm:grid-cols-2">
                  {products.map((product) => {
                    const selected = selectedProductIds.includes(product.id);

                    return (
                      <label
                        key={product.id}
                        className={`flex cursor-pointer gap-3 rounded-xl border p-3 transition-colors ${
                          selected
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-green-300"
                        }`}
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="h-16 w-16 shrink-0 rounded-lg border border-gray-100 object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-green-50 text-xs font-semibold text-green-700">
                            ROOTYM
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => {
                                setSelectedProductIds((previous) =>
                                  selected
                                    ? previous.filter((id) => id !== product.id)
                                    : previous.length < 10
                                      ? [...previous, product.id]
                                      : previous,
                                );
                              }}
                              className="mt-1 accent-green-700"
                              aria-label={`Select ${product.name} for comparison`}
                            />

                            <span className="text-sm font-semibold text-gray-900">
                              {product.name}
                            </span>
                          </div>

                          <p className="mt-1 line-clamp-3 text-xs leading-5 text-gray-600">
                            {product.shortDescription ||
                              product.description ||
                              product.category ||
                              "Contact us for product specifications."}
                          </p>

                          {product.origin && (
                            <p className="mt-1 text-xs text-gray-500">
                              Origin: {product.origin}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {selectedProductIds.length >= 2 && (
                  <button
                    type="button"
                    onClick={compareSelectedProducts}
                    disabled={comparisonLoading}
                    className="w-full rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {comparisonLoading
                      ? "Comparing products..."
                      : `Compare Selected (${selectedProductIds.length})`}
                  </button>
                )}

                {comparisonError && (
                  <p
                    role="alert"
                    className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                  >
                    {comparisonError}
                  </p>
                )}

                {comparisonProducts.length > 0 && (
                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-green-50 p-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Product Comparison
                      </h4>

                      <button
                        type="button"
                        onClick={() => setComparisonProducts([])}
                        className="text-xs font-medium text-green-800 hover:underline"
                      >
                        Clear comparison
                      </button>
                    </div>

                    <table className="w-full min-w-[420px] text-left text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 font-semibold text-gray-600">
                            Details
                          </th>
                          {comparisonProducts.map((product) => (
                            <th
                              key={product.id}
                              className="p-3 font-semibold text-gray-900"
                            >
                              {product.name}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {(
                          [
                            ["Description", (p: BuyerProduct) =>
                              p.shortDescription || p.description || "Not provided"],
                            ["Category", (p: BuyerProduct) =>
                              p.category || "Not specified"],
                            ["Origin", (p: BuyerProduct) =>
                              p.origin || "Not specified"],
                            ["Unit", (p: BuyerProduct) => p.defaultUnit],
                            ["Minimum order", (p: BuyerProduct) =>
                              p.minOrderQty
                                ? `${p.minOrderQty} ${p.defaultUnit}`
                                : "Not specified"],
                            ["Maximum order", (p: BuyerProduct) =>
                              p.maxOrderQty
                                ? `${p.maxOrderQty} ${p.defaultUnit}`
                                : "Not specified"],
                          ] as [
                            string,
                            (product: BuyerProduct) => string,
                          ][]
                        ).map(([label, getValue]) => (
                          <tr
                            key={label}
                            className="border-t border-gray-100 align-top"
                          >
                            <th className="p-3 font-medium text-gray-600">
                              {label}
                            </th>

                            {comparisonProducts.map((product) => (
                              <td
                                key={product.id}
                                className="max-w-[220px] whitespace-normal p-3 text-gray-700"
                              >
                                {getValue(product)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Select up to 10 products to prepare for comparison.
                  Selection does not submit a quotation request.
                </p>
              </div>
            )}

          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-3 flex transition-all duration-300 ease-out ${
              message.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-[78%] rounded-2xl rounded-br-sm bg-green-600 px-3.5 py-2.5 text-sm leading-6 text-white shadow-md"
                  : "max-w-[82%] rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-3.5 py-2.5 text-sm leading-6 text-gray-700 shadow-sm"
              }
            >
              <div
                className={`mb-1 text-[10px] font-bold uppercase tracking-wide ${
                  message.role === "user"
                    ? "text-green-100"
                    : "text-green-700"
                }`}
              >
                {message.role === "user"
                  ? "You"
                  : "R-CAPTAIN"}
              </div>

              {message.role === "assistant" ? (
                <Markdown
                  components={{
                    strong({ children }) {
                      return (
                        <strong className="font-bold text-green-800">
                          {children}
                        </strong>
                      );
                    },

                    ul({ children }) {
                      return (
                        <ul className="my-2 list-disc space-y-1 pl-4">
                          {children}
                        </ul>
                      );
                    },

                    ol({ children }) {
                      return (
                        <ol className="my-2 list-decimal space-y-1 pl-4">
                          {children}
                        </ol>
                      );
                    },

                    p({ children }) {
                      return (
                        <p className="mb-2 last:mb-0">
                          {children}
                        </p>
                      );
                    },
                  }}
                >
                  {message.content}
                </Markdown>
              ) : (
                <div>{message.content}</div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="mb-3 flex justify-start">
            <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-4 py-2.5 shadow-sm">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                R-CAPTAIN
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">
                  Thinking
                </span>

                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-600" />

                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-600"
                    style={{
                      animationDelay: "0.15s",
                    }}
                  />

                  <span
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-green-600"
                    style={{
                      animationDelay: "0.3s",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {attachment && (
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <img
            src={attachment.previewUrl}
            alt="Attached screenshot preview"
            className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
          />

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-slate-700">
              {attachment.name}
            </p>
            <p className="text-[11px] text-slate-400">
              Screenshot attached
            </p>
          </div>

          <button
            type="button"
            onClick={removeAttachment}
            className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-white hover:text-slate-800"
          >
            Remove
          </button>
        </div>
      )}

      {attachmentError && (
        <p className="px-1 text-xs text-red-600">
          {attachmentError}
        </p>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-2.5 shadow-md sm:p-3">
        <div className="flex items-end gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAttachmentChange}
            className="hidden"
          />

          <button
            type="button"
            aria-label="Attach screenshot"
            title="Attach screenshot"
            onClick={() =>
              fileInputRef.current?.click()
            }
            disabled={loading}
            className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16.5V7.75A2.75 2.75 0 0 1 6.75 5h10.5A2.75 2.75 0 0 1 20 7.75v8.5A2.75 2.75 0 0 1 17.25 19H6.75A2.75 2.75 0 0 1 4 16.25"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8 14 2.25-2.25a1 1 0 0 1 1.414 0L13 13.08l1.25-1.25a1 1 0 0 1 1.414 0L18 14.17"
              />
              <circle
                cx="8.5"
                cy="9"
                r="1"
              />
            </svg>
          </button>

          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder={
              context.mode === "WORKSPACE"
                ? "Ask about your workspace..."
                : context.mode === "BUYER"
                  ? "Ask about this business or product..."
                  : "Ask about ROOTYM, plans or features..."
            }
            onChange={(e) => {
              setInput(e.target.value);

              e.target.style.height =
                "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                120,
              )}px`;
            }}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey
              ) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="
              max-h-[120px]
              min-h-[46px]
              flex-1
              resize-none
              overflow-y-auto
              rounded-xl
              bg-white
              px-3
              py-2.5
              text-sm
              leading-6
              text-slate-900
              caret-green-700
              outline-none
              placeholder:text-slate-400
              focus:bg-white
            "
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={
              loading || !input.trim()
            }
            className="flex h-[46px] items-center justify-center rounded-xl bg-green-700 px-4 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:px-5"
          >
            {loading ? (
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  opacity="0.25"
                />

                <path
                  d="M22 12a10 10 0 0 0-10-10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              "Send"
            )}
          </button>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2 px-1">
          <p className="text-[10px] text-gray-400">
            Enter to send · Shift + Enter for a new line
          </p>

          <p className="text-[10px] text-green-700">
            ROOTYM AI
          </p>
        </div>
      </div>
    </div>
  );
}
