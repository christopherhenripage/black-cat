"use client";

import { useState, useEffect } from "react";

interface BlackCatLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  color?: "black" | "white" | "accent";
}

export function BlackCatLogo({
  className = "",
  size = "md",
  animated = true,
  color = "black"
}: BlackCatLogoProps) {
  const [isBlinking, setIsBlinking] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  const colorClasses = {
    black: "text-black",
    white: "text-white",
    accent: "text-accent",
  };

  // Automatic periodic blinking
  useEffect(() => {
    if (!animated) return;

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000); // Blink every 4 seconds

    return () => clearInterval(blinkInterval);
  }, [animated]);

  const handleMouseEnter = () => {
    if (animated) {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }
  };

  return (
    <div
      className={`${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <svg
        viewBox="0 0 100 100"
        fill="currentColor"
        className="w-full h-full"
        aria-hidden="true"
      >
        {/* Cat sitting silhouette */}
        {/* Ears */}
        <path d="M25 35 L35 15 L45 35 Z" />
        <path d="M55 35 L65 15 L75 35 Z" />

        {/* Head */}
        <ellipse cx="50" cy="45" rx="28" ry="24" />

        {/* Body */}
        <ellipse cx="50" cy="75" rx="22" ry="20" />

        {/* Tail - curved */}
        <path
          d="M72 75 Q 90 70, 92 50 Q 94 35, 85 30"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes */}
        {isBlinking ? (
          <>
            <line x1="36" y1="42" x2="46" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="54" y1="42" x2="64" y2="42" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            {/* Left eye */}
            <ellipse cx="41" cy="42" rx="6" ry="7" fill="#22c55e" />
            <ellipse cx="41" cy="42" rx="3" ry="5" fill="black" />
            <circle cx="39" cy="40" r="1.5" fill="white" />

            {/* Right eye */}
            <ellipse cx="59" cy="42" rx="6" ry="7" fill="#22c55e" />
            <ellipse cx="59" cy="42" rx="3" ry="5" fill="black" />
            <circle cx="57" cy="40" r="1.5" fill="white" />
          </>
        )}

        {/* Nose */}
        <path d="M50 50 L47 54 L53 54 Z" fill="#ff6b9d" />

        {/* Whiskers */}
        <g stroke="white" strokeWidth="1" strokeLinecap="round">
          <line x1="25" y1="48" x2="38" y2="50" />
          <line x1="25" y1="52" x2="38" y2="52" />
          <line x1="25" y1="56" x2="38" y2="54" />
          <line x1="75" y1="48" x2="62" y2="50" />
          <line x1="75" y1="52" x2="62" y2="52" />
          <line x1="75" y1="56" x2="62" y2="54" />
        </g>
      </svg>
    </div>
  );
}

// Minimalist cat icon for header/small spaces
export function BlackCatIcon({ className = "", size = "sm" }: { className?: string; size?: "sm" | "md" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {/* Simplified cat face */}
      {/* Ears */}
      <path d="M4 8 L7 2 L10 8 Z" />
      <path d="M14 8 L17 2 L20 8 Z" />
      {/* Head */}
      <ellipse cx="12" cy="14" rx="10" ry="9" />
      {/* Eyes */}
      <ellipse cx="8" cy="12" rx="2" ry="2.5" fill="#22c55e" />
      <ellipse cx="16" cy="12" rx="2" ry="2.5" fill="#22c55e" />
      <circle cx="8" cy="12" r="1" fill="black" />
      <circle cx="16" cy="12" r="1" fill="black" />
      {/* Nose */}
      <path d="M12 15 L10.5 17 L13.5 17 Z" fill="#ff6b9d" />
    </svg>
  );
}
