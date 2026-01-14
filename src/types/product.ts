export interface ProductVariant {
  size: string;
  available: boolean;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price?: number;
  type: string;
  description: string;
  details: string[];
  care: string[];
  variants: ProductVariant[];
  images: ProductImage[];
  featured: boolean;
}
