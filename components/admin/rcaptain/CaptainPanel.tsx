"use client";

import { X, Bot, ArrowRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessHealthData } from "@/lib/services/dashboard/dashboard.types";

type CaptainPanelProps = {
  open: boolean;
  onClose: () => void;

  title: string;
  message: string;
  recommendation: string;

  businessHealth: BusinessHealthData;
};

export default function CaptainPanel({
  open,
  onClose,
  title,
  message,
  recommendation,
  businessHealth,
}: CaptainPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          />

          {/* Panel */}

          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 32,
            }}
            className="
              fixed
              right-0
              top-0
              z-50
              flex
              h-screen
              w-[430px]
              flex-col
              border-l
              border-white/10
              bg-slate-950
              shadow-2xl
            "
          >
            {/* Header */}

            <div className="border-b border-white/10 p-6">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">

                    <Bot className="h-6 w-6 text-white" />

                  </div>

                  <div>

                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      Mission Control
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-white">
                      R-CAPTAIN
                    </h2>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="
                    rounded-xl
                    p-2
                    text-slate-400
                    transition
                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X className="h-5 w-5" />
                </button>

              </div>

            </div>

            {/* Content */}

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

              {/* Executive Brief */}

              <section className="rounded-3xl bg-slate-900 p-5">

                <div className="flex items-center gap-2">

                  <Activity className="h-5 w-5 text-emerald-400" />

                  <h3 className="font-semibold text-white">
                    Executive Brief
                  </h3>

                </div>

                <h2 className="mt-5 text-3xl font-bold text-white">
                  {title}
                </h2>

                <p className="mt-4 leading-7 text-slate-300">
                  {message}
                </p>

              </section>

              {/* AI Recommendation */}

              <section className="rounded-3xl bg-emerald-500/10 border border-emerald-500/20 p-5">

                <p className="text-xs uppercase tracking-[0.25em] text-emerald-400">
                  AI Recommendation
                </p>

                <p className="mt-4 leading-7 text-slate-200">
                  {recommendation}
                </p>

              </section>

              {/* Business Health */}

              <section className="rounded-3xl bg-slate-900 p-5">

                <div className="flex items-center justify-between">

                  <span className="font-medium text-white">
                    Business Health
                  </span>


                  <span className="font-bold text-emerald-400">
  {businessHealth.score} / 100
</span>

<div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-700">
  <div
    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-700"
    style={{
      width: `${businessHealth.score}%`,
    }}
  />
</div>

<p className="mt-4 text-sm font-medium text-emerald-400">
  {businessHealth.status}
</p>

<ul className="mt-3 space-y-2">
  {businessHealth.explanation.map((item) => (
    <li
      key={item}
      className="text-sm leading-6 text-slate-300"
    >
      • {item}
    </li>
  ))}
</ul>
</div>




              </section>

              {/* Quick Actions */}

              <section>

                <h3 className="mb-4 text-lg font-semibold text-white">
                  Quick Actions
                </h3>

                {[
                  "Priority Queue",
                  "Today's Mission",
                  "Productivity",
                  "Opportunity Radar",
                ].map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="
                      mb-3
                      flex
                      w-full
                      items-center
                      justify-between
                      rounded-2xl
                      bg-slate-900
                      px-5
                      py-4
                      text-left
                      text-slate-200
                      transition
                      hover:bg-slate-800
                    "
                  >
                    {item}

                    <ArrowRight className="h-5 w-5" />

                  </button>
                ))}

              </section>

            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}