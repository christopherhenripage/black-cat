import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin",
    default: "Admin | Black Cat Button Down",
  },
  robots: "noindex, nofollow",
};

// Root admin layout - just provides metadata
// Authentication is handled by the (dashboard) route group layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
