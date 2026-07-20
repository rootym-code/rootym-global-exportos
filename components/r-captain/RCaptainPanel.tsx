"use client";

import { X } from "lucide-react";

import Avatar from "./Avatar";
import RCaptainChat from "./RCaptainChat";

interface RCaptainPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function RCaptainPanel({
  open,
  onClose,
}: RCaptainPanelProps) {
  return (
    <div
      className={[
        "fixed bottom-24 right-6 z-50",
        "w-[420px] max-w-[calc(100vw-2rem)]",
        "overflow-hidden rounded-3xl",
        "border border-green-100",
        "bg-white/95 backdrop-blur-xl",
        "shadow-[0_20px_60px_rgba(0,0,0,0.18)]",
        "transition-all duration-300",
        open
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-8 scale-95 opacity-0",
      ].join(" ")}
    >
      <div className="border-b border-green-100 bg-gradient-to-r from-green-700 via-green-600 to-green-700 px-6 py-4 text-white">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar
              size={52}
              className="border-2 border-white"
            />

            <div>
              <h2 className="text-base font-bold">
                R-CAPTAIN
              </h2>

              <p className="text-xs text-green-100">
                ROOTYM AI Export Intelligence Assistant
              </p>

              <div className="mt-1 flex items-center gap-2 text-[11px]">
                <span className="h-2 w-2 rounded-full bg-green-300" />

                <span>Online</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close R-CAPTAIN"
            className="rounded-lg p-2 transition hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-h-[65vh] overflow-y-auto bg-gradient-to-b from-white to-green-50 p-5">
        <RCaptainChat />
      </div>
    </div>
  );
}

// END OF FILE