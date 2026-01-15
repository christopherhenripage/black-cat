import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";

export const metadata: Metadata = {
  title: "About",
  description:
    "Super soft cotton button-downs from Bangkok, sold in New Orleans. The story behind Black Cat.",
};

export default function AboutPage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-meta text-accent mb-4">About Us</p>
          <h1 className="text-page-title mb-4">
            The Black Cat Story
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Super soft button-downs from Bangkok. Sold in New Orleans.
          </p>
        </div>
      </section>

      {/* The Shirts */}
      <section className="section-gap">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square">
              <Image
                src="/images/bourbon-street-navy-1.svg"
                alt="Black Cat shirt detail"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-section-title">
                The Shirts
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-black">Super soft cotton button-downs.</strong>
                </p>
                <p>
                  Wear them to a bar. Wear them on a boat. Wear them to a casual
                  Sunday brunch or a festive Friday night. These shirts work
                  anywhere you do.
                </p>
                <p>
                  Each one is made by Mr. Nong in Bangkok, Thailand—where
                  quality cotton and careful attention to detail come together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sizing */}
      <section className="section-gap bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="text-section-title">
                Sizing Notes
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  <strong className="text-black">Available in M, L, XL, and XXL.</strong>
                </p>
                <p>
                  Fair warning: these shirts trend toward Thai sizing, which
                  means they run a bit smaller than typical American cuts. If
                  you normally wear a fitted medium, you might want to size up.
                </p>
                <p>
                  Not sure? Drop us a line with your measurements and we&apos;ll
                  help you find the right fit. We want you to love your shirt.
                </p>
              </div>
              <Button href="/faq#sizing" variant="outline">
                View Size Guide
              </Button>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square">
              <Image
                src="/images/garden-district-stripe-1.svg"
                alt="Shirt fit example"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Care */}
      <section className="section-gap">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-section-title mb-6">
            Care Instructions
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-lg font-medium text-black">
              The only thing you can&apos;t do in these? Party inside of a dryer.
            </p>
            <p>
              Wash on cold. Always line dry. That&apos;s it. Treat them right and
              they&apos;ll treat you right for years.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-gap bg-black text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-section-title mb-4">
            Ready to see what the fuss is about?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Browse the collection. Find your shirt. We&apos;ll take it from there.
          </p>
          <Button href="/shop" variant="secondary" size="lg">
            Shop the Collection
          </Button>
        </div>
      </section>
    </div>
  );
}
