/**
 * ============================================================
 * ROOTYM ExportOS
 * ============================================================
 * Author: Prem Singh
 * Purpose: Provides the public ROOTYM AI marketing website
 *          footer and section navigation.
 *
 * Primary conversion:
 *   BOOK A DEMO
 *     → https://app.export.rootym.com/login
 * ============================================================
 */

import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
} from "lucide-react";

const SAAS_LOGIN_URL = "https://app.export.rootym.com/login";

const solutionLinks = [
  {
    label: "Solutions",
    href: "#solutions",
  },
  {
    label: "Products",
    href: "#products",
  },
  {
    label: "Industries",
    href: "#industries",
  },
];

const companyLinks = [
  {
    label: "About",
    href: "#about",
  },
  {
    label: "Technologies",
    href: "#technologies",
  },
  {
    label: "Why ROOTYM",
    href: "#why-rootym",
  },
  {
    label: "Contact",
    href: "#contact",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 px-6 pb-8 pt-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <Link
              href="#top"
              className="inline-flex items-center gap-2"
              aria-label="ROOTYM AI home"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-lg font-black text-slate-950">
                R
              </span>

              <span className="text-xl font-bold tracking-wide">
                ROOTYM AI
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
              AI-powered software, intelligent automation and
              modern business platforms designed to help
              organizations operate smarter and grow faster.
            </p>

            <a
              href="mailto:prem@rootym.com"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-emerald-400"
            >
              <Mail className="h-4 w-4 text-emerald-400" />
              sales@rootym.com
            </a>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
              Explore
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {solutionLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
              Company
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-slate-400 transition hover:text-emerald-400"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-300">
              Start a conversation
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-400">
              Have an AI, automation or software challenge?
              Let's discuss what you want to build.
            </p>

            <a
              href={SAAS_LOGIN_URL}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"
              aria-label="Book a demo with ROOTYM ExportOS"
            >
              BOOK A DEMO

              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} ROOTYM AI. All rights reserved.
          </p>

          <p>
            Intelligent technology for modern business.
          </p>
        </div>
      </div>
    </footer>
  );
}