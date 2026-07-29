import { ArrowRight, Bot } from "lucide-react";

type CaptainCardProps = {
  title: string;
  message: string;
  recommendation: string;
  severity: "INFO" | "SUCCESS" | "WARNING" | "CRITICAL";
  unread: number;
  lastUpdated: string;
  onClick: () => void;
};

const severityConfig = {
  INFO: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-400",
  },
  SUCCESS: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  WARNING: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
  },
  CRITICAL: {
    badge: "bg-red-500/15 text-red-300 border-red-500/30",
    dot: "bg-red-400",
  },
} as const;

export default function CaptainCard({
    title,
    message,
    recommendation,
    severity,
    unread,
    lastUpdated,
    onClick,
  }: CaptainCardProps) {
    const style = severityConfig[severity];
  
  //  const formattedLastUpdated = new Date(lastUpdated).toLocaleTimeString([], {
  //    hour: "2-digit",
  //    minute: "2-digit",
  //  });
  
    return (
<button
  type="button"
  onClick={onClick}
      className="
        fixed
        bottom-8
        right-8
        z-50
        w-[370px]
        overflow-hidden
        rounded-3xl
        border
        border-white/10
        bg-slate-900/95
        p-5
        text-left
        text-white
        shadow-2xl
        backdrop-blur-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-emerald-500/20
      "
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />

      <div className="relative">

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600">
              <Bot className="h-6 w-6" />
            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                R-CAPTAIN
              </p>

              <h3 className="mt-1 text-lg font-semibold">
                {title}
              </h3>

            </div>

          </div>

          <span
            className={`
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-semibold
              ${style.badge}
            `}
          >
            {severity}
          </span>

        </div>

        <p className="mt-5 text-sm leading-6 text-slate-300">
          {message}
        </p>

        <div className="mt-5 rounded-2xl border border-white/5 bg-white/5 p-4">

          <p className="text-xs uppercase tracking-widest text-slate-500">
            Recommendation
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-200">
            {recommendation}
          </p>

        </div>

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div
              className={`
                h-2.5
                w-2.5
                rounded-full
                ${style.dot}
                ${unread > 0 ? "animate-pulse" : ""}
              `}
            />

            <span className="text-xs text-slate-400">
                
            Updated {lastUpdated}
            </span>

          </div>

          {unread > 0 && (
            <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold">
              {unread}
            </span>
          )}

        </div>

        <div
  className="
    mt-5
    flex
    items-center
    justify-between
    rounded-2xl
    bg-gradient-to-r
    from-emerald-600
    to-green-600
    px-4
    py-3
    transition-all
    duration-300
    hover:from-emerald-500
    hover:to-green-500
  "
>

          <span className="font-medium">
            Review Dashboard
          </span>

          <ArrowRight className="h-5 w-5" />

        </div>

      </div>

    </button>
  );
}