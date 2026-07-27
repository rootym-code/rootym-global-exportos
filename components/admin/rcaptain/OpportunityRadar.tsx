type RadarItem = {
  title: string;
  value: string;
  insight: string;
  recommendation: string;
  color: string;
};

type OpportunityRadarProps = {
  radar: RadarItem[];
};

export default function OpportunityRadar({
  radar,
}: OpportunityRadarProps) {
  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">

      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
          Opportunity Radar
        </p>

        <h2 className="mt-2 text-3xl font-bold text-gray-900">
          Sales Intelligence
        </h2>

        <p className="mt-2 text-gray-500">
          AI continuously monitors your pipeline and highlights where your attention
          will have the greatest business impact.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {radar.map((item) => (
          <div
            key={item.title}
            className={`rounded-3xl bg-gradient-to-br ${item.color} p-6 text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >
            <div className="flex h-full flex-col">

              <div>
                <p className="text-sm font-medium opacity-90">
                  {item.title}
                </p>

                <h3 className="mt-4 text-4xl font-bold">
                  {item.value}
                </h3>
              </div>

              <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  AI Insight
                </p>

                <p className="mt-2 text-sm leading-6">
                  {item.insight}
                </p>
              </div>

              <div className="mt-4 border-t border-white/20 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider opacity-90">
                  Recommended Action
                </p>

                <p className="mt-2 text-sm font-medium leading-6">
                  {item.recommendation}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>

    </section>
  );
}