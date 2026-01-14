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
      <article className="space-y-3">
        {/* Image - gallery style with subtle hover */}
        <FabricHoverOverlay className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02] group-hover:opacity-90"
            loading="lazy"
          />
          {!inStock && (
            <div className="absolute top-3 left-3 z-10">
              <span className="text-xs text-gray-500 bg-white/90 px-2 py-1">
                Sold Out
              </span>
            </div>
          )}
          {inStock && (
            <div className="absolute top-3 left-3 z-10">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block" title="In Stock" />
            </div>
          )}
        </FabricHoverOverlay>

        {/* Details - minimal */}
        <div className="pt-1">
          <h3 className="font-display text-base tracking-tight group-hover:text-accent transition-colors duration-300">
            {product.name}
          </h3>
          {product.price && (
            <p className="text-gray-500 text-sm mt-0.5">${product.price}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
