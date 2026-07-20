"use client";

import Avatar from "./Avatar";

interface RCaptainLauncherProps {
  onClick: () => void;
}

export default function RCaptainLauncher({
  onClick,
}: RCaptainLauncherProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open ROOTYM AI Export Intelligence Assistant"
      className="
        group
        fixed
        bottom-6
        right-6
        z-50
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-105
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-green-200
      "
    >
      <div className="relative animate-[float_4s_ease-in-out_infinite]">
        <Avatar
          size={72}
          className="border-4 border-white shadow-2xl"
        />

        {/* Online Indicator */}
        <span className="absolute bottom-1 right-1 flex h-5 w-5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

          <span className="relative h-5 w-5 rounded-full border-2 border-white bg-green-500" />
        </span>

        {/* AI Badge */}
        <div className="absolute -top-2 -left-2 rounded-full bg-green-700 px-2 py-1 text-[10px] font-bold tracking-wide text-white shadow-lg">
          AI
        </div>

        {/* Hover Tooltip */}
        <div
          className="
            pointer-events-none
            absolute
            right-full
            top-1/2
            mr-4
            hidden
            -translate-y-1/2
            whitespace-nowrap
            rounded-xl
            bg-gray-900
            px-4
            py-2
            text-xs
            font-medium
            text-white
            shadow-xl
            group-hover:block
          "
        >
          Ask R-CAPTAIN
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </button>
  );
}