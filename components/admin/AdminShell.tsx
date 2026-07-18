"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface AdminShellProps {
  children: React.ReactNode;
}

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Buyers",
    href: "/admin/buyers",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminShell({
  children,
}: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const pageTitle = useMemo(() => {
    const current = navigation.find((item) => item.href === pathname);
    return current?.title ?? "ROOTYM Admin";
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", {
        method: "POST",
      });
    } catch {
      // Ignore network errors and continue redirecting.
    }

    router.replace("/admin/login");
    router.refresh();
  }

  function Sidebar() {
    return (
      <>
        <div className="border-b border-green-700 px-8 py-7">
          <h1 className="text-2xl font-bold tracking-wide">
            ROOTYM
          </h1>

          <p className="mt-1 text-sm text-green-100">
            Admin Portal
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-white text-[#1B5E20]"
                    : "text-white hover:bg-green-700"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-green-700 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm transition hover:bg-green-700"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 flex-col bg-[#1B5E20] text-white lg:flex">
        <Sidebar />
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          />

          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1B5E20] text-white shadow-2xl lg:hidden">
            <Sidebar />
          </aside>
        </>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="rounded-lg border p-2 lg:hidden"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {pageTitle}
                </h2>

                <p className="text-sm text-slate-500">
                  ROOTYM Global Export Platform
                </p>
              </div>
            </div>

            <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
              Administrator
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}