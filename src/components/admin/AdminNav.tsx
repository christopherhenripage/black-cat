"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/variants", label: "Inventory" },
  { href: "/admin/sales", label: "Sales" },
  { href: "/admin/requests", label: "Requests" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-bold text-lg">
              Black Cat Admin
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm transition-colors ${
                    pathname === item.href
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
              target="_blank"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {isLoggingOut ? "..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile nav */}
      <nav className="md:hidden border-t border-gray-800 px-4 py-2 flex flex-wrap gap-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm ${
              pathname === item.href
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
