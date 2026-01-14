"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const journeySteps = [
  { id: 1, label: "Fabric Sourced", description: "Premium fabrics selected in Bangkok markets", position: 0 },
  { id: 2, label: "Pattern Cut", description: "Master tailors cut each piece by hand", position: 20 },
  { id: 3, label: "Sewn with Care", description: "Skilled artisans craft every stitch", position: 40 },
  { id: 4, label: "Quality Check", description: "Inspected for perfection", position: 60 },
  { id: 5, label: "Shipped", description: "Carefully packed and sent across the ocean", position: 80 },
  { id: 6, label: "Arrives in NOLA", description: "Ready to hit the streets of New Orleans", position: 100 },
];

export function JourneyMap() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          if (!reducedMotion) {
            startAnimation();
          } else {
            setProgress(100);
          }
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible, reducedMotion]);

  const startAnimation = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setProgress(0);

    const duration = 3500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const rawProgress = Math.min(elapsed / duration, 1);
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased * 100);

      if (rawProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [isAnimating]);

  const handleReplay = () => {
    if (!reducedMotion && !isAnimating) {
      startAnimation();
    }
  };

  // Calculate package position along the curved path
  const getPackagePosition = (t: number) => {
    // Path goes from Bangkok (right) to New Orleans (left)
    // Bezier curve approximation
    const startX = 680, startY = 180;
    const cp1X = 500, cp1Y = 80;
    const cp2X = 300, cp2Y = 80;
    const endX = 120, endY = 180;

    const u = 1 - t;
    const x = u*u*u*startX + 3*u*u*t*cp1X + 3*u*t*t*cp2X + t*t*t*endX;
    const y = u*u*u*startY + 3*u*u*t*cp1Y + 3*u*t*t*cp2Y + t*t*t*endY;

    return { x, y };
  };

  const packagePos = getPackagePosition(progress / 100);

  return (
    <div ref={containerRef} className="relative">
      {/* Main Journey Visualization */}
      <div className="relative w-full max-w-5xl mx-auto">
        <svg
          viewBox="0 0 800 350"
          className="w-full h-auto"
          aria-label="Journey from Bangkok, Thailand to New Orleans, USA"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="sunsetGradient" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="30%" stopColor="#ec4899" />
              <stop offset="60%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="pathGlow" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#22c55e" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Ocean/water background */}
          <rect x="0" y="220" width="800" height="130" fill="rgba(56, 189, 248, 0.15)" />

          {/* Water waves */}
          <path
            d="M0 260 Q50 250, 100 260 Q150 270, 200 260 Q250 250, 300 260 Q350 270, 400 260 Q450 250, 500 260 Q550 270, 600 260 Q650 250, 700 260 Q750 270, 800 260"
            fill="none"
            stroke="rgba(56, 189, 248, 0.3)"
            strokeWidth="2"
          />
          <path
            d="M0 280 Q50 270, 100 280 Q150 290, 200 280 Q250 270, 300 280 Q350 290, 400 280 Q450 270, 500 280 Q550 290, 600 280 Q650 270, 700 280 Q750 290, 800 280"
            fill="none"
            stroke="rgba(56, 189, 248, 0.2)"
            strokeWidth="2"
          />

          {/* USA/Louisiana landmass (left side) */}
          <g>
            <path
              d="M20 140 Q60 120, 100 130 Q140 140, 160 160 Q180 180, 200 200 Q220 220, 200 240 Q180 260, 140 260 Q100 260, 60 240 Q20 220, 20 180 Q20 160, 20 140"
              fill="rgba(34, 197, 94, 0.2)"
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth="2"
            />
            {/* Fleur-de-lis for New Orleans */}
            <g transform="translate(100, 175) scale(0.5)">
              <path
                d="M0 -30 Q-5 -20, -15 -10 Q-25 0, -20 10 Q-15 20, 0 15 Q15 20, 20 10 Q25 0, 15 -10 Q5 -20, 0 -30"
                fill="#c9a227"
                stroke="#a88620"
                strokeWidth="2"
              />
              <rect x="-3" y="10" width="6" height="25" fill="#c9a227" />
            </g>
          </g>

          {/* Thailand landmass (right side) */}
          <g>
            <path
              d="M620 120 Q660 100, 700 110 Q740 120, 770 150 Q780 180, 770 210 Q760 240, 720 250 Q680 260, 650 240 Q620 220, 610 190 Q600 160, 620 120"
              fill="rgba(251, 146, 60, 0.2)"
              stroke="rgba(251, 146, 60, 0.5)"
              strokeWidth="2"
            />
            {/* Thai temple silhouette for Bangkok */}
            <g transform="translate(680, 155)">
              <path
                d="M0 30 L-20 30 L-15 20 L-25 20 L-20 10 L-30 10 L0 -25 L30 10 L20 10 L25 20 L15 20 L20 30 L0 30"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* Flight path - dotted background */}
          <path
            d="M680 180 Q500 80, 300 80 Q200 80, 120 180"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeDasharray="10 8"
          />

          {/* Animated flight path */}
          <path
            d="M680 180 Q500 80, 300 80 Q200 80, 120 180"
            fill="none"
            stroke="url(#pathGlow)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: reducedMotion ? 0 : 600 - (progress * 6),
            }}
          />

          {/* Waypoint markers */}
          {journeySteps.map((step, index) => {
            const pos = getPackagePosition(step.position / 100);
            const isActive = progress >= step.position;
            const isHovered = hoveredStep === step.id;

            return (
              <g
                key={step.id}
                onMouseEnter={() => setHoveredStep(step.id)}
                onMouseLeave={() => setHoveredStep(null)}
                style={{ cursor: "pointer" }}
              >
                {/* Waypoint circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isHovered ? 12 : 8}
                  fill={isActive ? "#fbbf24" : "rgba(255,255,255,0.3)"}
                  stroke={isActive ? "#f59e0b" : "rgba(255,255,255,0.5)"}
                  strokeWidth="2"
                  style={{ transition: "all 0.2s ease" }}
                />

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={pos.x - 80}
                      y={pos.y - 60}
                      width="160"
                      height="45"
                      rx="6"
                      fill="rgba(0,0,0,0.9)"
                    />
                    <text
                      x={pos.x}
                      y={pos.y - 42}
                      textAnchor="middle"
                      fill="white"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {step.label}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y - 26}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="10"
                    >
                      {step.description}
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Bangkok marker */}
          <g>
            <circle cx="680" cy="180" r="14" fill="#f97316" stroke="#ea580c" strokeWidth="3" />
            {isVisible && !reducedMotion && (
              <circle cx="680" cy="180" r="14" fill="none" stroke="#f97316" strokeWidth="2">
                <animate attributeName="r" from="14" to="30" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="680" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              Bangkok
            </text>
            <text x="680" y="232" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
              Thailand 🇹🇭
            </text>
          </g>

          {/* New Orleans marker */}
          <g>
            <circle cx="120" cy="180" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
            {isVisible && !reducedMotion && (
              <circle cx="120" cy="180" r="14" fill="none" stroke="#22c55e" strokeWidth="2">
                <animate attributeName="r" from="14" to="30" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="120" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              New Orleans
            </text>
            <text x="120" y="232" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
              Louisiana 🇺🇸
            </text>
          </g>

          {/* Animated package with cat */}
          {isVisible && (
            <g
              style={{
                transform: `translate(${packagePos.x}px, ${packagePos.y}px)`,
              }}
            >
              {/* Package/shirt box */}
              <g transform="translate(-20, -25)">
                {/* Box body */}
                <rect x="0" y="10" width="40" height="30" rx="4" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
                {/* Box flaps */}
                <path d="M0 10 L20 0 L40 10" fill="#fcd34d" stroke="#f59e0b" strokeWidth="2" />
                {/* Tape */}
                <rect x="15" y="15" width="10" height="20" fill="#ef4444" />

                {/* Cat peeking out */}
                <g transform="translate(20, -5)">
                  {/* Cat ears */}
                  <path d="M-8 5 L-5 -3 L-2 5 Z" fill="#1f2937" />
                  <path d="M2 5 L5 -3 L8 5 Z" fill="#1f2937" />
                  {/* Cat head */}
                  <ellipse cx="0" cy="8" rx="10" ry="8" fill="#1f2937" />
                  {/* Eyes */}
                  <ellipse cx="-4" cy="6" rx="2" ry="2.5" fill="#22c55e" />
                  <ellipse cx="4" cy="6" rx="2" ry="2.5" fill="#22c55e" />
                  <circle cx="-4" cy="6" r="1" fill="black" />
                  <circle cx="4" cy="6" r="1" fill="black" />
                  {/* Nose */}
                  <path d="M0 9 L-1.5 11 L1.5 11 Z" fill="#ff6b9d" />
                </g>
              </g>
            </g>
          )}

          {/* Journey direction arrow */}
          <g transform="translate(400, 50)">
            <text fill="rgba(255,255,255,0.6)" fontSize="14" textAnchor="middle">
              ← Your shirt&apos;s journey
            </text>
          </g>
        </svg>
      </div>

      {/* Replay button */}
      <div className="text-center mt-6">
        <button
          onClick={handleReplay}
          disabled={isAnimating || reducedMotion}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white text-sm transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Replay Journey
        </button>
      </div>

      {/* Journey steps - mobile friendly */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {journeySteps.map((step, index) => {
          const isActive = progress >= step.position;
          const icons = ["🧵", "✂️", "🪡", "✓", "📦", "🎉"];

          return (
            <div
              key={step.id}
              className={`text-center p-3 rounded-lg transition-all duration-300 ${
                isActive ? "bg-white/10" : "bg-white/5"
              }`}
              style={{
                opacity: reducedMotion ? 1 : isActive ? 1 : 0.4,
                transform: reducedMotion || isActive ? "translateY(0)" : "translateY(10px)",
                transition: `opacity 0.3s ease ${index * 0.1}s, transform 0.3s ease ${index * 0.1}s`,
              }}
            >
              <div className={`text-3xl mb-2 ${isActive ? "" : "grayscale"}`}>
                {icons[index]}
              </div>
              <p className="text-sm font-medium text-white">{step.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
