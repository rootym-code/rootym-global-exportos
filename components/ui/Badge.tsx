interface BadgeProps {
    children: React.ReactNode;
    color?: "green" | "blue" | "yellow" | "gray";
  }
  
  export default function Badge({
    children,
    color = "green",
  }: BadgeProps) {
    const styles = {
      green:
        "bg-green-100 text-[#2E7D32]",
  
      blue:
        "bg-blue-100 text-blue-700",
  
      yellow:
        "bg-yellow-100 text-yellow-700",
  
      gray:
        "bg-gray-100 text-gray-700",
    };
  
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[color]}`}
      >
        {children}
      </span>
    );
  }