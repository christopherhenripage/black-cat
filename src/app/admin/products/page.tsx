import { Metadata } from "next";
import prisma from "@/lib/db";
import Link from "next/link";
import { ProductActions } from "@/components/admin/ProductActions";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const params = await searchParams;
  const showNewForm = params.new === "1";

  const products = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href={showNewForm ? "/admin/products" : "/admin/products?new=1"}
          className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          {showNewForm ? "Cancel" : "Add Product"}
        </Link>
      </div>

      {showNewForm && <NewProductForm />}

      <div className="bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Variants
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Stock
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products yet.{" "}
                  <Link href="/admin/products?new=1" className="text-black underline">
                    Add your first product
                  </Link>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const totalStock = product.variants.reduce(
                  (sum, v) => sum + v.quantityOnHand,
                  0
                );
                return (
                  <tr key={product.id}>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.variants.length}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {totalStock}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ProductActions productId={product.id} />
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

function NewProductForm() {
  return (
    <div className="bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">New Product</h2>
      <form action="/api/admin/products" method="POST" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
              placeholder="e.g., Penang, Purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              required
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
              placeholder="e.g., penang-purple"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <input
              type="text"
              name="type"
              defaultValue="button-down"
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 focus:border-black focus:ring-1 focus:ring-black text-sm"
              placeholder="Product description..."
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
