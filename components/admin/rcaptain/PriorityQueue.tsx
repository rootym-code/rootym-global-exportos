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

                  <span className="mt-1 text-xs text-emerald-600">
                    {item.confidence}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900">
                  {item.buyer}
                </h3>

                <p className="text-gray-600">
                  {item.country}
                </p>

                <p className="text-gray-600">
                  {item.product}
                </p>
              </div>

              <div className="space-y-2">
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
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Expected Revenue
                </p>

                <h3 className="mt-2 text-3xl font-bold text-emerald-600">
                  {item.revenue}
                </h3>

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