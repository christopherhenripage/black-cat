import { Metadata } from "next";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductEditForm } from "@/components/admin/ProductEditForm";
import { VariantManager } from "@/components/admin/VariantManager";

export const metadata: Metadata = {
  title: "Edit Product",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: { size: "asc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/products"
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            &larr; Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {product.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Details */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Details
          </h2>
          <ProductEditForm product={product} />
        </div>

        {/* Variants */}
        <div className="bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Variants & Inventory
          </h2>
          <VariantManager productId={product.id} variants={product.variants} />
        </div>
      </div>
    </div>
  );
}
