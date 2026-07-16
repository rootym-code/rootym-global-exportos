"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";

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

  // Close on outside click (mobile menu)
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

  // Trap focus while mobile menu open
  useEffect(() => {
    if (!mobileOpen) return;
    const focusableElements =
      menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      ) || [];
    if (focusableElements.length > 0) focusableElements[0].focus();

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
      if (e.key === "Escape") setMobileOpen(false);
    }
    window.addEventListener("keydown", onTab);
    return () => window.removeEventListener("keydown", onTab);
  }, [mobileOpen]);

  return (
    <nav
      id="navbar"
      className={classNames(
        "sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 transition-shadow",
        "h-20",
        elevated ? "shadow-lg" : "shadow-none"
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl xl:max-w-[1280px] mx-auto flex items-stretch justify-between px-6 h-full">
        {/* Left: Brand */}
        <Link
          href="/"
          className="flex flex-col justify-center gap-0 group select-none focus:outline-none"
          aria-label="ROOTYM Home"
        >
          <div className="flex items-center gap-2">
            {/* Logo Placeholder */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
              {/* Could replace with real logo */}
              <span className="text-xl select-none">R</span>
            </div>
            <span className="text-2xl font-extrabold text-[#2E7D32] tracking-wider">
              ROOTYM
            </span>
          </div>
          <span className="text-xs text-gray-500 font-medium leading-tight mt-1 ml-10">
            Global Export Platform
          </span>
        </Link>
        {/* Right: Menu */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:text-[#2E7D32] hover:bg-[#F1F6F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300 transition-all"
              >
                {item.label}
              </Link>
            ))}
            <Button
              variant="primary"
              className="ml-3 px-6 py-2 text-base shadow-sm"
            >
              Request Quote
            </Button>
          </div>
          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-xl hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
            aria-label="Open Menu"
            aria-controls="navbar-mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            type="button"
          >
            <Menu className="w-7 h-7 text-[#2E7D32]" aria-hidden="true" />
          </button>
        </div>
        {/* Mobile Drawer */}
        {mobileOpen && (
          <div
            ref={menuRef}
            id="navbar-mobile-menu"
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 bg-black/30 flex lg:hidden"
          >
            {/* Slide-in menu panel */}
            <div className="w-[75vw] max-w-xs min-w-[230px] bg-white h-full shadow-2xl flex flex-col py-6 px-6 relative animate-slideInRight transition-transform">
              {/* Close */}
              <button
                className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                aria-label="Close Menu"
                type="button"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-6 h-6 text-[#2E7D32]" />
              </button>
              {/* Brand */}
              <Link
                href="/"
                className="flex items-center gap-2 mb-8 mt-2 focus:outline-none"
                onClick={() => setMobileOpen(false)}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2E7D32] to-[#43A047] flex items-center justify-center text-white font-extrabold">
                  R
                </div>
                <span className="text-xl font-extrabold text-[#2E7D32]">
                  ROOTYM
                </span>
              </Link>
              {/* Menu items */}
              <nav className="flex flex-col gap-2 mt-2" aria-label="Mobile Menu">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-3 text-base font-medium rounded-lg text-gray-700 hover:text-[#2E7D32] hover:bg-[#F1F6F3] focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Button
                  variant="primary"
                  className="mt-5 w-full text-base px-6 py-2"
                  onClick={() => setMobileOpen(false)}
                  tabIndex={0}
                >
                  Request Quote
                </Button>
              </nav>
            </div>
            {/* Background is trap, click to close */}
            <div
              className="flex-1"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setMobileOpen(false)}
            />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;