"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import Avatar from "../Avatar";
import RCaptainChat from "../RCaptainChat";
import { useFloating } from "./FloatingProvider";

export default function FloatingPanel() {
  const { isOpen, close } = useFloating();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 24,
            scale: 0.96,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            fixed
            inset-0
            z-[1000]
            flex
            flex-col
            bg-white

            md:inset-auto
            md:bottom-6
            md:right-6
            md:h-[720px]
            md:w-[460px]
            md:max-w-[90vw]
            md:rounded-3xl
            md:border
            md:border-slate-200
            md:shadow-2xl
          "
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
            <div className="flex items-center gap-4">
              <Avatar size={56} />

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  R-CAPTAIN
                </h2>

                <p className="text-sm text-slate-500">
                  AI Export Intelligence Partner
                </p>

                <div className="mt-1 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  <span className="text-xs font-medium text-green-600">
                    Online
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="
                rounded-full
                p-2
                transition-all
                hover:bg-slate-100
                hover:rotate-90
              "
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden bg-slate-50">
            <RCaptainChat />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// END OF FILE