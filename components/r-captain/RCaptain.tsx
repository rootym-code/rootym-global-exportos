"use client";

import { useState } from "react";
import Markdown from "react-markdown";

import Avatar from "./Avatar";

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

export default function RCaptain() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(customMessage?: string) {
    const messageText =
      customMessage ?? input.trim();

    if (!messageText || loading) return;

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
      const response = await fetch("/api/r-captain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.response ||
            data.reply ||
            "I am unable to respond right now.",
        },
      ]);

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
    <section className="flex w-full flex-col items-center gap-6 rounded-3xl border border-green-100 bg-gradient-to-b from-white to-green-50 p-8 shadow-lg">

      <div className="relative">
        <Avatar size={160} />

        <span className="absolute bottom-3 right-3 h-5 w-5 rounded-full border-4 border-white bg-green-500" />
      </div>


      <div className="text-center">

        <h2 className="text-3xl font-bold text-gray-900">
          R-CAPTAIN
        </h2>

        <p className="mt-2 max-w-lg text-sm leading-6 text-gray-600">
          ROOTYM&apos;s AI Export Intelligence Partner,
          helping global buyers source trusted Indian
          agricultural products.
        </p>

        <p className="mt-2 text-xs font-medium text-green-700">
          ● Online | Export Assistant
        </p>

      </div>



      <div className="flex w-full max-w-3xl flex-col gap-4">


        <div className="min-h-[280px] space-y-4 rounded-2xl border border-green-100 bg-white p-5 shadow-inner">


          {messages.length === 0 && (

            <div className="space-y-4">

              <p className="text-sm text-gray-500">
                Ask R-CAPTAIN about ROOTYM products,
                exports, packaging, or sourcing.
              </p>


              <div className="flex flex-wrap gap-2">

                {suggestions.map(
                  (suggestion) => (

                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        sendMessage(suggestion)
                      }
                      className="rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs text-green-700 transition hover:bg-green-100"
                    >
                      {suggestion}
                    </button>

                  ),
                )}

              </div>

            </div>

          )}



          {messages.map(
            (message, index) => (

              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-green-600 p-4 text-sm leading-6 text-white shadow"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm border bg-gray-50 p-4 text-sm leading-7 text-gray-700 shadow-sm"
                }
              >

                <div className="mb-2 text-xs font-bold">
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

                  <div>
                    {message.content}
                  </div>

                )}

              </div>

            ),
          )}



          {loading && (

            <div className="mr-auto rounded-2xl rounded-bl-sm border bg-gray-50 p-4 text-sm text-gray-500 shadow-sm">

              <span className="font-medium">
                R-CAPTAIN is analysing
              </span>

              <span className="ml-2 animate-pulse">
                ● ● ●
              </span>

            </div>

          )}


        </div>



        <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-white p-3 shadow-sm">

          <input
            type="text"
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                sendMessage();
              }

            }}
            placeholder="Ask R-CAPTAIN about exports, products, or sourcing..."
            className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400"
          />


          <button
            type="button"
            onClick={() => sendMessage()}
            disabled={loading}
            className="rounded-xl bg-green-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>

        </div>


      </div>



      <p className="text-xs text-gray-500">
        Powered by ROOTYM AI Export Intelligence
      </p>


    </section>
  );
}