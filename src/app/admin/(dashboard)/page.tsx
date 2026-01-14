import { Metadata } from "next";
import prisma from "@/lib/db";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
};

async function getMetrics() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Total inventory
  const inventoryStats = await prisma.variant.aggregate({
    _sum: {
      quantityOnHand: true,
      quantityReserved: true,
      quantitySold: true,
    },
  });

  // Sales in last 30 days
  const recentSales = await prisma.saleItem.aggregate({
    where: {
      createdAt: { gte: thirtyDaysAgo },
    },
    _sum: {
      quantity: true,
    },
  });

  // All time sales
  const allTimeSales = await prisma.saleItem.aggregate({
    _sum: {
      quantity: true,
    },
  });

  // Top 5 products by units sold
  const topProducts = await prisma.variant.findMany({
    where: {
      quantitySold: { gt: 0 },
    },
    include: {
      product: true,
    },
    orderBy: {
      quantitySold: "desc",
    },
    take: 5,
  });

  // Oldest inventory (items in stock longest)
  const oldestInventoryRaw = await prisma.variant.findMany({
    where: {
      quantityOnHand: { gt: 0 },
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 5,
  });

  // Calculate age in days on the server
  const oldestInventory = oldestInventoryRaw.map((variant) => ({
    ...variant,
    ageDays: Math.floor(
      (now.getTime() - new Date(variant.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }));

  // Recent order requests
  const newRequests = await prisma.orderRequest.count({
    where: {
      status: "NEW",
    },
  });

  const totalOnHand = inventoryStats._sum.quantityOnHand || 0;
  const totalReserved = inventoryStats._sum.quantityReserved || 0;
  const totalSold = inventoryStats._sum.quantitySold || 0;
  const soldLast30Days = recentSales._sum.quantity || 0;
  const soldAllTime = allTimeSales._sum.quantity || 0;
  const sellThrough =
    totalSold + totalOnHand > 0
      ? Math.round((totalSold / (totalSold + totalOnHand)) * 100)
      : 0;

  return {
    totalOnHand,
    totalReserved,
    totalSold,
    soldLast30Days,
    soldAllTime,
    sellThrough,
    topProducts,
    oldestInventory,
    newRequests,
  };
}

export default async function AdminDashboard() {
  const metrics = await getMetrics();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        {metrics.newRequests > 0 && (
          <Link
            href="/admin/requests"
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-colors"
          >
            {metrics.newRequests} New Request{metrics.newRequests > 1 ? "s" : ""}
          </Link>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          label="On Hand"
          value={metrics.totalOnHand}
          sublabel="units available"
        />
        <MetricCard
          label="Reserved"
          value={metrics.totalReserved}
          sublabel="units held"
        />
        <MetricCard
          label="Sold (30 days)"
          value={metrics.soldLast30Days}
          sublabel="units"
        />
        <MetricCard
          label="Sell-Through"
          value={`${metrics.sellThrough}%`}
          sublabel="sold / (sold + on-hand)"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Top Products (by units sold)
          </h2>
          {metrics.topProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">No sales recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {metrics.topProducts.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {variant.product.name}
                    </p>
                    <p className="text-sm text-gray-500">Size {variant.size}</p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {variant.quantitySold}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Oldest Inventory */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Inventory Aging
          </h2>
          {metrics.oldestInventory.length === 0 ? (
            <p className="text-gray-500 text-sm">No inventory on hand.</p>
          ) : (
            <div className="space-y-3">
              {metrics.oldestInventory.map((variant) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {variant.product.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Size {variant.size} ({variant.quantityOnHand} on hand)
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {variant.ageDays} days
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/sales?new=1"
            className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Record Sale
          </Link>
          <Link
            href="/admin/products?new=1"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Add Product
          </Link>
          <Link
            href="/admin/variants"
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Adjust Inventory
          </Link>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sublabel,
}: {
  label: string;
  value: number | string;
  sublabel: string;
}) {
  return (
    <div className="bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{sublabel}</p>
    </div>
  );
}
