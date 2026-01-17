import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import { ImageGallery } from "@/components/ImageGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import Link from "next/link";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0]?.src ? [product.images[0].src] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-black">
              Home
            </Link>
          </li>
          <li>/</li>
          <li>
            <Link href="/shop" className="hover:text-black">
              Shop
            </Link>
          </li>
          <li>/</li>
          <li className="text-black">{product.name}</li>
        </ol>
      </nav>

      {/* Product Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className="text-accent font-medium tracking-widest uppercase text-sm mb-2">
                {product.type}
              </p>
              <h1 className="text-section-title mb-4">
                {product.name}
              </h1>
              {product.price && (
                <p className="text-2xl font-medium">${product.price}</p>
              )}
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Details */}
            <div>
              <h2 className="font-medium text-lg mb-3">Details</h2>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-accent mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Care */}
            <div>
              <h2 className="font-medium text-lg mb-3">Care Instructions</h2>
              <ul className="space-y-2">
                {product.care.map((instruction, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-gray-400 mt-1">•</span>
                    {instruction}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sizing Note */}
            <div className="bg-gray-50 p-4">
              <h3 className="font-medium mb-2">Sizing Notes</h3>
              <p className="text-sm text-gray-600">
                Our shirts are designed with a modern, slightly relaxed fit. If
                you prefer a slimmer cut, consider sizing down. Need help? Contact
                us with your measurements and we&apos;ll guide you to the perfect fit.
              </p>
              <Link
                href="/faq#sizing"
                className="text-sm text-accent hover:underline mt-2 inline-block"
              >
                View Size Guide
              </Link>
            </div>

            {/* Add to Cart */}
            <div className="border-t pt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
