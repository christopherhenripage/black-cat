"use client";

import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface BangkokToNolaPathProps {
  className?: string;
}

const journeySteps = [
  "fabric sourced",
  "pattern cut",
  "sewn with care",
  "shipped across oceans",
  "worn with pride",
];

export function BangkokToNolaPath({ className = "" }: BangkokToNolaPathProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Intersection observer to trigger animation on first view
  useEffect(() => {
    if (hasAnimated || reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsAnimating(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, reducedMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
      onFocus={() => setShowTooltip(true)}
      onBlur={() => setShowTooltip(false)}
      tabIndex={0}
      role="img"
      aria-label="Journey from Bangkok to New Orleans: fabric sourced, pattern cut, sewn with care, shipped across oceans, worn with pride"
    >
      <svg
        viewBox="0 0 400 80"
        className="w-full h-auto max-w-md"
        aria-hidden="true"
      >
        {/* Background dotted path */}
        <path
          d="M 30 50 Q 100 20, 200 40 Q 300 60, 370 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
          className="text-gray-300"
        />

        {/* Animated path overlay */}
        <path
          d="M 30 50 Q 100 20, 200 40 Q 300 60, 370 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray="400"
          className="text-accent"
          style={{
            strokeDashoffset: reducedMotion ? 0 : 400,
            animation:
              isAnimating && !reducedMotion
                ? "drawPath 1.5s ease-out forwards"
                : "none",
          }}
        />

        {/* Bangkok marker */}
        <g>
          <circle cx="30" cy="50" r="6" className="fill-accent" />
          <text
            x="30"
            y="72"
            textAnchor="middle"
            className="text-xs fill-current font-medium"
          >
            Bangkok
          </text>
        </g>

        {/* New Orleans marker */}
        <g>
          <circle
            cx="370"
            cy="30"
            r="6"
            className="fill-accent"
            style={{
              opacity: reducedMotion || !isAnimating ? 1 : 0,
              animation:
                isAnimating && !reducedMotion
                  ? "fadeIn 0.3s ease-out 1.4s forwards"
                  : "none",
            }}
          />
          <text
            x="370"
            y="52"
            textAnchor="middle"
            className="text-xs fill-current font-medium"
            style={{
              opacity: reducedMotion || !isAnimating ? 1 : 0,
              animation:
                isAnimating && !reducedMotion
                  ? "fadeIn 0.3s ease-out 1.5s forwards"
                  : "none",
            }}
          >
            New Orleans
          </text>
        </g>

        {/* Journey dots */}
        {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
          const x = 30 + t * 340;
          const y = 50 - Math.sin(t * Math.PI) * 15 + (t > 0.5 ? -10 : 0);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              className="fill-gray-400"
              style={{
                opacity: reducedMotion || !isAnimating ? 0.6 : 0,
                animation:
                  isAnimating && !reducedMotion
                    ? `fadeIn 0.2s ease-out ${0.3 + i * 0.25}s forwards`
                    : "none",
              }}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute z-50 px-3 py-2 text-xs text-white bg-black rounded shadow-lg pointer-events-none whitespace-nowrap"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y - 40,
            transform: "translateX(-50%)",
          }}
          role="tooltip"
        >
          {journeySteps.join(" → ")}
        </div>
      )}
    </div>
  );
}
