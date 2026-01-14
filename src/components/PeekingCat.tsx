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

// Smooth walking black cat that glides across the screen
export function FloatingCat() {
  const [isVisible, setIsVisible] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Show cat every 20-40 seconds
    const showCat = () => {
      setIsVisible(true);
      // Hide after crossing screen (8 seconds)
      setTimeout(() => {
        setIsVisible(false);
      }, 8000);
    };

    // Initial appearance after 5 seconds
    const initial = setTimeout(showCat, 5000);

    // Then every 25 seconds
    const interval = setInterval(showCat, 25000);

    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [reducedMotion]);

  // Walk cycle animation for legs
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    const walkInterval = setInterval(() => {
      setWalkCycle((prev) => (prev + 1) % 4);
    }, 150);

    return () => clearInterval(walkInterval);
  }, [isVisible, reducedMotion]);

  if (!isVisible || reducedMotion) return null;

  // Leg positions based on walk cycle
  const legPositions = [
    { front1: 0, front2: -8, back1: -8, back2: 0 },
    { front1: -8, front2: 0, back1: 0, back2: -8 },
    { front1: 0, front2: -8, back1: -8, back2: 0 },
    { front1: -8, front2: 0, back1: 0, back2: -8 },
  ];
  const legs = legPositions[walkCycle];

  return (
    <div
      className="fixed bottom-8 z-50 pointer-events-none"
      style={{
        animation: "catWalk 8s linear forwards",
      }}
    >
      <svg viewBox="0 0 100 50" className="w-20 h-10">
        {/* Tail - animated wave */}
        <path
          d="M85 20 Q 95 15, 98 22 Q 100 30, 95 25"
          stroke="black"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          style={{
            animation: "tailWag 0.5s ease-in-out infinite alternate",
          }}
        />

        {/* Body */}
        <ellipse cx="50" cy="25" rx="30" ry="15" fill="black" />

        {/* Back legs */}
        <rect
          x="65"
          y="32"
          width="5"
          height="14"
          rx="2"
          fill="black"
          style={{ transform: `translateY(${legs.back1}px)` }}
        />
        <rect
          x="72"
          y="32"
          width="5"
          height="14"
          rx="2"
          fill="black"
          style={{ transform: `translateY(${legs.back2}px)` }}
        />

        {/* Front legs */}
        <rect
          x="25"
          y="32"
          width="5"
          height="14"
          rx="2"
          fill="black"
          style={{ transform: `translateY(${legs.front1}px)` }}
        />
        <rect
          x="32"
          y="32"
          width="5"
          height="14"
          rx="2"
          fill="black"
          style={{ transform: `translateY(${legs.front2}px)` }}
        />

        {/* Head */}
        <ellipse cx="20" cy="18" rx="15" ry="12" fill="black" />

        {/* Ears */}
        <path d="M10 12 L8 0 L18 8 Z" fill="black" />
        <path d="M22 8 L32 0 L30 12 Z" fill="black" />
        <path d="M11 10 L10 3 L16 8 Z" fill="#ff6b9d" />
        <path d="M24 8 L29 3 L28 10 Z" fill="#ff6b9d" />

        {/* Eyes */}
        <ellipse cx="15" cy="16" rx="3" ry="4" fill="#22c55e" />
        <ellipse cx="25" cy="16" rx="3" ry="4" fill="#22c55e" />
        <ellipse cx="15" cy="16" rx="1.5" ry="2.5" fill="black" />
        <ellipse cx="25" cy="16" rx="1.5" ry="2.5" fill="black" />
        <circle cx="14" cy="15" r="1" fill="white" />
        <circle cx="24" cy="15" r="1" fill="white" />

        {/* Nose */}
        <path d="M20 20 L18 23 L22 23 Z" fill="#ff6b9d" />

        {/* Whiskers */}
        <g stroke="#666" strokeWidth="0.5" strokeLinecap="round">
          <line x1="5" y1="18" x2="14" y2="19" />
          <line x1="5" y1="21" x2="14" y2="21" />
          <line x1="5" y1="24" x2="14" y2="23" />
          <line x1="35" y1="18" x2="26" y2="19" />
          <line x1="35" y1="21" x2="26" y2="21" />
          <line x1="35" y1="24" x2="26" y2="23" />
        </g>
      </svg>
    </div>
  );
}

// Paw print cursor trail
export function PawPrintTrail() {
  const [prints, setPrints] = useState<{ id: number; x: number; y: number; rotation: number }[]>([]);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    let lastX = 0;
    let lastY = 0;
    let printId = 0;
    let isLeft = true;

    const handleMouseMove = (e: MouseEvent) => {
      const distance = Math.sqrt(
        Math.pow(e.clientX - lastX, 2) + Math.pow(e.clientY - lastY, 2)
      );

      // Only add print every 80px of movement
      if (distance > 80) {
        const angle = Math.atan2(e.clientY - lastY, e.clientX - lastX) * (180 / Math.PI);

        setPrints((prev) => [
          ...prev.slice(-6), // Keep only last 6 prints
          {
            id: printId++,
            x: e.clientX + (isLeft ? -10 : 10),
            y: e.clientY,
            rotation: angle + (isLeft ? -20 : 20),
          },
        ]);

        isLeft = !isLeft;
        lastX = e.clientX;
        lastY = e.clientY;

        // Remove print after fade out
        setTimeout(() => {
          setPrints((prev) => prev.slice(1));
        }, 1500);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {prints.map((print) => (
        <div
          key={print.id}
          className="absolute"
          style={{
            left: print.x,
            top: print.y,
            transform: `translate(-50%, -50%) rotate(${print.rotation}deg)`,
            animation: "pawFade 1.5s ease-out forwards",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-black/20">
            {/* Main pad */}
            <ellipse cx="12" cy="16" rx="5" ry="4" fill="currentColor" />
            {/* Toe beans */}
            <circle cx="6" cy="10" r="3" fill="currentColor" />
            <circle cx="12" cy="7" r="3" fill="currentColor" />
            <circle cx="18" cy="10" r="3" fill="currentColor" />
          </svg>
        </div>
      ))}
    </div>
  );
}
