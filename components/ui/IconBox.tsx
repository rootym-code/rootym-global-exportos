import { ReactNode } from "react";

interface IconBoxProps {
  children: ReactNode;
}

export default function IconBox({
  children,
}: IconBoxProps) {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-[#2E7D32] transition group-hover:bg-[#2E7D32] group-hover:text-white">
      {children}
    </div>
  );
}