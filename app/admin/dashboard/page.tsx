import MorningBrief from "@/components/admin/rcaptain/MorningBrief";
import PriorityQueue from "@/components/admin/rcaptain/PriorityQueue";
import OpportunityRadar from "@/components/admin/rcaptain/OpportunityRadar";
import TodaysMission from "@/components/admin/rcaptain/TodaysMission";
import FloatingCaptain from "@/components/admin/rcaptain/FloatingCaptain";

import { getDashboardData } from "@/lib/services/dashboard/dashboard.service";

export default async function AdminDashboardPage() {
  const dashboardData = await getDashboardData();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Page Header */}
        <MorningBrief
          data={dashboardData.rCaptain.morningBrief}
        />

        {/* Top Section */}
        <div className="mt-8 grid gap-8 xl:grid-cols-3">

          {/* Priority Queue */}
          <div className="xl:col-span-2">
            <PriorityQueue
              opportunities={dashboardData.rCaptain.priorityQueue}
            />
          </div>

          {/* Today's Mission */}
          <div>
            <TodaysMission
              missions={[
                {
                  title: "Calls",
                  completed:
                    dashboardData.rCaptain.todaysMission.calls.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.calls.total,
                  icon: "📞",
                  color: "bg-blue-500",
                },
                {
                  title: "WhatsApp",
                  completed:
                    dashboardData.rCaptain.todaysMission.whatsapp.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.whatsapp.total,
                  icon: "💬",
                  color: "bg-green-500",
                },
                {
                  title: "Quotations",
                  completed:
                    dashboardData.rCaptain.todaysMission.quotations.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.quotations.total,
                  icon: "📄",
                  color: "bg-purple-500",
                },
                {
                  title: "Meetings",
                  completed:
                    dashboardData.rCaptain.todaysMission.meetings.completed,
                  total:
                    dashboardData.rCaptain.todaysMission.meetings.total,
                  icon: "🤝",
                  color: "bg-orange-500",
                },
              ]}
            />
          </div>

        </div>

        {/* Opportunity Radar */}
        <div className="mt-8">
          <OpportunityRadar
            radar={[
              {
                title: "🔥 Ready to Close",
                value: `${dashboardData.rCaptain.opportunityRadar.readyToClose} Buyers`,
                insight:
                  "Buyers currently in negotiation are showing the strongest buying intent.",
                recommendation:
                  "Prioritize negotiations today.",
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "⚠ Going Cold",
                value: `${dashboardData.rCaptain.opportunityRadar.goingCold} Buyers`,
                insight:
                  "These buyers require immediate follow-up to prevent losing momentum.",
                recommendation:
                  "Contact them today via WhatsApp or call.",
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "💰 Highest Revenue",
                value:
                  dashboardData.rCaptain.opportunityRadar.highestRevenue,
                insight:
                  "Largest potential opportunity identified by R-CAPTAIN.",
                recommendation:
                  "Focus on the highest-value buyer first.",
                color: "from-violet-500 to-purple-600",
              },
            ]}
          />
        </div>

      </div>

      {/* Floating AI Assistant */}
      <FloatingCaptain
        status={{
          message: dashboardData.rCaptain.captain.status,
          lastUpdated: dashboardData.rCaptain.captain.lastUpdated,
        }}
      />
    </main>
  );
}