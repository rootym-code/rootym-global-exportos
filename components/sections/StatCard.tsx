interface StatCardProps {
    value: string;
    label: string;
  }
  
  export default function StatCard({
    value,
    label,
  }: StatCardProps) {
    return (
      <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
        <div className="text-5xl font-bold text-[#2E7D32]">
          {value}
        </div>
  
        <div className="mt-3 text-gray-600">
          {label}
        </div>
      </div>
    );
  }