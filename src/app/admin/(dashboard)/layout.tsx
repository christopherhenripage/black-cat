import { requireAuth } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  const isDatabasePersistent = !!process.env.DATABASE_URL?.includes("postgresql");

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNav />
      {!isDatabasePersistent && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 text-center text-sm text-yellow-800">
          Using SQLite database. Data may not persist reliably on serverless.{" "}
          <a href="/admin/settings" className="underline">
            Learn more
          </a>
        </div>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
