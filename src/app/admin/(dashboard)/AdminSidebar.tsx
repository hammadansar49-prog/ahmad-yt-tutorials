"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth-actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/analytics", label: "Analytics (Live)" },
  { href: "/admin/videos", label: "Tutorials" },
  { href: "/admin/videos/new", label: "Add New Tutorial" },
  { href: "/admin/comments", label: "Comments" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/settings", label: "About & Contact Settings" },
  { href: "/admin/legal", label: "Disclaimer & Privacy Policy" },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sm:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/10 bg-[#0a1030]/90 backdrop-blur">
        <span className="font-extrabold text-sm">
          Ahmad <span className="text-[#ff6a3d]">YT</span> Admin
        </span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-white/80 hover:text-white transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      {open && (
        <div
          className="sm:hidden fixed inset-0 z-40 bg-black/60"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`w-64 sm:w-56 shrink-0 border-r border-white/10 bg-[#0a1030]/95 sm:bg-[#0a1030]/85 backdrop-blur flex flex-col fixed sm:static inset-y-0 left-0 z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          <span className="font-extrabold text-sm">
            Ahmad <span className="text-[#ff6a3d]">YT</span> Admin
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="sm:hidden w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/70 hover:text-white transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-3 py-2 transition ${
                pathname === link.href
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="block rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            View Website ↗
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full text-left rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-white/5 transition"
            >
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
