/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides dedicated navigation for the ROOTYM AI
 *          public marketing website.
 *
 * Production:
 *   export.rootym.com
 *     → Marketing website
 *
 * SaaS:
 *   app.export.rootym.com/login
 *     → SaaS authentication
 *
 * The primary navbar CTA intentionally sends visitors directly
 * to the production SaaS login surface with explicit trial intent.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { AnimatePresence, motion } from "framer-motion";

import { ChevronDown, Menu, ShieldCheck, UserRound, X } from "lucide-react";

const ADMIN_LOGIN_URL = "https://app.export.rootym.com/admin/login";
const LOGIN_URL = "https://app.export.rootym.com/login";
const TRIAL_LOGIN_URL = "https://app.export.rootym.com/login?intent=trial";

const NAV_ITEMS = [
  { label: "Solutions", href: "#solutions" },
  { label: "Products", href: "#products" },
  { label: "Industries", href: "#industries" },
  { label: "About", href: "#about" },
  { label: "Technologies", href: "#technologies" },
  { label: "Why ROOTYM", href: "#why-rootym" },
];

export default function MarketingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen && !loginOpen) return;
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setLoginOpen(false);
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, loginOpen]);

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  return (
    <motion.nav
      id="navbar"
      role="navigation"
      aria-label="ROOTYM AI main navigation"
      initial={{
        y: -24,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={[
        "fixed inset-x-0 top-0 z-50 h-20 border-b",
        "backdrop-blur-xl transition-all duration-300",
        elevated
          ? "border-white/10 bg-slate-950/90 shadow-xl shadow-black/10"
          : "border-white/5 bg-slate-950/70",
      ].join(" ")}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Brand */}
        <Link
          href="#top"
          onClick={handleNavigation}
          aria-label="ROOTYM ExportOS Home"
          className="group flex items-center gap-3"
        >
          <motion.div
            whileHover={{
              scale: 1.06,
              rotate: -3,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 18,
            }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-lg font-black text-slate-950 shadow-lg shadow-emerald-500/10"
          >
            R
          </motion.div>

          <div className="leading-none">
            <span className="block text-xl font-extrabold tracking-wide text-white">
              ROOTYM ExportOS
            </span>

            <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Intelligent Technology
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {NAV_ITEMS.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{
                opacity: 0,
                y: -8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.05,
                duration: 0.3,
              }}
            >
              <Link
                href={item.href}
                className="group relative rounded-xl px-2.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <span className="relative z-10">
                  {item.label}
                </span>

                <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}

          {/* Authentication CTAs */}
          <div className="ml-3 flex items-center gap-2">
          <motion.div className="relative">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setLoginOpen((open) => !open)}
                aria-label="Choose login type"
                aria-expanded={loginOpen}
                aria-haspopup="true"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-slate-200 shadow-sm transition-all hover:border-emerald-400/40 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                LOGIN
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    loginOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {loginOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-full z-[60] mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-2 text-slate-900 shadow-2xl shadow-black/25"
                    role="menu"
                    aria-label="Login options"
                  >
                    <Link
                      href={ADMIN_LOGIN_URL}
                      role="menuitem"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-start gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                        <ShieldCheck className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">
                          Admin Login
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          Manage the ROOTYM ExportOS platform
                        </span>
                      </span>
                    </Link>

                    <div className="mx-3 border-t border-slate-100" />

                    <Link
                      href={LOGIN_URL}
                      role="menuitem"
                      onClick={() => setLoginOpen(false)}
                      className="flex items-start gap-3 rounded-xl px-3 py-3.5 transition-colors hover:bg-emerald-50 focus:bg-emerald-50 focus:outline-none"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                        <UserRound className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">
                          Customer Login
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-slate-500">
                          Access your customer account
                        </span>
                      </span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              <Link
                href={TRIAL_LOGIN_URL}
                className="group relative inline-flex overflow-hidden rounded-xl"
                aria-label="Start your ROOTYM ExportOS free trial"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500" />

                <span className="absolute -left-20 top-0 h-full w-16 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

                <span className="relative px-5 py-2.5 text-sm font-semibold text-white">
                  START FREE TRIAL
                </span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile toggle */}
        <motion.button
          type="button"
          whileTap={{
            scale: 0.9,
          }}
          whileHover={{
            scale: 1.05,
          }}
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={
            mobileOpen ? "Close menu" : "Open menu"
          }
          aria-expanded={mobileOpen}
          aria-controls="marketing-mobile-menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 lg:hidden"
        >
          <AnimatePresence
            mode="wait"
            initial={false}
          >
            {mobileOpen ? (
              <motion.span
                key="close"
                initial={{
                  rotate: -90,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: 90,
                  opacity: 0,
                }}
              >
                <X className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{
                  rotate: 90,
                  opacity: 0,
                }}
                animate={{
                  rotate: 0,
                  opacity: 1,
                }}
                exit={{
                  rotate: -90,
                  opacity: 0,
                }}
              >
                <Menu className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="marketing-mobile-menu"
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            className="border-b border-white/10 bg-slate-950/98 px-6 pb-6 shadow-2xl lg:hidden"
          >
            <nav
              className="mx-auto flex max-w-7xl flex-col gap-1 pt-3"
              aria-label="Mobile ROOTYM AI navigation"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavigation}
                  className="rounded-xl px-4 py-3.5 text-base font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile authentication actions */}
                      <Link
                href={ADMIN_LOGIN_URL}
                onClick={handleNavigation}
                className="mt-3 flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-white/[0.08] hover:text-white"
              >
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                Admin Login
              </Link>

              <Link
                href={LOGIN_URL}
                onClick={handleNavigation}
                className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/[0.04] px-5 py-3.5 font-semibold text-slate-200 transition hover:border-emerald-400/40 hover:bg-white/[0.08] hover:text-white"
              >
                <UserRound className="h-5 w-5 text-emerald-400" />
                Customer Login
              </Link>

              <Link
                href={TRIAL_LOGIN_URL}
                onClick={handleNavigation}
                className="flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/10"
              >
                START FREE TRIAL
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}