"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PeekingCatProps {
  className?: string;
}

export function PeekingCat({ className = "" }: PeekingCatProps) {
  const [isWaving, setIsWaving] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const reducedMotion = useReducedMotion();

  // Occasionally wave
  useEffect(() => {
    if (reducedMotion) return;

    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 5000);

    // Initial wave after 2 seconds
    const initialWave = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 1000);
    }, 2000);

    return () => {
      clearInterval(waveInterval);
      clearTimeout(initialWave);
    };
  }, [reducedMotion]);

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 3000);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Speech bubble */}
      {showMessage && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-white text-black text-xs rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          Made with 🖤 in Bangkok!
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
        </div>
      )}

      {/* Cat peeking from bottom */}
      <button
        onClick={handleClick}
        className="relative cursor-pointer focus:outline-none group"
        aria-label="Click for a message from Black Cat"
      >
        <svg
          viewBox="0 0 120 60"
          className="w-24 h-12"
          aria-hidden="true"
        >
          {/* Cat body peeking up */}
          <ellipse cx="60" cy="55" rx="35" ry="20" fill="currentColor" />

          {/* Ears */}
          <path d="M30 40 L40 20 L50 40 Z" fill="currentColor" />
          <path d="M70 40 L80 20 L90 40 Z" fill="currentColor" />
          <path d="M35 38 L40 25 L45 38 Z" fill="#ff6b9d" />
          <path d="M75 38 L80 25 L85 38 Z" fill="#ff6b9d" />

          {/* Head */}
          <ellipse cx="60" cy="42" rx="25" ry="18" fill="currentColor" />

          {/* Eyes */}
          <ellipse cx="50" cy="38" rx="5" ry="6" fill="#22c55e" className="group-hover:scale-110 transition-transform origin-center" />
          <ellipse cx="70" cy="38" rx="5" ry="6" fill="#22c55e" className="group-hover:scale-110 transition-transform origin-center" />
          <ellipse cx="50" cy="38" rx="2.5" ry="4" fill="black" />
          <ellipse cx="70" cy="38" rx="2.5" ry="4" fill="black" />
          <circle cx="48" cy="36" r="1.5" fill="white" />
          <circle cx="68" cy="36" r="1.5" fill="white" />

          {/* Nose */}
          <path d="M60 44 L57 48 L63 48 Z" fill="#ff6b9d" />

          {/* Whiskers */}
          <g stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.8">
            <line x1="30" y1="42" x2="45" y2="44" />
            <line x1="30" y1="46" x2="45" y2="46" />
            <line x1="30" y1="50" x2="45" y2="48" />
            <line x1="90" y1="42" x2="75" y2="44" />
            <line x1="90" y1="46" x2="75" y2="46" />
            <line x1="90" y1="50" x2="75" y2="48" />
          </g>

          {/* Waving paw */}
          <g
            style={{
              transformOrigin: "105px 55px",
              transform: isWaving ? "rotate(-20deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease-in-out",
            }}
          >
            <ellipse cx="100" cy="50" rx="10" ry="12" fill="currentColor" />
            {/* Paw pads */}
            <ellipse cx="100" cy="48" rx="4" ry="3" fill="#ff6b9d" />
            <circle cx="96" cy="52" r="2" fill="#ff6b9d" />
            <circle cx="100" cy="54" r="2" fill="#ff6b9d" />
            <circle cx="104" cy="52" r="2" fill="#ff6b9d" />
          </g>
        </svg>
      </button>
    </div>
  );
}

// Floating cat that appears randomly
export function FloatingCat() {
  const [position, setPosition] = useState({ x: -100, y: 50 });
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Show cat occasionally
    const showCat = () => {
      setIsVisible(true);
      setPosition({ x: -100, y: Math.random() * 60 + 20 });

      // Animate across screen
      setTimeout(() => {
        setPosition({ x: 110, y: Math.random() * 60 + 20 });
      }, 100);

      // Hide after animation
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Show cat every 30-60 seconds
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        showCat();
      }
    }, 30000);

    // Initial appearance after 10 seconds
    const initial = setTimeout(showCat, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, [reducedMotion]);

  if (!isVisible || reducedMotion) return null;

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{
        left: `${position.x}%`,
        bottom: `${position.y}px`,
        transition: "left 8s linear",
      }}
    >
      <svg viewBox="0 0 60 30" className="w-16 h-8 text-black">
        {/* Walking cat silhouette */}
        <ellipse cx="30" cy="15" rx="18" ry="10" fill="currentColor" />
        {/* Ears */}
        <path d="M15 10 L20 2 L25 10 Z" fill="currentColor" />
        <path d="M35 10 L40 2 L45 10 Z" fill="currentColor" />
        {/* Tail */}
        <path d="M48 15 Q 58 10, 55 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* Eyes */}
        <circle cx="22" cy="12" r="2" fill="#22c55e" />
        <circle cx="38" cy="12" r="2" fill="#22c55e" />
        {/* Legs */}
        <rect x="18" y="22" width="4" height="8" rx="2" fill="currentColor" />
        <rect x="26" y="22" width="4" height="8" rx="2" fill="currentColor" />
        <rect x="34" y="22" width="4" height="8" rx="2" fill="currentColor" />
        <rect x="42" y="22" width="4" height="8" rx="2" fill="currentColor" />
      </svg>
    </div>
  );
}
