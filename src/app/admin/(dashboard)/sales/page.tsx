import { Metadata } from "next";
import prisma from "@/lib/db";
import Link from "next/link";
import { SaleForm } from "@/components/admin/SaleForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sales",
};

export default async function SalesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  const showNewForm = params.new === "1";

  const sales = await prisma.sale.findMany({
    include: {
      lineItems: {
        include: {
          variant: {
            include: {
              product: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  const variants = await prisma.variant.findMany({
    include: {
      product: true,
    },
    where: {
      quantityOnHand: { gt: 0 },
    },
    orderBy: [
      { product: { name: "asc" } },
      { size: "asc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <Link
          href={showNewForm ? "/admin/sales" : "/admin/sales?new=1"}
          className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {showNewForm ? "Cancel" : "Record Sale"}
        </Link>
      </div>

      {showNewForm && <SaleForm variants={variants} />}

      <div className="bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((sale) => {
                const totalQty = sale.lineItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                return (
                  <tr key={sale.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.channel}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {sale.lineItems.slice(0, 2).map((item) => (
                          <div key={item.id} className="text-gray-900">
                            {item.variant.product.name} ({item.variant.size}) x
                            {item.quantity}
                          </div>
                        ))}
                        {sale.lineItems.length > 2 && (
                          <div className="text-gray-500">
                            +{sale.lineItems.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {sale.customerName || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right">
                      {sale.total ? `$${sale.total / 100}` : `${totalQty} items`}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
