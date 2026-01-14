"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const journeySteps = [
  { id: 1, label: "Found in Bangkok", description: "Discovering unique shirts in Bangkok markets", position: 0 },
  { id: 2, label: "Hand Selected", description: "Each piece carefully chosen for quality", position: 25 },
  { id: 3, label: "Packed with Care", description: "Wrapped and ready for the journey", position: 50 },
  { id: 4, label: "Across the Ocean", description: "Traveling from Thailand to Louisiana", position: 75 },
  { id: 5, label: "Arrives in NOLA", description: "Ready for New Orleans style", position: 100 },
];

export function JourneyMap() {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          if (reducedMotion) {
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

  // Continuous looping animation
  useEffect(() => {
    if (!isVisible || reducedMotion) return;

    const duration = 6000; // 6 seconds per loop
    const pauseDuration = 2000; // 2 second pause at end
    let startTime = Date.now();
    let isPaused = false;
    let pauseStart = 0;

    const animate = () => {
      const now = Date.now();

      if (isPaused) {
        if (now - pauseStart >= pauseDuration) {
          // Resume animation
          isPaused = false;
          startTime = now;
          setProgress(0);
        }
      } else {
        const elapsed = now - startTime;
        const rawProgress = Math.min(elapsed / duration, 1);
        // Ease in-out for smooth motion
        const eased = rawProgress < 0.5
          ? 2 * rawProgress * rawProgress
          : 1 - Math.pow(-2 * rawProgress + 2, 2) / 2;

        setProgress(eased * 100);

        if (rawProgress >= 1) {
          // Start pause
          isPaused = true;
          pauseStart = now;
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, reducedMotion]);

  // Calculate cat position along the curved path (LEFT to RIGHT)
  const getCatPosition = (t: number) => {
    // Path goes from Bangkok (left) to New Orleans (right)
    const startX = 120, startY = 180;
    const cp1X = 250, cp1Y = 80;
    const cp2X = 500, cp2Y = 80;
    const endX = 680, endY = 180;

    const u = 1 - t;
    const x = u*u*u*startX + 3*u*u*t*cp1X + 3*u*t*t*cp2X + t*t*t*endX;
    const y = u*u*u*startY + 3*u*u*t*cp1Y + 3*u*t*t*cp2Y + t*t*t*endY;

    return { x, y };
  };

  const catPos = getCatPosition(progress / 100);

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
            <linearGradient id="pathGlow" x1="0%" y1="0%" x2="100%" y2="0%">
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
            {/* Tropical shirt pattern */}
            <pattern id="tropicalPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
              <rect width="8" height="8" fill="#22c55e"/>
              <circle cx="2" cy="2" r="1.5" fill="#f472b6"/>
              <circle cx="6" cy="6" r="1.5" fill="#fbbf24"/>
            </pattern>
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

          {/* Thailand landmass (LEFT side) */}
          <g>
            <path
              d="M20 120 Q60 100, 100 110 Q140 120, 170 150 Q190 180, 180 210 Q170 240, 130 250 Q90 260, 50 240 Q20 220, 20 180 Q20 150, 20 120"
              fill="rgba(251, 146, 60, 0.2)"
              stroke="rgba(251, 146, 60, 0.5)"
              strokeWidth="2"
            />
            {/* Thai temple silhouette */}
            <g transform="translate(100, 155)">
              <path
                d="M0 30 L-20 30 L-15 20 L-25 20 L-20 10 L-30 10 L0 -25 L30 10 L20 10 L25 20 L15 20 L20 30 L0 30"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="1"
              />
            </g>
          </g>

          {/* USA/Louisiana landmass (RIGHT side) */}
          <g>
            <path
              d="M620 140 Q660 120, 700 130 Q740 140, 760 160 Q780 180, 780 200 Q780 220, 760 240 Q740 260, 700 260 Q660 260, 630 240 Q600 220, 600 180 Q600 160, 620 140"
              fill="rgba(34, 197, 94, 0.2)"
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth="2"
            />
            {/* Fleur-de-lis for New Orleans */}
            <g transform="translate(680, 175) scale(0.5)">
              <path
                d="M0 -30 Q-5 -20, -15 -10 Q-25 0, -20 10 Q-15 20, 0 15 Q15 20, 20 10 Q25 0, 15 -10 Q5 -20, 0 -30"
                fill="#c9a227"
                stroke="#a88620"
                strokeWidth="2"
              />
              <rect x="-3" y="10" width="6" height="25" fill="#c9a227" />
            </g>
          </g>

          {/* Flight path - dotted background */}
          <path
            d="M120 180 Q300 80, 500 80 Q600 80, 680 180"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
            strokeDasharray="10 8"
          />

          {/* Animated flight path */}
          <path
            d="M120 180 Q300 80, 500 80 Q600 80, 680 180"
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
          {journeySteps.map((step) => {
            const pos = getCatPosition(step.position / 100);
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
                      x={pos.x - 90}
                      y={pos.y - 60}
                      width="180"
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
            <circle cx="120" cy="180" r="14" fill="#f97316" stroke="#ea580c" strokeWidth="3" />
            {isVisible && !reducedMotion && (
              <circle cx="120" cy="180" r="14" fill="none" stroke="#f97316" strokeWidth="2">
                <animate attributeName="r" from="14" to="30" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="120" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              Bangkok
            </text>
            <text x="120" y="232" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
              Thailand
            </text>
          </g>

          {/* New Orleans marker */}
          <g>
            <circle cx="680" cy="180" r="14" fill="#22c55e" stroke="#16a34a" strokeWidth="3" />
            {isVisible && !reducedMotion && (
              <circle cx="680" cy="180" r="14" fill="none" stroke="#22c55e" strokeWidth="2">
                <animate attributeName="r" from="14" to="30" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
            <text x="680" y="215" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">
              New Orleans
            </text>
            <text x="680" y="232" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="12">
              Louisiana
            </text>
          </g>

          {/* Animated Black Cat wearing tropical shirt */}
          {isVisible && (
            <g
              style={{
                transform: `translate(${catPos.x}px, ${catPos.y}px)`,
              }}
            >
              <g transform="translate(-25, -30)">
                {/* Cat body with tropical shirt */}
                <ellipse cx="25" cy="35" rx="18" ry="14" fill="url(#tropicalPattern)" />

                {/* Cat head */}
                <ellipse cx="25" cy="15" rx="14" ry="12" fill="#1f2937" />

                {/* Ears */}
                <path d="M12 10 L8 -2 L18 6 Z" fill="#1f2937" />
                <path d="M32 6 L42 -2 L38 10 Z" fill="#1f2937" />
                <path d="M13 8 L10 1 L17 6 Z" fill="#ff6b9d" />
                <path d="M33 6 L40 1 L37 8 Z" fill="#ff6b9d" />

                {/* Eyes */}
                <ellipse cx="19" cy="13" rx="4" ry="5" fill="#22c55e" />
                <ellipse cx="31" cy="13" rx="4" ry="5" fill="#22c55e" />
                <ellipse cx="19" cy="13" rx="2" ry="3" fill="black" />
                <ellipse cx="31" cy="13" rx="2" ry="3" fill="black" />
                <circle cx="18" cy="11" r="1.5" fill="white" />
                <circle cx="30" cy="11" r="1.5" fill="white" />

                {/* Nose */}
                <path d="M25 18 L22 22 L28 22 Z" fill="#ff6b9d" />

                {/* Whiskers */}
                <g stroke="#666" strokeWidth="0.5" strokeLinecap="round">
                  <line x1="8" y1="16" x2="17" y2="17" />
                  <line x1="8" y1="19" x2="17" y2="19" />
                  <line x1="8" y1="22" x2="17" y2="21" />
                  <line x1="42" y1="16" x2="33" y2="17" />
                  <line x1="42" y1="19" x2="33" y2="19" />
                  <line x1="42" y1="22" x2="33" y2="21" />
                </g>

                {/* Tail */}
                <path
                  d="M40 35 Q55 30, 55 20 Q55 10, 50 15"
                  stroke="#1f2937"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    transformOrigin: "40px 35px",
                    animation: reducedMotion ? "none" : "tailWag 0.4s ease-in-out infinite alternate",
                  }}
                />

                {/* Front legs */}
                <rect x="15" y="42" width="6" height="10" rx="3" fill="#1f2937" />
                <rect x="29" y="42" width="6" height="10" rx="3" fill="#1f2937" />
              </g>
            </g>
          )}

          {/* Journey label */}
          <g transform="translate(400, 50)">
            <text fill="rgba(255,255,255,0.6)" fontSize="14" textAnchor="middle">
              Bangkok finds → New Orleans style
            </text>
          </g>
        </svg>
      </div>

      {/* Journey steps - mobile friendly */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {journeySteps.map((step, index) => {
          const isActive = progress >= step.position;
          const icons = ["🛍️", "✨", "📦", "✈️", "🎉"];

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
