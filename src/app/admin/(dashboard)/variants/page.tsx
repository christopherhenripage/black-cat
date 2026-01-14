import { Metadata } from "next";
import prisma from "@/lib/db";
import { InventoryTable } from "@/components/admin/InventoryTable";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function InventoryPage() {
  const variants = await prisma.variant.findMany({
    include: {
      product: true,
    },
    orderBy: [
      { product: { name: "asc" } },
      { size: "asc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
      </div>

      <div className="bg-white shadow-sm">
        <InventoryTable variants={variants} />
      </div>
    </div>
  );
}
