"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Variant {
  id: string;
  size: string;
  quantityOnHand: number;
  product: {
    name: string;
  };
}

interface LineItem {
  variantId: string;
  quantity: number;
  unitPrice: string;
}

const CHANNELS = ["WEBSITE", "INSTAGRAM", "POPUP", "OTHER"] as const;

export function SaleForm({ variants }: { variants: Variant[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    channel: "OTHER" as (typeof CHANNELS)[number],
    customerName: "",
    email: "",
    notes: "",
  });
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { variantId: "", quantity: 1, unitPrice: "" },
  ]);

  const handleAddLine = () => {
    setLineItems([...lineItems, { variantId: "", quantity: 1, unitPrice: "" }]);
  };

  const handleRemoveLine = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const handleLineChange = (
    index: number,
    field: keyof LineItem,
    value: string | number
  ) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    setLineItems(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validLineItems = lineItems.filter((item) => item.variantId);
      if (validLineItems.length === 0) {
        alert("Please add at least one item");
        return;
      }

      const response = await fetch("/api/admin/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          lineItems: validLineItems.map((item) => ({
            variantId: item.variantId,
            quantity: parseInt(String(item.quantity)) || 1,
            unitPrice: item.unitPrice
              ? parseInt(item.unitPrice) * 100
              : null,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to record sale");
      }

      router.push("/admin/sales");
      router.refresh();
    } catch (error) {
      console.error("Sale error:", error);
      alert(error instanceof Error ? error.message : "Failed to record sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Record Sale</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Channel and Customer Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Channel
            </label>
            <select
              value={formData.channel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  channel: e.target.value as (typeof CHANNELS)[number],
                })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
            >
              {CHANNELS.map((ch) => (
                <option key={ch} value={ch}>
                  {ch}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Items
          </label>
          {lineItems.map((item, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-grow">
                <select
                  value={item.variantId}
                  onChange={(e) =>
                    handleLineChange(index, "variantId", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
                  required={index === 0}
                >
                  <option value="">Select item...</option>
                  {variants.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.product.name} - {v.size} ({v.quantityOnHand} avail)
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleLineChange(index, "quantity", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="Qty"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleLineChange(index, "unitPrice", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
                  placeholder="Price $"
                />
              </div>
              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveLine(index)}
                  className="px-2 py-2 text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddLine}
            className="text-sm text-black underline hover:no-underline"
          >
            + Add Item
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
            placeholder="Optional notes..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Recording..." : "Record Sale"}
        </button>
      </form>
    </div>
  );
}
