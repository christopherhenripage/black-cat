import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Black Cat Button Down. Bangkok craftsmanship meets New Orleans style.",
};

export default function AboutPage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-black text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-accent font-medium tracking-widest uppercase mb-4 text-sm">
            Our Story
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            About Black Cat
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Where Bangkok craftsmanship meets New Orleans soul.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square">
              <Image
                src="/images/bourbon-street-navy-1.svg"
                alt="Bangkok workshop"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                The Beginning
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Black Cat Button Down was born from a simple observation: the
                  best shirts in the world were being made in Bangkok, but nobody
                  was bringing them to New Orleans.
                </p>
                <p>
                  Founded by a transplant who fell in love with both cities, we
                  set out to bridge that gap. We partnered with master tailors in
                  Bangkok&apos;s historic garment district—craftspeople who have been
                  perfecting their art for generations.
                </p>
                <p>
                  Every stitch, every button, every collar is a testament to their
                  skill. And every shirt is designed with the spirit of New
                  Orleans in mind: bold, distinctive, and just a little bit
                  rebellious.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="font-display text-3xl md:text-4xl font-bold">
                The Craft
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Our shirts are made in small batches in Bangkok, Thailand. We
                  work with a single workshop that shares our commitment to
                  quality over quantity.
                </p>
                <p>
                  We source fabrics from around the world—Egyptian cotton, Belgian
                  linen, Japanese oxford cloth—and have them crafted by hands that
                  know exactly what they&apos;re doing. No shortcuts, no
                  mass-production techniques.
                </p>
                <p>
                  The result? Shirts that feel different the moment you put them
                  on. The kind of quality you can actually feel.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square">
              <Image
                src="/images/garden-district-stripe-1.svg"
                alt="Craftsmanship detail"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sizing Philosophy */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Our Fit Philosophy
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              We believe a great shirt should feel like it was made for you. Our
              designs feature a modern, slightly relaxed fit that works whether
              you&apos;re dressed up or keeping it casual.
            </p>
            <p>
              Not too slim, not too boxy—just right. We&apos;ve refined our patterns
              over hundreds of fittings to find that sweet spot where comfort
              meets style.
            </p>
            <p>
              Unsure about sizing? Reach out. We&apos;re happy to help you find your
              perfect fit, and we&apos;ll make it right if something doesn&apos;t work.
            </p>
          </div>
          <div className="mt-8">
            <Button href="/faq#sizing" variant="outline">
              View Size Guide
            </Button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-gray-400 mb-8">
            Browse our collection and find your next favorite shirt.
          </p>
          <Button href="/shop" variant="secondary" size="lg">
            Shop Now
          </Button>
        </div>
      </section>
    </div>
  );
}
