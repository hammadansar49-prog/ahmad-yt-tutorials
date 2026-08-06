import Link from "next/link";
import { logoutAction } from "@/lib/auth-actions";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white flex">
      <aside className="w-56 shrink-0 border-r border-white/10 bg-[#0a1030]/85 backdrop-blur flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="font-extrabold text-sm">
            Ahmad <span className="text-[#ff6a3d]">YT</span> Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/videos"
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            Tutorials
          </Link>
          <Link
            href="/admin/videos/new"
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            Add New Tutorial
          </Link>
          <Link
            href="/admin/categories"
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            Categories
          </Link>
          <Link
            href="/admin/settings"
            className="block rounded-lg px-3 py-2 text-white/70 hover:bg-white/5 hover:text-white transition"
          >
            About &amp; Contact Settings
          </Link>
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

      <main className="flex-1 min-w-0 p-6 sm:p-8">{children}</main>
    </div>
  );
}
