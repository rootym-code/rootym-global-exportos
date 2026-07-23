"use client";

import Avatar from "./Avatar";
import { useFloating } from "./FloatingProvider";

export default function FloatingButton() {
  const { open } = useFloating();

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
          ring-1
          ring-green-100
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-green-200
        "
      >
        <Avatar size={68} />

        <span
          className="
            absolute
            bottom-2
            right-2
            h-4
            w-4
            rounded-full
            border-2
            border-white
            bg-green-500
          "
        />

        <span
          className="
            absolute
            inset-0
            rounded-full
            animate-ping
            bg-green-400/20
            pointer-events-none
          "
        />
      </div>

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
          text-gray-700
          shadow-lg
          group-hover:block
        "
      >
        Talk to R-CAPTAIN
      </div>
    </button>
  );
}

 