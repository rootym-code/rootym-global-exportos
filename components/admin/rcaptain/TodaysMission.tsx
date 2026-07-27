const missions = [
    {
      title: "Calls",
      completed: 0,
      total: 5,
      icon: "📞",
      color: "bg-blue-500",
    },
    {
      title: "WhatsApp",
      completed: 0,
      total: 3,
      icon: "💬",
      color: "bg-green-500",
    },
    {
      title: "Quotations",
      completed: 0,
      total: 2,
      icon: "📄",
      color: "bg-purple-500",
    },
    {
      title: "Meetings",
      completed: 0,
      total: 1,
      icon: "🤝",
      color: "bg-orange-500",
    },
  ];
  
  export default function TodaysMission() {
    const totalCompleted = missions.reduce(
      (sum, item) => sum + item.completed,
      0
    );
  
    const totalTasks = missions.reduce(
      (sum, item) => sum + item.total,
      0
    );
  
    const progress = Math.round((totalCompleted / totalTasks) * 100);
  
    return (
      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
  
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-600">
            Today's Mission
          </p>
  
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Daily Targets
          </h2>
  
          <p className="mt-2 text-gray-500">
            Complete today's mission to maximize your sales opportunities.
          </p>
        </div>
  
        <div className="mt-8 space-y-5">
  
          {missions.map((item) => (
            <div
              key={item.title}
              className="flex items-center justify-between rounded-2xl border border-gray-100 p-4 transition hover:shadow-md"
            >
              <div className="flex items-center gap-4">
  
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white ${item.color}`}
                >
                  {item.icon}
                </div>
  
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {item.title}
                  </h3>
  
                  <p className="text-sm text-gray-500">
                    {item.completed} of {item.total} completed
                  </p>
                </div>
  
              </div>
  
              <span className="font-bold text-emerald-600">
                {item.completed}/{item.total}
              </span>
            </div>
          ))}
  
        </div>
  
        {/* Progress */}
  
        <div className="mt-10">
  
          <div className="mb-2 flex items-center justify-between">
            <span className="font-semibold text-gray-700">
              Mission Progress
            </span>
  
            <span className="font-bold text-emerald-600">
              {progress}%
            </span>
          </div>
  
          <div className="h-3 overflow-hidden rounded-full bg-gray-200">
  
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-600 transition-all duration-700"
              style={{
                width: `${progress}%`,
              }}
            />
  
          </div>
  
        </div>
  
        {/* Daily Win Score */}
  
        <div className="mt-10 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 p-6 text-white">
  
          <p className="text-sm uppercase tracking-widest opacity-90">
            Daily Win Score
          </p>
  
          <h3 className="mt-2 text-4xl font-bold">
            ★★★★★
          </h3>
  
          <p className="mt-3 text-sm opacity-90">
            Every completed activity brings you closer to closing more export orders.
          </p>
  
        </div>
  
      </section>
    );
  }