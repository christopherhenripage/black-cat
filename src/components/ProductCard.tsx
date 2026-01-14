import Link from "next/link";
import { Product } from "@/types/product";
import { isProductInStock } from "@/lib/products";
import { FabricHoverOverlay } from "./FabricHoverOverlay";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const inStock = isProductInStock(product);
  const imageSrc = product.images[0]?.src || "/images/placeholder.svg";
  const imageAlt = product.images[0]?.alt || product.name;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block"
    >
      <article className="space-y-4">
        {/* Image with Fabric Overlay */}
        <FabricHoverOverlay className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
              <span className="text-white font-medium text-sm uppercase tracking-wide">
                Sold Out
              </span>
            </div>
          )}
        </FabricHoverOverlay>

        {/* Details */}
        <div className="space-y-1">
          <h3 className="font-medium text-base group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            {product.price && (
              <p className="text-gray-600 text-sm">${product.price}</p>
            )}
            <span className="text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {inStock ? "Request to Order" : "View Details"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
