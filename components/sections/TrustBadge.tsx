interface TrustBadgeProps {
    text: string;
  }
  
  export default function TrustBadge({ text }: TrustBadgeProps) {
    return (
      <div className="flex items-center rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
        <span className="mr-3 text-xl text-[#2E7D32]">✓</span>
  
        <span className="font-medium text-gray-800">
          {text}
        </span>
      </div>
    );
  }