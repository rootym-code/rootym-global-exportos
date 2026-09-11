/**
 * ============================================================
 * ROOTYM Customer Workspace — R-CAPTAIN Insights
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the Website-scoped R-CAPTAIN Insights
 *          experience for the authenticated Customer Workspace.
 * ============================================================
 */

import AIProductivityScore from "@/components/admin/dashboard/AIProductivityScore";
import MorningBrief from "@/components/admin/rcaptain/MorningBrief";
import PriorityQueue from "@/components/admin/rcaptain/PriorityQueue";
import OpportunityRadar from "@/components/admin/rcaptain/OpportunityRadar";
import TodaysMission from "@/components/admin/rcaptain/TodaysMission";
import FloatingCaptain from "@/components/admin/rcaptain/FloatingCaptain";

import { requireWorkspaceAccess } from "@/app/lib/workspace/require-workspace-access";
import { getWorkspaceRCaptainData } from "@/app/lib/workspace/rcaptain/workspace-rcaptain.service";

export default async function WorkspaceRCaptainInsightsPage() {
  await requireWorkspaceAccess();

  const rCaptain = await getWorkspaceRCaptainData();

  return (
    <main className="min-h-full bg-gradient-to-br from-slate-50 via-white to-green-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-10">
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-800">
              Active
            </span>
            <span className="text-sm font-medium text-slate-500">
              R-CAPTAIN Customer Intelligence
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            R-CAPTAIN Insights
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500 sm:text-base">
            Website-scoped sales intelligence, daily mission tracking,
            productivity analysis, and opportunity recommendations for your
            Customer Workspace.
          </p>
        </section>

        <MorningBrief data={rCaptain.morningBrief} />

        <div className="mt-8 grid gap-8 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <PriorityQueue opportunities={rCaptain.priorityQueue} />
          </div>

          <div>
            <TodaysMission
              missions={[
                {
                  title: "Calls",
                  completed: rCaptain.todaysMission.calls.completed,
                  total: rCaptain.todaysMission.calls.total,
                  icon: "📞",
                  color: "bg-blue-500",
                },
                {
                  title: "WhatsApp",
                  completed: rCaptain.todaysMission.whatsapp.completed,
                  total: rCaptain.todaysMission.whatsapp.total,
                  icon: "💬",
                  color: "bg-green-500",
                },
                {
                  title: "Quotations",
                  completed: rCaptain.todaysMission.quotations.completed,
                  total: rCaptain.todaysMission.quotations.total,
                  icon: "📄",
                  color: "bg-purple-500",
                },
                {
                  title: "Meetings",
                  completed: rCaptain.todaysMission.meetings.completed,
                  total: rCaptain.todaysMission.meetings.total,
                  icon: "🤝",
                  color: "bg-orange-500",
                },
              ]}
            />
          </div>
        </div>

        <div className="mt-8">
          <AIProductivityScore data={rCaptain.productivity} />
        </div>

        <div className="mt-8">
          <OpportunityRadar
            radar={[
              {
                title: "🔥 Ready to Close",
                value: `${rCaptain.opportunityRadar.readyToClose} Buyers`,
                insight:
                  "Buyers currently in negotiation are showing the strongest buying intent.",
                recommendation: "Prioritize negotiations today.",
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "⚠ Going Cold",
                value: `${rCaptain.opportunityRadar.goingCold} Buyers`,
                insight:
                  "These buyers require immediate follow-up to prevent losing momentum.",
                recommendation:
                  "Contact them today via WhatsApp or call.",
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "💰 Highest Revenue",
                value: rCaptain.opportunityRadar.highestRevenue,
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

      <FloatingCaptain data={rCaptain} />
    </main>
  );
}
