"use client";

import Avatar from "../Avatar";
import { useFloating } from "./FloatingProvider";

export default function FloatingButton() {
  const { isOpen, open } = useFloating();

  // Hide the launcher while the panel is open.
  if (isOpen) {
    return null;
  }

  return (
    <button
      type="button"
      aria-label="Open R-CAPTAIN"
      onClick={open}
      className="
        fixed
        bottom-6
        right-6
        z-[999]
        group
        focus:outline-none
      "
    >
      <div
        className="
          relative
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-2xl
          ring-2
          ring-green-100
          transition-all
          duration-300
          hover:-translate-y-1
          hover:scale-105
          hover:shadow-green-500/30
          active:scale-95
        "
      >
        <Avatar size={68} />

        {/* Online Indicator */}
        <span
          className="
            absolute
            bottom-2
            right-2
            flex
            h-4
            w-4
          "
        >
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              bg-green-400
              opacity-75
            "
          />
          <span
            className="
              relative
              inline-flex
              h-4
              w-4
              rounded-full
              border-2
              border-white
              bg-green-500
            "
          />
        </span>
      </div>

      {/* Tooltip */}
      <div
        className="
          pointer-events-none
          absolute
          right-24
          top-1/2
          hidden
          -translate-y-1/2
          whitespace-nowrap
          rounded-xl
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          text-slate-700
          shadow-xl
          group-hover:block
        "
      >
        Talk to R-CAPTAIN
      </div>
    </button>
  );
}

 