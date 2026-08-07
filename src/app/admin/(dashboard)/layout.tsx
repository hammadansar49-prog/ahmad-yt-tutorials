import AdminSidebar from "./AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen text-white flex flex-col sm:flex-row">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-8">{children}</main>
    </div>
  );
}
