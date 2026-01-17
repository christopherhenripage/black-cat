"use client";

import { useState, useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// Shooting star rainbow with black cat riding it - responsive version
export function RainbowCat() {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Show streak every 15 seconds
    const showStreak = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 3000);
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

  // Path defined in viewBox coordinates (0-100 scale)
  // Arc goes from bottom-left to top-right across the viewport
  const rainbowPath = "M -10 80 Q 25 20, 50 35 Q 75 50, 110 15";

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="15%" stopColor="#ff0080" />
            <stop offset="30%" stopColor="#ff8c00" />
            <stop offset="45%" stopColor="#ffff00" />
            <stop offset="60%" stopColor="#00ff00" />
            <stop offset="75%" stopColor="#00bfff" />
            <stop offset="90%" stopColor="#8000ff" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="starGlow">
            <feGaussianBlur stdDeviation="0.3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shooting star arc path */}
        <path
          d={rainbowPath}
          fill="none"
          stroke="url(#rainbowGradient)"
          strokeWidth="0.8"
          strokeLinecap="round"
          filter="url(#starGlow)"
          style={{
            strokeDasharray: 200,
            strokeDashoffset: 200,
            animation: "shootingStar 3s ease-out forwards",
          }}
        />

        {/* Sparkles trailing behind */}
        {[0, 0.03, 0.06, 0.09, 0.12, 0.15].map((delay, i) => (
          <g
            key={i}
            style={{
              offsetPath: `path('${rainbowPath}')`,
              animation: `starHead 3s ease-out ${delay}s forwards`,
            }}
          >
            <g transform={`translate(${-1.5 - i * 1}, ${-4 + (i % 3) * 1.5})`}>
              {/* Star/sparkle shape - scaled for viewBox */}
              <path
                d="M0,-0.6 L0.15,-0.15 L0.6,0 L0.15,0.15 L0,0.6 L-0.15,0.15 L-0.6,0 L-0.15,-0.15 Z"
                fill={["#fff", "#ffff00", "#ff69b4", "#00ffff", "#ff8c00", "#00ff00"][i]}
                style={{
                  animation: `sparkle 0.5s ease-in-out ${i * 0.1}s infinite`,
                  opacity: 1 - i * 0.15,
                  transform: `scale(${1 - i * 0.1})`,
                }}
              />
            </g>
          </g>
        ))}

        {/* Black cat riding the rainbow */}
        <g
          style={{
            offsetPath: `path('${rainbowPath}')`,
            offsetRotate: "auto",
            animation: "starHead 3s ease-out forwards",
          }}
        >
          {/* Cat silhouette - scaled for viewBox (roughly 8x6 units) */}
          <g transform="translate(-7, -11) scale(0.18)">
            {/* Body */}
            <ellipse cx="40" cy="50" rx="20" ry="12" fill="black" />
            {/* Head */}
            <ellipse cx="55" cy="38" rx="14" ry="11" fill="black" />
            {/* Ears */}
            <path d="M48 32 L45 18 L54 28 Z" fill="black" />
            <path d="M62 28 L65 14 L68 28 Z" fill="black" />
            {/* Inner ears */}
            <path d="M49 30 L47 22 L53 28 Z" fill="#ff6b9d" />
            <path d="M63 27 L65 19 L67 27 Z" fill="#ff6b9d" />
            {/* Tail - flowing behind */}
            <path d="M20 48 Q 5 40, 8 28 Q 10 20, 15 24" fill="none" stroke="black" strokeWidth="5" strokeLinecap="round" />
            {/* Eyes - excited! */}
            <ellipse cx="52" cy="36" rx="3" ry="4" fill="#22c55e" />
            <ellipse cx="62" cy="36" rx="3" ry="4" fill="#22c55e" />
            <ellipse cx="52" cy="36" rx="1.5" ry="2" fill="black" />
            <ellipse cx="62" cy="36" rx="1.5" ry="2" fill="black" />
            <circle cx="51" cy="35" r="1" fill="white" />
            <circle cx="61" cy="35" r="1" fill="white" />
            {/* Happy mouth */}
            <path d="M55 42 Q57 45, 59 42" fill="none" stroke="#ff6b9d" strokeWidth="1.5" strokeLinecap="round" />
            {/* Front legs stretched forward */}
            <rect x="60" y="48" width="4" height="10" rx="2" fill="black" transform="rotate(-20, 62, 48)" />
            <rect x="66" y="50" width="4" height="10" rx="2" fill="black" transform="rotate(-30, 68, 50)" />
            {/* Back legs */}
            <rect x="25" y="52" width="4" height="8" rx="2" fill="black" transform="rotate(10, 27, 52)" />
            <rect x="32" y="54" width="4" height="8" rx="2" fill="black" />
          </g>
        </g>
      </svg>
    </div>
  );
}
