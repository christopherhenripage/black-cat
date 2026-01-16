"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { Product } from "@/types/product";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const availableSizes = product.variants.filter((v) => v.available);
  const hasAvailableSizes = availableSizes.length > 0;

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      productSlug: product.slug,
      productName: product.name,
      size: selectedSize,
      quantity,
      price: product.price || 0,
      image: product.images[0]?.src || "/images/placeholder.svg",
    });

    // Show confirmation
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);

    // Reset form
    setSelectedSize("");
    setQuantity(1);
  };

  if (!hasAvailableSizes) {
    return (
      <div className="space-y-4">
        <p className="text-red-600 font-medium">Currently Sold Out</p>
        <p className="text-sm text-gray-500">
          Check back soon or contact us to be notified when this item is back in stock.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Size</label>
        <div className="flex flex-wrap gap-2">
          {product.variants.map((variant) => (
            <button
              key={variant.size}
              type="button"
              onClick={() => variant.available && setSelectedSize(variant.size)}
              disabled={!variant.available}
              className={`px-4 py-2 border text-sm font-medium transition-colors ${
                selectedSize === variant.size
                  ? "border-black bg-black text-white"
                  : variant.available
                  ? "border-gray-300 hover:border-black"
                  : "border-gray-200 text-gray-300 cursor-not-allowed line-through"
              }`}
            >
              {variant.size}
            </button>
          ))}
        </div>
        {!selectedSize && (
          <p className="text-sm text-gray-500 mt-2">Select a size</p>
        )}
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="block text-sm font-medium mb-2">Quantity</label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-black transition-colors"
            aria-label="Decrease quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="w-12 text-center text-lg font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="w-10 h-10 flex items-center justify-center border border-gray-300 hover:border-black transition-colors"
            aria-label="Increase quantity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className={`w-full py-4 text-base font-medium transition-colors ${
          selectedSize
            ? "bg-black text-white hover:bg-gray-800"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {showConfirmation ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added to Cart!
          </span>
        ) : (
          "Add to Cart"
        )}
      </button>

      {/* Price Summary */}
      {selectedSize && product.price && (
        <div className="flex justify-between items-center pt-4 border-t text-sm">
          <span className="text-gray-600">
            {quantity} x ${product.price}
          </span>
          <span className="font-medium text-lg">
            ${(product.price * quantity).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
