"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { RainbowCat } from "@/components/RainbowCat";

// Black cat with pulsing neon aura
function NeonCat() {
  return (
    <div className="relative inline-block">
      <svg viewBox="0 0 120 100" className="w-40 h-32">
        <defs>
          {/* Pulsing neon glow filter */}
          <filter id="neonAura" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
            </feMerge>
          </filter>
          {/* Gradient for the aura */}
          <linearGradient id="auraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff00ff" />
            <stop offset="50%" stopColor="#00ffff" />
            <stop offset="100%" stopColor="#ff00ff" />
          </linearGradient>
        </defs>

        {/* Neon aura outline - pulsing */}
        <g filter="url(#neonAura)" style={{ animation: "neonPulse 2s ease-in-out infinite" }}>
          {/* Body aura */}
          <ellipse cx="60" cy="65" rx="28" ry="18" fill="none" stroke="url(#auraGradient)" strokeWidth="3" />
          {/* Head aura */}
          <ellipse cx="60" cy="40" rx="20" ry="16" fill="none" stroke="url(#auraGradient)" strokeWidth="3" />
          {/* Ears aura */}
          <path d="M42 32 L35 10 L52 28" fill="none" stroke="#ff00ff" strokeWidth="3" />
          <path d="M78 32 L85 10 L68 28" fill="none" stroke="#00ffff" strokeWidth="3" />
          {/* Tail aura */}
          <path d="M88 65 Q105 50, 102 30 Q100 18, 92 24" fill="none" stroke="url(#auraGradient)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Solid black cat on top */}
        <g>
          {/* Body */}
          <ellipse cx="60" cy="65" rx="25" ry="15" fill="black" />
          {/* Head */}
          <ellipse cx="60" cy="40" rx="18" ry="14" fill="black" />
          {/* Ears */}
          <path d="M44 34 L38 14 L52 30 Z" fill="black" />
          <path d="M76 34 L82 14 L68 30 Z" fill="black" />
          {/* Inner ear pink */}
          <path d="M45 32 L40 18 L50 30 Z" fill="#ff6b9d" />
          <path d="M75 32 L80 18 L70 30 Z" fill="#ff6b9d" />
          {/* Tail */}
          <path d="M85 65 Q100 52, 98 32 Q96 22, 90 26" fill="none" stroke="black" strokeWidth="6" strokeLinecap="round" />
          {/* Eyes - green with glow */}
          <ellipse cx="52" cy="38" rx="4" ry="5" fill="#22c55e" />
          <ellipse cx="68" cy="38" rx="4" ry="5" fill="#22c55e" />
          <ellipse cx="52" cy="38" rx="2" ry="3" fill="black" />
          <ellipse cx="68" cy="38" rx="2" ry="3" fill="black" />
          <circle cx="51" cy="36" r="1.5" fill="white" />
          <circle cx="67" cy="36" r="1.5" fill="white" />
          {/* Nose */}
          <path d="M60 44 L57 48 L63 48 Z" fill="#ff6b9d" />
          {/* Whiskers */}
          <g stroke="#666" strokeWidth="0.8" strokeLinecap="round">
            <line x1="38" y1="42" x2="50" y2="44" />
            <line x1="38" y1="46" x2="50" y2="46" />
            <line x1="38" y1="50" x2="50" y2="48" />
            <line x1="82" y1="42" x2="70" y2="44" />
            <line x1="82" y1="46" x2="70" y2="46" />
            <line x1="82" y1="50" x2="70" y2="48" />
          </g>
        </g>
      </svg>
    </div>
  );
}

// Easter egg: Clickable cat that reveals a secret message
function SecretCat() {
  const [clicks, setClicks] = useState(0);
  const [showSecret, setShowSecret] = useState(false);

  const handleClick = () => {
    const newClicks = clicks + 1;
    setClicks(newClicks);
    if (newClicks >= 3) {
      setShowSecret(true);
      setTimeout(() => setShowSecret(false), 3000);
      setClicks(0);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleClick}
        className="text-6xl cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none"
        aria-label="A mysterious cat"
      >
        🐈‍⬛
      </button>
      {showSecret && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap animate-bounce">
          Meow! You found me! 🖤
        </div>
      )}
    </div>
  );
}

