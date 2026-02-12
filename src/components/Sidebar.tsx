"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/topics", label: "Topics", icon: "📖" },
  { href: "/patterns", label: "Patterns", icon: "🧭" },
  { href: "/quiz", label: "Quiz", icon: "🎯" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 z-50 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-400 hover:text-white p-1.5 -ml-1"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
        <Link href="/" className="flex items-center gap-2 ml-3">
          <span className="text-xl">⚡</span>
          <span className="text-base font-bold text-white">AlgoPrep</span>
        </Link>
      </header>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="p-6 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <h1 className="text-lg font-bold text-white">AlgoPrep</h1>
              <p className="text-xs text-gray-500">DSA Interview Prep</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center">
            Keep grinding
          </p>
        </div>
      </aside>
    </>
  );
}
