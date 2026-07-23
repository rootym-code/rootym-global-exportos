"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import FloatingProvider from "./FloatingProvider";

interface PublicFloatingProviderProps {
  children: ReactNode;
}

export default function PublicFloatingProvider({
  children,
}: PublicFloatingProviderProps) {
  const pathname = usePathname();

  // Never show the public R-CAPTAIN on admin routes.
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return <FloatingProvider>{children}</FloatingProvider>;
}

 