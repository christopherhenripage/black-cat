"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Shooting star rainbow with black cat - CSS animation approach for smoother motion
export function RainbowCat() {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Show streak every 15 seconds
    const showStreak = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3500);
    };

    // Initial streak after 4 seconds
    const initial = setTimeout(showStreak, 4000);
    const interval = setInterval(showStreak, 15000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [reducedMotion]);

  if (!isVisible || reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Single container for rainbow + cat + sparkles - moves together */}
      <div
        className="absolute"
        style={{
          top: "30%",
          left: "-100px",
          animation: "rainbowSlide 3s ease-in-out forwards",
        }}
      >
        {/* Rainbow trail - positioned relative to container */}
        <div
          className="absolute h-2 md:h-3"
          style={{
            width: "150vw",
            background: "linear-gradient(90deg, transparent 0%, #ff0080 10%, #ff8c00 25%, #ffff00 40%, #00ff00 55%, #00bfff 70%, #8000ff 85%, transparent 100%)",
            filter: "blur(1px)",
            boxShadow: "0 0 20px rgba(255,0,128,0.5), 0 0 40px rgba(0,191,255,0.3)",
            top: "0",
            left: "40px",
            transform: "rotate(-15deg)",
            transformOrigin: "left center",
          }}
        />

        {/* Cat riding the rainbow */}
        <div
          className="absolute"
          style={{
            top: "-45px",
            left: "0",
            transform: "rotate(-15deg)",
          }}
        >
          <svg width="80" height="60" viewBox="0 0 80 60">
            {/* Body */}
            <ellipse cx="32" cy="40" rx="16" ry="10" fill="black" />
            {/* Head */}
            <ellipse cx="44" cy="30" rx="11" ry="9" fill="black" />
            {/* Ears */}
            <path d="M38 25 L36 14 L43 22 Z" fill="black" />
            <path d="M50 22 L52 11 L55 22 Z" fill="black" />
            {/* Inner ears */}
            <path d="M39 24 L37 17 L42 22 Z" fill="#ff6b9d" />
            <path d="M51 21 L52 15 L54 21 Z" fill="#ff6b9d" />
            {/* Tail - flowing behind */}
            <path d="M16 38 Q 5 32, 6 22 Q 7 14, 12 18" fill="none" stroke="black" strokeWidth="4" strokeLinecap="round" />
            {/* Eyes */}
            <ellipse cx="41" cy="28" rx="2.5" ry="3" fill="#22c55e" />
            <ellipse cx="49" cy="28" rx="2.5" ry="3" fill="#22c55e" />
            <ellipse cx="41" cy="28" rx="1.2" ry="1.8" fill="black" />
            <ellipse cx="49" cy="28" rx="1.2" ry="1.8" fill="black" />
            <circle cx="40" cy="27" r="0.8" fill="white" />
            <circle cx="48" cy="27" r="0.8" fill="white" />
            {/* Nose */}
            <path d="M45 32 L43 35 L47 35 Z" fill="#ff6b9d" />
            {/* Happy mouth */}
            <path d="M44 36 Q45 38, 47 36" fill="none" stroke="#ff6b9d" strokeWidth="1" strokeLinecap="round" />
            {/* Front legs stretched forward */}
            <rect x="48" y="38" width="3" height="8" rx="1.5" fill="black" transform="rotate(-20, 50, 38)" />
            <rect x="53" y="40" width="3" height="8" rx="1.5" fill="black" transform="rotate(-30, 55, 40)" />
            {/* Back legs */}
            <rect x="20" y="42" width="3" height="6" rx="1.5" fill="black" transform="rotate(10, 22, 42)" />
            <rect x="26" y="44" width="3" height="6" rx="1.5" fill="black" />
          </svg>
        </div>

        {/* Sparkles trailing behind cat */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${-50 + (i % 3) * 8}px`,
              left: `${-20 - i * 15}px`,
              transform: "rotate(-15deg)",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20">
              <path
                d="M10,2 L11,8 L17,10 L11,12 L10,18 L9,12 L3,10 L9,8 Z"
                fill={["#fff", "#ffff00", "#ff69b4", "#00ffff", "#ff8c00", "#00ff00"][i]}
                style={{
                  opacity: 1 - i * 0.12,
                  animation: `sparkle 0.4s ease-in-out ${i * 0.08}s infinite`,
                }}
              />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}
