/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides dedicated navigation for the ROOTYM AI
 *          public marketing website.
 * ============================================================
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

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
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () =>
      window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

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
        <div className="hidden items-center gap-1 lg:flex">
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
                className="group relative rounded-xl px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <span className="relative z-10">
                  {item.label}
                </span>

                <span className="absolute inset-0 rounded-xl bg-white/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </motion.div>
          ))}

          {/* Primary CTA */}
          <motion.div
            className="ml-3"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="#contact"
              className="group relative inline-flex overflow-hidden rounded-xl"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-cyan-500" />

              <span className="absolute -left-20 top-0 h-full w-16 -skew-x-12 bg-white/20 transition-all duration-700 group-hover:left-[120%]" />

              <span className="relative px-5 py-2.5 text-sm font-semibold text-white">
                Book a Demo
              </span>
            </Link>
          </motion.div>
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

              <Link
                href="#contact"
                onClick={handleNavigation}
                className="mt-3 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-3.5 font-semibold text-white"
              >
                Book a Demo
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}