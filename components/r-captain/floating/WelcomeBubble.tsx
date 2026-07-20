"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { useFloating } from "./FloatingProvider";

const SESSION_KEY = "rootym-r-captain-welcome";

export default function WelcomeBubble() {
  const { isOpen, open } = useFloating();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) return;

    if (sessionStorage.getItem(SESSION_KEY)) {
      return;
    }

    const showTimer = window.setTimeout(() => {
      setVisible(true);
    }, 2500);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "true");
    }, 12500);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  }, [isOpen]);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  function handleOpen() {
    dismiss();
    open();
  }

  if (!visible || isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        bottom-28
        right-6
        z-[998]
        w-72
        rounded-2xl
        border
        border-green-100
        bg-white
        p-4
        shadow-2xl
        animate-in
        fade-in
        slide-in-from-bottom-2
        duration-300
      "
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 rounded-full p-1 hover:bg-slate-100"
      >
        <X className="h-4 w-4 text-slate-500" />
      </button>

      <div className="pr-6">
        <p className="text-lg">👋</p>

        <h3 className="mt-2 font-semibold text-slate-900">
          Hi! I'm R-CAPTAIN
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          Need help exporting from India?
          <br />
          Ask me about products, packaging,
          logistics, certifications or international trade.
        </p>

        <button
          onClick={handleOpen}
          className="
            mt-4
            rounded-xl
            bg-green-700
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-green-800
          "
        >
          Start Chatting
        </button>
      </div>
    </div>
  );
}

// END OF FILE