"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts, getProductTypes, filterProducts } from "@/lib/products";

export default function ShopPage() {
  const allProducts = getAllProducts();
  const productTypes = getProductTypes();

  const [selectedType, setSelectedType] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState<
    "all" | "in-stock" | "sold-out"
  >("all");

  const filteredProducts = useMemo(() => {
    return filterProducts({
      type: selectedType,
      availability: selectedAvailability,
    });
  }, [selectedType, selectedAvailability]);

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-page-title mb-4">
            The Collection
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Handcrafted in Bangkok. Each shirt made to order.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-gray-200 sticky top-16 md:top-20 bg-white z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}
              <div className="flex items-center gap-2">
                <label htmlFor="type-filter" className="text-sm text-gray-600">
                  Type:
                </label>
                <select
                  id="type-filter"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 text-sm focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="all">All Types</option>
                  {productTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Filter */}
              <div className="flex items-center gap-2">
                <label
                  htmlFor="availability-filter"
                  className="text-sm text-gray-600"
                >
                  Availability:
                </label>
                <select
                  id="availability-filter"
                  value={selectedAvailability}
                  onChange={(e) =>
                    setSelectedAvailability(
                      e.target.value as "all" | "in-stock" | "sold-out"
                    )
                  }
                  className="px-3 py-1.5 border border-gray-300 text-sm focus:border-black focus:ring-1 focus:ring-black"
                >
                  <option value="all">All</option>
                  <option value="in-stock">In Stock</option>
                  <option value="sold-out">Sold Out</option>
                </select>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                No products match your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedAvailability("all");
                }}
                className="mt-4 text-accent hover:underline"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
