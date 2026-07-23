"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Markdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "I want to export Makhana to UAE",
  "What packaging options are available?",
  "Explain FOB and CIF terms",
  "What export documents are required?",
];

export default function RCaptainChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [loading]);

  async function sendMessage(
    customMessage?: string
  ) {
    const messageText = customMessage ?? input.trim();

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
      const response = await fetch(
        "/api/r-captain/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            message: messageText,
            messages: updatedMessages,
          }),
        }
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
    } catch (error) {
      console.error(
        "R-CAPTAIN error:",
        error
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
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
            <div className="flex-1 min-h-0 overflow-y-auto rounded-2xl border border-green-100 bg-white p-6 shadow-inner">

{messages.length === 0 && (
  <div className="space-y-6">
    <div className="space-y-3">
      <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        AI Export Intelligence Assistant
      </div>

      <h2 className="text-2xl font-bold text-gray-900">
        Welcome to R-CAPTAIN
      </h2>

      <p className="max-w-2xl text-sm leading-7 text-gray-600">
        I'm your AI-powered export assistant from ROOTYM.
        I can help you understand products,
        export procedures, certifications,
        packaging options, logistics,
        international trade terms,
        and guide you through requesting
        a quotation.
      </p>
    </div>

    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-green-100 bg-green-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-green-800">
          I can help with
        </h3>

        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Product Information</li>
          <li>• Export Documentation</li>
          <li>• Packaging Guidance</li>
          <li>• Certifications</li>
          <li>• Shipping & Logistics</li>
          <li>• International Trade Terms</li>
        </ul>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-amber-800">
          Get Started
        </h3>

        <p className="text-sm leading-6 text-gray-700">
          Choose one of the suggested
          questions below or type your own
          to begin chatting with me.
        </p>
      </div>
    </div>

    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Suggested Questions
      </p>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() =>
              sendMessage(suggestion)
            }
            className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-medium text-green-700 transition-all duration-200 hover:-translate-y-0.5 hover:bg-green-100 hover:shadow-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  </div>
)}

{messages.map((message, index) => (
  <div
    key={index}
    className={`transition-all duration-300 ease-out ${
      message.role === "user"
        ? "flex justify-end"
        : "flex justify-start"
    }`}
  >
    <div
      className={
        message.role === "user"
          ? "max-w-[85%] rounded-2xl rounded-br-sm bg-green-600 p-4 text-sm leading-7 text-white shadow-lg"
          : "max-w-[85%] rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 p-4 text-sm leading-7 text-gray-700 shadow-sm"
      }
    >
      <div
        className={`mb-2 text-xs font-bold uppercase tracking-wide ${
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
                <ul className="my-3 list-disc space-y-2 pl-5">
                  {children}
                </ul>
              );
            },

            ol({ children }) {
              return (
                <ol className="my-3 list-decimal space-y-2 pl-5">
                  {children}
                </ol>
              );
            },

            p({ children }) {
              return (
                <p className="mb-3">
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
  <div className="flex justify-start">
    <div className="rounded-2xl rounded-bl-sm border border-gray-100 bg-gray-50 px-5 py-4 shadow-sm">

      <div className="mb-2 text-xs font-bold uppercase tracking-wide text-green-700">
        R-CAPTAIN
      </div>

      <div className="flex items-center gap-3">

        <span className="text-sm text-gray-600">
          Thinking
        </span>

        <div className="flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-green-600"></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-green-600"
            style={{
              animationDelay: "0.15s",
            }}
          ></span>

          <span
            className="h-2 w-2 animate-bounce rounded-full bg-green-600"
            style={{
              animationDelay: "0.3s",
            }}
          ></span>
        </div>

      </div>

    </div>
  </div>
)}

<div ref={messagesEndRef} />
</div>
<div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-md">
        <div className="flex items-end gap-3">

          <textarea
            ref={textareaRef}
            value={input}
            rows={1}
            placeholder="Ask R-CAPTAIN about exports, products, packaging, certifications or sourcing..."
            onChange={(e) => {
              setInput(e.target.value);

              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(
                e.target.scrollHeight,
                160
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
            max-h-40
            min-h-[52px]
            flex-1
            resize-none
            overflow-y-auto
            rounded-xl
            bg-white
            px-3
            py-3
            text-sm
            leading-6
            text-slate-900
            caret-green-700
            outline-none
            placeholder:text-slate-500
            focus:bg-white
          "
          />

          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading}
            className="flex h-[52px] items-center justify-center rounded-xl bg-green-700 px-6 text-sm font-semibold text-white transition-all duration-200 hover:bg-green-800 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
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
                  d="M22 12a10 10 0 00-10-10"
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

        <div className="mt-2 flex items-center justify-between px-2">

          <p className="text-xs text-gray-400">
            Press <strong>Enter</strong> to send ·
            <strong> Shift + Enter</strong> for a new line
          </p>

          <p className="text-xs text-green-700">
            Powered by ROOTYM AI
          </p>

        </div>
      </div>
    </div>
  );
}

 