"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProductActions({ productId }: { productId: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product and all its variants?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 justify-end">
      <Link
        href={`/admin/products/${productId}`}
        className="text-sm text-gray-600 hover:text-black transition-colors"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-sm text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
      >
        {isDeleting ? "..." : "Delete"}
      </button>
    </div>
  );
}
