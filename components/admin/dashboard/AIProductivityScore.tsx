import { ProductivityScoreData } from "@/lib/services/dashboard/dashboard.types";
import { Activity, Phone, MessageCircle, FileText, CalendarDays } from "lucide-react";

type AIProductivityScoreProps = {
  data: ProductivityScoreData;
};

function getStatusColor(status: string) {
  switch (status) {
    case "Excellent":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";

    case "On Track":
      return "text-blue-600 bg-blue-50 border-blue-200";

    case "Needs Attention":
      return "text-amber-600 bg-amber-50 border-amber-200";

    default:
      return "text-red-600 bg-red-50 border-red-200";
  }
}

export default function AIProductivityScore({
  data,
}: AIProductivityScoreProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            R-CAPTAIN
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            AI Productivity Score
          </h2>
        </div>

        <Activity className="h-6 w-6 text-blue-600" />
      </div>

      {/* Overall Score */}
      <div className="text-center">
        <div className="text-6xl font-black text-slate-900">
          {data.score}
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Overall Productivity
        </p>
      </div>

      {/* Progress */}
      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-500">Today's Progress</span>

          <span className="font-semibold text-slate-800">
            {data.progress}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-700"
            style={{
              width: `${data.progress}%`,
            }}
          />
        </div>
      </div>

      {/* Status */}
      <div
        className={`mt-5 inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${getStatusColor(
          data.status
        )}`}
      >
        {data.status}
      </div>

      {/* Metrics */}
      <div className="mt-8 space-y-4">
        <MetricRow
          icon={<Phone className="h-4 w-4" />}
          label="Calls"
          completed={data.calls.completed}
          total={data.calls.total}
          score={data.calls.score}
        />

        <MetricRow
          icon={<MessageCircle className="h-4 w-4" />}
          label="WhatsApp"
          completed={data.whatsapp.completed}
          total={data.whatsapp.total}
          score={data.whatsapp.score}
        />

        <MetricRow
          icon={<FileText className="h-4 w-4" />}
          label="Quotations"
          completed={data.quotations.completed}
          total={data.quotations.total}
          score={data.quotations.score}
        />

        <MetricRow
          icon={<CalendarDays className="h-4 w-4" />}
          label="Meetings"
          completed={data.meetings.completed}
          total={data.meetings.total}
          score={data.meetings.score}
        />
      </div>

      {/* Recommendation */}
      <div className="mt-8 rounded-2xl bg-blue-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
          AI Recommendation
        </p>

        <p className="mt-2 text-sm leading-6 text-slate-700">
          {data.recommendation}
        </p>
      </div>
    </section>
  );
}

type MetricRowProps = {
  icon: React.ReactNode;
  label: string;
  completed: number;
  total: number;
  score: number;
};

function MetricRow({
  icon,
  label,
  completed,
  total,
  score,
}: MetricRowProps) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
          {icon}
        </div>

        <div>
          <p className="font-medium text-slate-900">
            {label}
          </p>

          <p className="text-xs text-slate-500">
            {completed}/{total} completed
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="text-lg font-bold text-slate-900">
          {score}%
        </div>

        <div className="text-xs text-slate-500">
          Score
        </div>
      </div>
    </div>
  );
}