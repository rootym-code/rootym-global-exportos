import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({
  children,
  className = "",
  hover = true,
}: CardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-gray-200
        bg-white
        shadow-md
        transition-all
        duration-300
        ${
          hover
            ? "hover:-translate-y-2 hover:shadow-2xl hover:border-[#2E7D32]"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}