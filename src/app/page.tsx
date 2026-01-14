import Image from "next/image";
import { Button } from "@/components/Button";
import { ProductCard } from "@/components/ProductCard";
import { TimeGreeting } from "@/components/TimeGreeting";
import { JourneyMap } from "@/components/JourneyMap";
import { RevealSection } from "@/components/RevealSection";
import { DropMemory } from "@/components/DropMemory";
import { BlackCatLogo } from "@/components/BlackCatLogo";
import { PeekingCat } from "@/components/PeekingCat";
import { getFeaturedProducts } from "@/lib/products";

export default function Home() {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="pb-20 md:pb-0">
      {/* Time Greeting */}
      <TimeGreeting className="bg-gray-50 border-b border-gray-100" />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80 z-10" />
        {/* Tropical accent glow */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-tropical-pink/20 via-transparent to-transparent z-0" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-tropical-teal/15 via-transparent to-transparent z-0" />
        <div className="absolute inset-0">
          <Image
            src="/images/midnight-classic-1.svg"
            alt="Hero background"
            fill
            className="object-cover opacity-40"
            priority
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <p className="text-accent font-medium tracking-widest uppercase mb-4 text-sm">
            Created in Bangkok / Sold in New Orleans
          </p>
          {/* Black Cat Logo */}
          <div className="flex justify-center mb-6">
            <BlackCatLogo size="xl" color="black" animated />
          </div>
          <h1 className="text-page-title mb-6">
            Black Cat Button Down
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl mx-auto leading-relaxed">
            Shirts made by hand in Bangkok. Worn with intention in New Orleans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/shop" variant="secondary" size="lg">
              Shop Collection
            </Button>
            <Button href="/order" variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
              Request to Order
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-gap px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <RevealSection className="text-center mb-16">
          <p className="text-meta text-accent mb-3">The Collection</p>
          <h2 className="text-section-title mb-4">
            Featured Shirts
          </h2>
          <p className="text-body-light prose-width mx-auto">
            Each shirt tells a story—bold prints, considered details, made to last.
          </p>
        </RevealSection>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product, index) => (
            <RevealSection key={product.id} delay={index * 100}>
              <ProductCard product={product} />
            </RevealSection>
          ))}
        </div>
        <RevealSection className="text-center mt-12" delay={400}>
          <Button href="/shop" variant="outline">
            View All Shirts
          </Button>
        </RevealSection>
      </section>

      {/* Journey Map */}
      <section className="py-16 bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden relative">
        {/* Tropical accent glows */}
        <div className="absolute top-0 left-0 w-1/3 h-1/2 bg-gradient-to-br from-tropical-teal/10 via-transparent to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-gradient-to-tl from-tropical-pink/10 via-transparent to-transparent" />
        {/* Decorative stars */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-tropical-yellow rounded-full opacity-60" />
          <div className="absolute top-20 right-20 w-1 h-1 bg-tropical-pink rounded-full opacity-40" />
          <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-tropical-teal rounded-full opacity-50" />
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-tropical-green rounded-full opacity-30" />
          <div className="absolute top-1/2 left-20 w-1 h-1 bg-tropical-coral rounded-full opacity-40" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealSection className="text-center mb-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-yellow-200 via-pink-200 to-green-200 bg-clip-text text-transparent">
              The Journey
            </h2>
            <p className="text-pink-200 text-lg">From Bangkok workshops to New Orleans streets</p>
          </RevealSection>
          <JourneyMap />
        </div>
      </section>

      {/* Story Section */}
      <section className="section-gap bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <RevealSection direction="left">
              <div className="relative aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden flex items-center justify-center">
                {/* Large cat illustration */}
                <svg viewBox="0 0 200 200" className="w-3/4 h-3/4 text-accent opacity-90">
                  <path d="M50 70 L70 30 L90 70 Z" fill="currentColor" />
                  <path d="M110 70 L130 30 L150 70 Z" fill="currentColor" />
                  <ellipse cx="100" cy="90" rx="55" ry="45" fill="currentColor" />
                  <ellipse cx="100" cy="150" rx="45" ry="40" fill="currentColor" />
                  <path d="M145 150 Q180 140, 185 110 Q190 85, 175 75" stroke="currentColor" strokeWidth="16" fill="none" strokeLinecap="round" />
                  <ellipse cx="80" cy="85" rx="10" ry="12" fill="#22c55e" />
                  <ellipse cx="120" cy="85" rx="10" ry="12" fill="#22c55e" />
                  <ellipse cx="80" cy="85" rx="5" ry="8" fill="black" />
                  <ellipse cx="120" cy="85" rx="5" ry="8" fill="black" />
                  <path d="M100 100 L94 110 L106 110 Z" fill="#ff6b9d" />
                </svg>
              </div>
            </RevealSection>
            <RevealSection direction="right" delay={200}>
              <div className="space-y-6">
                <p className="text-meta text-accent">Our Story</p>
                <h2 className="text-section-title">
                  Bangkok craft meets
                  <br />
                  New Orleans character.
                </h2>
                <div className="space-y-4 text-body-light">
                  <p>
                    Every shirt starts in Bangkok workshops, where tailors cut and
                    stitch with care passed down through generations. We choose fabrics
                    for their hand-feel and how they wear over time.
                  </p>
                  <p>
                    From there, each piece finds its way to New Orleans—a city that
                    doesn&apos;t do ordinary. Our shirts are made for people who appreciate
                    the difference.
                  </p>
                </div>
                <DropMemory className="my-6" />
                <Button href="/about" variant="outline">
                  Read More
                </Button>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Email / Contact Section */}
      <section className="section-gap bg-black text-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <RevealSection>
            <h2 className="text-section-title mb-4">
              Stay in the Loop
            </h2>
            <p className="text-gray-400 mb-8 leading-relaxed">
              New shirts drop when they&apos;re ready. We&apos;ll let you know.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@blackcatbuttondown.com?subject=Add me to the mailing list"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-medium bg-accent hover:bg-accent-dark transition-colors"
              >
                Join Mailing List
              </a>
              <a
                href="https://instagram.com/blackcatbuttondown"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium border border-white/20 hover:bg-white/10 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
                Follow on Instagram
              </a>
            </div>
            <p className="mt-6 text-sm text-gray-500">
              Prefer email? Write to us at{" "}
              <a
                href="mailto:hello@blackcatbuttondown.com"
                className="text-accent hover:underline"
              >
                hello@blackcatbuttondown.com
              </a>
            </p>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
