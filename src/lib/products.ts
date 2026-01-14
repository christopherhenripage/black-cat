import { Product } from "@/types/product";
import productsData from "@/data/products.json";

const products: Product[] = productsData as Product[];

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured).slice(0, 4);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductTypes(): string[] {
  const types = new Set(products.map((p) => p.type));
  return Array.from(types);
}

export function filterProducts(options: {
  type?: string;
  availability?: "all" | "in-stock" | "sold-out";
}): Product[] {
  let filtered = [...products];

  if (options.type && options.type !== "all") {
    filtered = filtered.filter((p) => p.type === options.type);
  }

  if (options.availability === "in-stock") {
    filtered = filtered.filter((p) => p.variants.some((v) => v.available));
  } else if (options.availability === "sold-out") {
    filtered = filtered.filter((p) => p.variants.every((v) => !v.available));
  }

  return filtered;
}

export function isProductInStock(product: Product): boolean {
  return product.variants.some((v) => v.available);
}
