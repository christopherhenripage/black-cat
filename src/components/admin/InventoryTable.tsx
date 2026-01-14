"use client";

import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  size: string;
  color: string | null;
  quantityOnHand: number;
  quantityReserved: number;
  quantitySold: number;
  product: {
    name: string;
    slug: string;
  };
}

export function InventoryTable({ variants }: { variants: Variant[] }) {
  const router = useRouter();

  const handleAdjust = async (
    variantId: string,
    field: "quantityOnHand" | "quantityReserved",
    delta: number
  ) => {
    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, delta }),
      });

      if (!response.ok) {
        throw new Error("Failed to adjust quantity");
      }

      router.refresh();
    } catch (error) {
      console.error("Adjust error:", error);
      alert("Failed to adjust quantity");
    }
  };

  if (variants.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No inventory yet. Add products and variants to get started.
      </div>
    );
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Product
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Size
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            On Hand
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Reserved
          </th>
          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            Sold
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {variants.map((variant) => (
          <tr key={variant.id}>
            <td className="px-6 py-4">
              <p className="font-medium text-gray-900">{variant.product.name}</p>
              {variant.color && (
                <p className="text-sm text-gray-500">{variant.color}</p>
              )}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">{variant.size}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleAdjust(variant.id, "quantityOnHand", -1)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">
                  {variant.quantityOnHand}
                </span>
                <button
                  onClick={() => handleAdjust(variant.id, "quantityOnHand", 1)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  +
                </button>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handleAdjust(variant.id, "quantityReserved", -1)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">
                  {variant.quantityReserved}
                </span>
                <button
                  onClick={() => handleAdjust(variant.id, "quantityReserved", 1)}
                  className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  +
                </button>
              </div>
            </td>
            <td className="px-6 py-4 text-center text-sm text-gray-500">
              {variant.quantitySold}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
