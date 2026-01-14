"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  size: string;
  color: string | null;
  sku: string | null;
  price: number | null;
  cost: number | null;
  quantityOnHand: number;
  quantityReserved: number;
  quantitySold: number;
}

export function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVariant, setNewVariant] = useState({
    size: "",
    color: "",
    sku: "",
    price: "",
    cost: "",
    quantityOnHand: "0",
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleAddVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);

    try {
      const response = await fetch("/api/admin/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          size: newVariant.size,
          color: newVariant.color || null,
          sku: newVariant.sku || null,
          price: newVariant.price ? parseInt(newVariant.price) * 100 : null,
          cost: newVariant.cost ? parseInt(newVariant.cost) * 100 : null,
          quantityOnHand: parseInt(newVariant.quantityOnHand) || 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add variant");
      }

      setNewVariant({
        size: "",
        color: "",
        sku: "",
        price: "",
        cost: "",
        quantityOnHand: "0",
      });
      setShowAddForm(false);
      router.refresh();
    } catch (error) {
      console.error("Add variant error:", error);
      alert("Failed to add variant");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAdjustQuantity = async (
    variantId: string,
    field: "quantityOnHand" | "quantityReserved" | "quantitySold",
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

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant?")) return;

    try {
      const response = await fetch(`/api/admin/variants/${variantId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete variant");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete variant");
    }
  };

  return (
    <div className="space-y-4">
      {variants.length === 0 ? (
        <p className="text-sm text-gray-500">No variants yet.</p>
      ) : (
        <div className="space-y-3">
          {variants.map((variant) => (
            <div
              key={variant.id}
              className="border border-gray-200 p-3 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Size {variant.size}</span>
                  {variant.color && (
                    <span className="text-gray-500 ml-2">{variant.color}</span>
                  )}
                  {variant.sku && (
                    <span className="text-xs text-gray-400 ml-2">
                      SKU: {variant.sku}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDeleteVariant(variant.id)}
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">On Hand</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleAdjustQuantity(variant.id, "quantityOnHand", -1)
                      }
                      className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {variant.quantityOnHand}
                    </span>
                    <button
                      onClick={() =>
                        handleAdjustQuantity(variant.id, "quantityOnHand", 1)
                      }
                      className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reserved</p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleAdjustQuantity(variant.id, "quantityReserved", -1)
                      }
                      className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium">
                      {variant.quantityReserved}
                    </span>
                    <button
                      onClick={() =>
                        handleAdjustQuantity(variant.id, "quantityReserved", 1)
                      }
                      className="w-6 h-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sold</p>
                  <p className="font-medium">{variant.quantitySold}</p>
                </div>
              </div>

              {(variant.price || variant.cost) && (
                <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
                  {variant.price && <span>Price: ${variant.price / 100}</span>}
                  {variant.cost && (
                    <span className="ml-3">Cost: ${variant.cost / 100}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showAddForm ? (
        <form
          onSubmit={handleAddVariant}
          className="border border-gray-300 p-3 space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Size *
              </label>
              <input
                type="text"
                value={newVariant.size}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, size: e.target.value })
                }
                required
                placeholder="e.g., M, L, XL"
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Color
              </label>
              <input
                type="text"
                value={newVariant.color}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, color: e.target.value })
                }
                placeholder="Optional"
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                value={newVariant.price}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, price: e.target.value })
                }
                placeholder="e.g., 20"
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Qty On Hand
              </label>
              <input
                type="number"
                value={newVariant.quantityOnHand}
                onChange={(e) =>
                  setNewVariant({ ...newVariant, quantityOnHand: e.target.value })
                }
                className="w-full px-2 py-1 border border-gray-300 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isAdding}
              className="px-3 py-1 bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Variant"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-gray-600 text-sm hover:text-black"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="text-sm text-black underline hover:no-underline"
        >
          + Add Variant
        </button>
      )}
    </div>
  );
}
