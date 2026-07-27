import MorningBrief from "@/components/admin/rcaptain/MorningBrief";
import PriorityQueue from "@/components/admin/rcaptain/PriorityQueue";
import OpportunityRadar from "@/components/admin/rcaptain/OpportunityRadar";
import TodaysMission from "@/components/admin/rcaptain/TodaysMission";
import FloatingCaptain from "@/components/admin/rcaptain/FloatingCaptain";

export default function AdminDashboardPage() {
  const dashboardData = {
    morningBrief: {
      greeting: "Good Morning",
      pendingAttention: 3,
      quotationsExpiring: 2,
      opportunityValue: "USD 34,000",
    },

    priorityQueue: [
      {
        id: 1,
        buyer: "ABC Foods",
        country: "🇱🇰 Sri Lanka",
        product: "Onion Powder",
        stage: "Negotiation",
        revenue: "USD 18,000",
        action: "Call Now",
        reason: "Buyer requested revised pricing.",
        aiScore: 98,
        confidence: "High Conversion Probability",
      },
      {
        id: 2,
        buyer: "Dubai Fresh",
        country: "🇦🇪 UAE",
        product: "Frozen French Fries",
        stage: "Sample Sent",
        revenue: "USD 12,500",
        action: "Send WhatsApp",
        reason: "Confirm sample delivery.",
        aiScore: 91,
        confidence: "Buyer Engagement Active",
      },
      {
        id: 3,
        buyer: "London Imports",
        country: "🇬🇧 United Kingdom",
        product: "Makhana",
        stage: "Quotation Sent",
        revenue: "USD 8,500",
        action: "Send Revised Quote",
        reason: "Quotation expires tomorrow.",
        aiScore: 87,
        confidence: "Follow-up Required",
      },
    ],

    opportunityRadar: [
      {
        title: "🔥 Ready to Close",
        value: "3 Buyers",
        insight:
          "ABC Foods and Dubai Fresh are showing strong buying signals based on recent interactions.",
        recommendation: "Schedule pricing discussions today.",
        color: "from-green-500 to-emerald-600",
      },
      {
        title: "⚠ Going Cold",
        value: "2 Buyers",
        insight:
          "No response has been received for more than 10 days from these buyers.",
        recommendation: "Send a personalized WhatsApp follow-up today.",
        color: "from-amber-500 to-orange-500",
      },
      {
        title: "💰 Highest Revenue",
        value: "USD 34,000",
        insight:
          "One successful negotiation today could generate your highest projected order value.",
        recommendation: "Prioritize pricing discussions with top buyers.",
        color: "from-violet-500 to-purple-600",
      },
    ],

    todaysMission: [
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
    ],

    captain: {
      message: "Pipeline analyzed",
      lastUpdated: "Just now",
    },
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
  
        {/* Page Header */}
        <MorningBrief data={dashboardData.morningBrief} />
  
        {/* Top Section */}
        <div className="mt-8 grid gap-8 xl:grid-cols-3">
  
          {/* Priority Queue */}
          <div className="xl:col-span-2">
            <PriorityQueue
              opportunities={dashboardData.priorityQueue}
            />
          </div>
  
          {/* Today's Mission */}
          <div>
            <TodaysMission
              missions={dashboardData.todaysMission}
            />
          </div>
  
        </div>
  
        {/* Opportunity Radar */}
        <div className="mt-8">
          <OpportunityRadar
            radar={dashboardData.opportunityRadar}
          />
        </div>
  
      </div>
  
      {/* Floating AI Assistant */}
      <FloatingCaptain
        status={dashboardData.captain}
      />
    </main>
  );
}