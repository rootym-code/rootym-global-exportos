"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Package,
  Users,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    label: "Quotes",
    href: "/admin/quotes",
    icon: FileText,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Buyers",
    href: "/admin/buyers",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-green-900 text-white flex flex-col">
      <div className="px-8 py-10 border-b border-green-800">
        <h1 className="text-5xl font-bold">ROOTYM</h1>
        <p className="mt-2 text-green-100 text-lg">
          Admin Portal
        </p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center gap-4 rounded-xl px-5 py-4 transition-all",
                active
                  ? "bg-white text-green-900 shadow-md"
                  : "text-white hover:bg-green-800",
              ].join(" ")}
            >
              <Icon className="h-6 w-6" />
              <span className="text-lg font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}