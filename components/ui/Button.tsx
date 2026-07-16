import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  // Base, premium, reusable style: ultra rounded, shadow, focus ring, smooth transition.
  const base =
    "inline-flex items-center justify-center rounded-3xl px-8 py-3 text-lg font-bold transition-all duration-200 shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none";

  // Accessible color contrasts and smooth hover.
  const variants = {
    primary:
      // Deep green gradient, premium glow, solid hover, high contrast.
      "bg-gradient-to-tr from-[#2E7D32] via-[#388E3C] to-[#43A047] text-white " +
      "hover:from-[#256B29] hover:to-[#378A37] hover:shadow-2xl " +
      "focus-visible:ring-green-500",
    secondary:
      // Outlined, premium accent, elegant filled-hover, accessible.
      "border-2 border-[#2E7D32] text-[#20732B] " +
      "bg-transparent hover:bg-[#e6f4ea] hover:border-[#378A37] hover:text-[#1C5E23] " +
      "focus-visible:ring-green-500",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      aria-pressed={props["aria-pressed"]}
      {...props}
    >
      <span className="flex items-center gap-2">{children}</span>
    </button>
  );
}