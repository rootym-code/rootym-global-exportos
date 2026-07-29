import { PriorityOpportunity } from "@/lib/services/dashboard/dashboard.types";

type PriorityQueueProps = {
  opportunities: PriorityOpportunity[];
};

export default function PriorityQueue({
  opportunities,
}: PriorityQueueProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            AI Priority Queue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Next Best Actions
          </h2>
        </div>

        <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
          Top {opportunities.length} Opportunities
        </span>
      </div>

      <div className="mt-8 space-y-6">
        {opportunities.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-gray-200 bg-gradient-to-r from-white to-gray-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex flex-col rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                    AI Score
                  </span>

                  <span className="mt-1 text-3xl font-bold text-emerald-700">
                    {item.aiScore}
                  </span>

                  <span className="mt-1 text-xs font-medium text-emerald-600">
  {item.aiScore >= 80
    ? "High Confidence"
    : item.aiScore >= 60
    ? "Strong Opportunity"
    : item.aiScore >= 40
    ? "Needs Follow-up"
    : "Needs Attention"}
</span>
                </div>

                <div className="flex items-center gap-2">
  <h3 className="text-2xl font-bold text-gray-900">
    {item.buyer}
  </h3>

  <span
  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
    item.temperature === "HOT"
      ? "bg-red-50 text-red-700"
      : item.temperature === "WARM"
      ? "bg-amber-50 text-amber-700"
      : "bg-sky-50 text-sky-700"
  }`}
>
  {item.temperature === "HOT"
    ? "🔴 Hot"
    : item.temperature === "WARM"
    ? "🟠 Warm"
    : "🔵 Cold"}
</span>
</div>

                <p className="text-gray-600">
                  {item.country}
                </p>

                <p className="text-gray-600">
                  {item.product}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-500">
                  Sales Stage
                </p>

                <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                  {item.stage}
                </div>
                <p className="pt-3 text-sm text-gray-500">
  AI Recommendation
</p>

<p className="font-semibold text-gray-900">
  {item.reason}
</p>

<p className="mt-4 text-sm text-gray-500">
  Why this score
</p>

<div className="mt-2 space-y-2">
  {item.explanation.map((reason) => (
    <div
      key={reason}
      className="flex items-start gap-2 text-sm text-gray-600"
    >
      <span className="mt-0.5 text-emerald-600">✓</span>
      <span>{reason}</span>
    </div>
  ))}
</div>

<p className="mt-4 text-sm text-gray-500">
  Business Impact
</p>

<p
  className={`font-medium ${
    item.temperature === "HOT"
      ? "text-emerald-700"
      : item.temperature === "WARM"
      ? "text-amber-700"
      : "text-red-600"
  }`}
>
  {item.impact}
</p>

              </div>

              <div className="text-center">
  <p className="text-sm text-gray-500">
    Expected Revenue
  </p>

  <h3 className="mt-2 text-3xl font-bold text-emerald-600">
    {item.revenue}
  </h3>

  <p className="mt-4 text-sm text-gray-500">
    Last Activity
  </p>

  <p className="font-semibold text-gray-900">
    {item.lastActivity}
  </p>

  <button className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700">
    {item.action}
  </button>
</div>


            </div>
          </div>
        ))}
      </div>
    </section>
  );
}