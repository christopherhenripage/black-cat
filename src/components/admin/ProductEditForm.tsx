"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
}

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    slug: product.slug,
    type: product.type,
    description: product.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <input
          type="text"
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
