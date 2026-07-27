type MorningBriefProps = {
  data: {
    greeting: string;
    pendingAttention: number;
    quotationsExpiring: number;
    opportunityValue: string;
  };
};

export default function MorningBrief({
  data,
}: MorningBriefProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-8 text-white shadow-2xl">

      {/* Background Glow */}
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">

        {/* Greeting */}
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-100">
            R-CAPTAIN
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            {data.greeting}, Prem 👋
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-emerald-100">
            R-CAPTAIN has analyzed your export pipeline this morning.
            You have{" "}
            <span className="font-semibold text-white">
              {data.pendingAttention} high-priority buyers
            </span>
            ,
            <span className="font-semibold text-white">
              {" "}
              {data.quotationsExpiring} quotations expiring today
            </span>
            , and an estimated business opportunity worth{" "}
            <span className="font-semibold text-white">
              {data.opportunityValue}
            </span>
            .
            Today's mission is to convert at least one qualified buyer into a confirmed order.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-5 md:grid-cols-4">

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">
              Estimated Opportunity
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {data.opportunityValue}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">
              High Priority Buyers
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {data.pendingAttention}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">
              Quotes Expiring
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {data.quotationsExpiring}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-emerald-100">
              Buyers Waiting
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {data.pendingAttention}
            </h2>
          </div>

        </div>

      </div>

    </section>
  );
}