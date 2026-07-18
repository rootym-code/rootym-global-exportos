"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Navigation items
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Why ROOTYM", href: "/why-rootym" },
  { label: "Export Services", href: "/services" },
  { label: "Quality", href: "/quality" },
  { label: "Global Markets", href: "/markets" },
  { label: "Contact", href: "/contact" },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Soft shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setElevated(window.scrollY > 4);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;

    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }

    window.addEventListener("mousedown", handleClick);

    return () => window.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Trap focus
  useEffect(() => {
    if (!mobileOpen) return;

    const focusableElements =
      menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      ) || [];

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    function onTab(e: KeyboardEvent) {
      if (!menuRef.current) return;

      const elements = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])'
        )
      );

      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    }

    window.addEventListener("keydown", onTab);

    return () => window.removeEventListener("keydown", onTab);
  }, [mobileOpen]);

  return (
    <motion.nav
      id="navbar"
      role="navigation"
      aria-label="Main navigation"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={classNames(
        "sticky top-0 z-40 w-full backdrop-blur-md border-b border-gray-100 transition-all duration-300",
        "h-20",
        elevated
          ? "bg-white/95 shadow-xl"
          : "bg-white/80 shadow-none"
      )}
    >
      <div className="max-w-7xl xl:max-w-[1280px] mx-auto flex items-stretch justify-between px-6 h-full">
        {/* Brand */}
        <Link
          href="/"
          aria-label="ROOTYM Home"
          className="flex flex-col justify-center gap-0 group select-none focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{
                scale: 1.08,
                rotate: -4,
              }}
              transition={{
                type: "spring",
                stiffness: 450,
                damping: 18,
              }}
              className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-bold shadow-md"
            >
              <span className="text-xl select-none">R</span>
            </motion.div>

            <motion.span
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2 }}
              className="text-2xl font-extrabold text-[#2E7D32] tracking-wider"
            >
              ROOTYM
            </motion.span>
          </div>

          <span className="text-xs text-gray-500 font-medium leading-tight mt-1 ml-10">
            Global Export Platform
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_ITEMS.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.35,
                }}
              >
                <Link
                  href={item.href}
                  className="relative px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:text-[#2E7D32] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                >
                  <motion.span
                    whileHover={{ y: -1 }}
                    className="relative z-10"
                  >
                    {item.label}
                  </motion.span>

                  <motion.span
                    className="absolute inset-0 rounded-xl bg-[#F1F6F3]"
                    initial={{ scale: 0.85, opacity: 0 }}
                    whileHover={{
                      scale: 1,
                      opacity: 1,
                    }}
                    transition={{ duration: 0.18 }}
                  />
                </Link>
              </motion.div>
            ))}

            <motion.div
              whileHover={{
                scale: 1.03,
                y: -1,
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                variant="primary"
                className="ml-3 px-6 py-2 text-base shadow-sm"
              >
                Request Quote
              </Button>
            </motion.div>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            className="lg:hidden flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            aria-label="Open Menu"
            aria-controls="navbar-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-7 h-7 text-[#2E7D32]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-7 h-7 text-[#2E7D32]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="navbar-mobile-menu"
              role="dialog"
              aria-modal="true"
              ref={menuRef}
              className="fixed inset-0 z-50 flex lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Overlay */}
              <motion.div
                className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{
                  type: "spring",
                  stiffness: 340,
                  damping: 32,
                }}
                className="relative w-[75vw] max-w-xs min-w-[230px] bg-white h-full shadow-2xl flex flex-col py-6 px-6"
              >
                <button
                  className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                  aria-label="Close Menu"
                  type="button"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="w-6 h-6 text-[#2E7D32]" />
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-2 mb-8 mt-2"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-extrabold">
                    R
                  </div>

                  <span className="text-xl font-extrabold text-[#2E7D32]">
                    ROOTYM
                  </span>
                </Link>

                <nav
                  className="flex flex-col gap-2 mt-2"
                  aria-label="Mobile Menu"
                >
                  {NAV_ITEMS.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{
                        opacity: 0,
                        x: -25,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      transition={{
                        delay: index * 0.05,
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-[#2E7D32] hover:bg-[#F1F6F3] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="primary"
                      className="mt-5 w-full text-base px-6 py-2"
                      onClick={() => setMobileOpen(false)}
                    >
                      Request Quote
                    </Button>
                  </motion.div>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;