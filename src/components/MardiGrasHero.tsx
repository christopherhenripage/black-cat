"use client";

import { useMardiGras } from "./MardiGrasProvider";
import { BlackCatLogo } from "./BlackCatLogo";
import { Button } from "./Button";

export function MardiGrasHero() {
  const { isMardiGras } = useMardiGras();

  if (!isMardiGras) return null;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Mardi Gras gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900" />

      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: "linear-gradient(45deg, #9333ea 0%, #eab308 25%, #22c55e 50%, #eab308 75%, #9333ea 100%)",
          backgroundSize: "400% 400%",
          animation: "mardiGrasShift 8s ease infinite",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Fleur-de-lis pattern */}
        <svg className="absolute top-10 left-10 w-16 h-16 text-gold-400/20" viewBox="0 0 100 100">
          <path d="M50 5 Q45 25, 30 35 Q15 45, 20 60 Q25 75, 50 70 Q75 75, 80 60 Q85 45, 70 35 Q55 25, 50 5" fill="currentColor" />
          <rect x="45" y="65" width="10" height="30" fill="currentColor" />
        </svg>
        <svg className="absolute top-20 right-20 w-12 h-12 text-green-400/20" viewBox="0 0 100 100">
          <path d="M50 5 Q45 25, 30 35 Q15 45, 20 60 Q25 75, 50 70 Q75 75, 80 60 Q85 45, 70 35 Q55 25, 50 5" fill="currentColor" />
          <rect x="45" y="65" width="10" height="30" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-32 left-20 w-10 h-10 text-yellow-400/20" viewBox="0 0 100 100">
          <path d="M50 5 Q45 25, 30 35 Q15 45, 20 60 Q25 75, 50 70 Q75 75, 80 60 Q85 45, 70 35 Q55 25, 50 5" fill="currentColor" />
          <rect x="45" y="65" width="10" height="30" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-40 right-16 w-14 h-14 text-purple-300/20" viewBox="0 0 100 100">
          <path d="M50 5 Q45 25, 30 35 Q15 45, 20 60 Q25 75, 50 70 Q75 75, 80 60 Q85 45, 70 35 Q55 25, 50 5" fill="currentColor" />
          <rect x="45" y="65" width="10" height="30" fill="currentColor" />
        </svg>

        {/* Mask decorations */}
        <div className="absolute top-1/4 left-8 opacity-20">
          <svg viewBox="0 0 80 40" className="w-20 h-10">
            <path d="M5 20 Q20 5, 40 5 Q60 5, 75 20 Q65 35, 55 30 L50 35 L40 30 L30 35 L25 30 Q15 35, 5 20" fill="#eab308" stroke="#9333ea" strokeWidth="2" />
            <ellipse cx="25" cy="18" rx="8" ry="6" fill="#1a1a2e" />
            <ellipse cx="55" cy="18" rx="8" ry="6" fill="#1a1a2e" />
          </svg>
        </div>
        <div className="absolute bottom-1/4 right-12 opacity-20 rotate-12">
          <svg viewBox="0 0 80 40" className="w-24 h-12">
            <path d="M5 20 Q20 5, 40 5 Q60 5, 75 20 Q65 35, 55 30 L50 35 L40 30 L30 35 L25 30 Q15 35, 5 20" fill="#22c55e" stroke="#eab308" strokeWidth="2" />
            <ellipse cx="25" cy="18" rx="8" ry="6" fill="#1a1a2e" />
            <ellipse cx="55" cy="18" rx="8" ry="6" fill="#1a1a2e" />
          </svg>
        </div>

        {/* Bead strings */}
        <svg className="absolute top-0 left-1/4 w-4 h-64 opacity-40">
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240].map((y, i) => (
            <circle key={i} cx="8" cy={y} r="6" fill={["#9333ea", "#eab308", "#22c55e"][i % 3]} />
          ))}
        </svg>
        <svg className="absolute top-0 right-1/3 w-4 h-48 opacity-30">
          {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180].map((y, i) => (
            <circle key={i} cx="8" cy={y} r="5" fill={["#22c55e", "#9333ea", "#eab308"][i % 3]} />
          ))}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
        {/* Masked Cat Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <BlackCatLogo size="hero" color="black" animated glowOnDark />
            {/* Mask overlay - matched to cat's 100x100 viewBox, eyes at x=41/59, y=42 */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
            >
              <defs>
                {/* Mask with eye holes cut out */}
                <mask id="maskWithEyeHoles">
                  <rect width="100" height="100" fill="white" />
                  {/* Cut out eye holes - these become transparent */}
                  <ellipse cx="41" cy="42" rx="8" ry="9" fill="black" />
                  <ellipse cx="59" cy="42" rx="8" ry="9" fill="black" />
                </mask>
              </defs>

              {/* Mask shape with eye holes cut out */}
              <path
                d="M18 42 Q28 28, 50 28 Q72 28, 82 42 Q77 54, 68 52 L62 56 L50 52 L38 56 L32 52 Q23 54, 18 42"
                fill="#9333ea"
                stroke="#eab308"
                strokeWidth="1.5"
                mask="url(#maskWithEyeHoles)"
              />

              {/* Feathers on top */}
              <path d="M50 26 L50 14" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M44 27 L37 16" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
              <path d="M56 27 L63 16" stroke="#eab308" strokeWidth="2" strokeLinecap="round" />
              <path d="M38 29 L28 20" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />
              <path d="M62 29 L72 20" stroke="#9333ea" strokeWidth="2" strokeLinecap="round" />

              {/* Decorative gems on mask */}
              <circle cx="50" cy="28" r="2.5" fill="#eab308" />
              <circle cx="42" cy="29" r="1.5" fill="#22c55e" />
              <circle cx="58" cy="29" r="1.5" fill="#22c55e" />
            </svg>
          </div>
        </div>

        <p className="text-yellow-400 font-medium tracking-widest uppercase mb-2 text-sm animate-pulse">
          Laissez les bons temps rouler!
        </p>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-4 text-white">
          Black Cat
        </h1>

        <p className="text-2xl md:text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-yellow-300 to-green-300 mb-6">
          Mardi Gras Edition
        </p>

        <p className="text-lg md:text-xl text-purple-200 mb-4 max-w-md mx-auto leading-relaxed">
          Super soft button-downs from Bangkok.
        </p>
        <p className="text-sm text-purple-300/70 mb-10 tracking-wide">
          Celebrating in New Orleans
        </p>

        <div className="flex justify-center">
          <Button href="/shop" variant="secondary" size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 border-0">
            Shop Collection
          </Button>
        </div>

        {/* Decorative beads below buttons */}
        <div className="flex justify-center gap-2 mt-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: ["#9333ea", "#eab308", "#22c55e"][i % 3],
                animation: `pulse 1.5s ease-in-out ${i * 0.1}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Regular hero for non-Mardi Gras mode
export function RegularHero() {
  const { isMardiGras } = useMardiGras();

  if (isMardiGras) return null;

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70 z-10" />
      <div className="absolute inset-0">
        <img
          src="/images/midnight-classic-1.svg"
          alt="Hero background"
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="relative z-20 text-center px-4 max-w-3xl mx-auto">
        <div className="flex justify-center mb-8">
          <BlackCatLogo size="hero" color="black" animated glowOnDark />
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6">
          Black Cat
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-4 max-w-md mx-auto leading-relaxed">
          Super soft button-downs from Bangkok.
        </p>
        <p className="text-sm text-gray-500 mb-10 tracking-wide">
          Sold in New Orleans
        </p>
        <div className="flex justify-center">
          <Button href="/shop" variant="secondary" size="lg">
            Shop Collection
          </Button>
        </div>
      </div>
    </section>
  );
}

// Combined hero that shows the right version
export function HeroSection() {
  return (
    <>
      <MardiGrasHero />
      <RegularHero />
    </>
  );
}
