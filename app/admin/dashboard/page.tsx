import MorningBrief from "@/components/admin/rcaptain/MorningBrief";
import PriorityQueue from "@/components/admin/rcaptain/PriorityQueue";
import OpportunityRadar from "@/components/admin/rcaptain/OpportunityRadar";
import TodaysMission from "@/components/admin/rcaptain/TodaysMission";
import FloatingCaptain from "@/components/admin/rcaptain/FloatingCaptain";

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Page Header */}
        <MorningBrief />

        {/* Main Grid */}
        <div className="mt-8 grid gap-8 xl:grid-cols-3">

          {/* Left Content */}
          <div className="space-y-8 xl:col-span-2">
            <PriorityQueue />
            <OpportunityRadar />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <TodaysMission />
          </div>

        </div>

      </div>

      {/* Floating AI Assistant */}
      <FloatingCaptain />
    </main>
  );
}