// Easter egg: Hover-reveal text
function HoverReveal({ children, secret }: { children: React.ReactNode; secret: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className="relative cursor-help border-b border-dotted border-gray-400"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-xs px-3 py-1.5 rounded whitespace-nowrap z-10">
          {secret}
        </span>
      )}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="pb-20 md:pb-0">
      {/* Rainbow cat shooting star */}
      <RainbowCat />

      {/* Header */}
      <section className="bg-black text-white py-20 md:py-28 relative overflow-hidden">
        {/* Subtle neon gradient orbs in background */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-meta text-accent mb-4">About Us</p>
          <h1 className="text-page-title mb-4">
            <span className="relative inline-block">
              The Black Cat Story
              {/* Neon underline */}
              <span
                className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                style={{
                  background: "linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)",
                  boxShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff",
                  animation: "neonPulse 2s ease-in-out infinite",
                }}
              />
            </span>
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">
            Super soft button-downs from Bangkok. Sold in New Orleans.
          </p>
        </div>
      </section>

      {/* The Shirts - Clean editorial layout */}
      <section className="section-gap relative">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <NeonCat />
          </div>
          <h2 className="text-section-title text-center mb-8">
            The Shirts
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
            <p className="text-2xl text-black font-display text-center">
              Super soft cotton button-downs.
            </p>
            <p className="text-center">
              Wear them to a <HoverReveal secret="Jazz clubs, dive bars, you name it">bar</HoverReveal>.
              Wear them on a <HoverReveal secret="Lake Pontchartrain vibes">boat</HoverReveal>.
              Wear them to a casual Sunday brunch or a festive Friday night.
            </p>
            <p className="text-center">
              These shirts work anywhere you do.
            </p>
            <p className="text-center border-l-4 border-accent pl-6 py-2 bg-gray-50 italic">
              Each one comes from Bangkok, Thailand—quality cotton
              and careful attention to detail, every time.
            </p>
          </div>
        </div>
      </section>

      {/* Sizing - Clean layout with visual interest */}
      <section className="section-gap bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-section-title text-center mb-8">
            Sizing Notes
          </h2>

          {/* Size badges with neon glow */}
          <div className="flex justify-center gap-4 mb-10">
            {["M", "L", "XL", "XXL"].map((size, i) => {
              const colors = ["#ff00ff", "#00ffff", "#00ff00", "#ff8800"];
              return (
                <div
                  key={size}
                  className="w-14 h-14 rounded-full bg-black text-white flex items-center justify-center font-display text-lg cursor-default transition-all duration-300 hover:scale-110"
                  style={{
                    border: `2px solid ${colors[i]}`,
                    boxShadow: `0 0 10px ${colors[i]}40, inset 0 0 10px ${colors[i]}20`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 20px ${colors[i]}, 0 0 40px ${colors[i]}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 0 10px ${colors[i]}40, inset 0 0 10px ${colors[i]}20`;
                  }}
                >
                  {size}
                </div>
              );
            })}
          </div>

          <div className="space-y-6 text-gray-600 leading-relaxed text-lg text-center">
            <p>
              Fair warning: these shirts trend toward{" "}
              <HoverReveal secret="Trust us on this one">Thai sizing</HoverReveal>,
              which means they run a bit smaller than typical American cuts.
            </p>
            <p className="text-black font-medium">
              If you normally wear a fitted medium, you might want to size up.
            </p>
            <p>
              Not sure? Drop us a line with your measurements and we&apos;ll
              help you find the right fit. We want you to love your shirt.
            </p>
          </div>
          <div className="text-center mt-8">
            <Button href="/faq#sizing" variant="outline">
              View Size Guide
            </Button>
          </div>
        </div>
      </section>

      {/* Care - Fun visual treatment */}
      <section className="section-gap">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-section-title mb-8">
            Care Instructions
          </h2>

          {/* Visual care icons with neon style */}
          <div className="flex justify-center gap-8 mb-10">
            <div className="text-center group cursor-default">
              <div
                className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-all duration-300"
                style={{
                  border: "2px solid #00bfff",
                  boxShadow: "0 0 15px #00bfff60, inset 0 0 15px #00bfff20",
                }}
              >
                🧊
              </div>
              <p className="text-sm text-gray-500 group-hover:text-cyan-400 transition-colors">Cold wash</p>
            </div>
            <div className="text-center group cursor-default">
              <div
                className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 transition-all duration-300"
                style={{
                  border: "2px solid #ffff00",
                  boxShadow: "0 0 15px #ffff0060, inset 0 0 15px #ffff0020",
                }}
              >
                ☀️
              </div>
              <p className="text-sm text-gray-500 group-hover:text-yellow-400 transition-colors">Line dry</p>
            </div>
            <div className="text-center group cursor-default">
              <div
                className="w-16 h-16 rounded-full bg-black/80 flex items-center justify-center text-2xl mb-2 group-hover:rotate-12 transition-all duration-300"
                style={{
                  border: "2px solid #ff0040",
                  boxShadow: "0 0 15px #ff004060, inset 0 0 15px #ff004020",
                }}
              >
                🚫
              </div>
              <p className="text-sm text-gray-500 group-hover:text-red-400 transition-colors">No dryer</p>
            </div>
          </div>

          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p className="text-xl font-display text-black">
              The only thing you can&apos;t do in these? Party inside of a dryer.
            </p>
            <p>
              Wash on cold. Always line dry. That&apos;s it.
            </p>
            <p className="text-sm text-gray-400 italic">
              Treat them right and they&apos;ll treat you right for years.
            </p>
          </div>
        </div>
      </section>

      {/* Hidden cat army easter egg */}
      <section className="py-4 overflow-hidden">
        <div className="flex justify-center gap-1 opacity-10 hover:opacity-100 transition-opacity duration-700 cursor-default">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="text-xs" style={{ animationDelay: `${i * 50}ms` }}>
              🐱
            </span>
          ))}
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
