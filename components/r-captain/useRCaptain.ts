"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { Message } from "./types";

export default function useRCaptain() {
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

  const sendMessage = useCallback(
    async (customMessage?: string) => {
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
        const response = await fetch(
          "/api/r-captain",
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
    },
    [input, loading, messages]
  );

  return {
    input,
    setInput,

    messages,
    setMessages,

    loading,

    sendMessage,

    textareaRef,

    messagesEndRef,
  };
}

// END OF FILE