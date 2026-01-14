"use client";

import { useState, useEffect, useCallback } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface CatEasterEggProps {
  variant: "logo" | "footer";
  className?: string;
}

export function CatEasterEgg({ variant, className = "" }: CatEasterEggProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isVisible, setIsVisible] = useState(variant === "logo");
  const [hasAppearedOnce, setHasAppearedOnce] = useState(false);
  const reducedMotion = useReducedMotion();

  // Footer peek behavior
  useEffect(() => {
    if (variant !== "footer") return;

    const handleScroll = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;

      if (scrolledToBottom && !hasAppearedOnce) {
        setIsVisible(true);
        setHasAppearedOnce(true);
        // Blink once when appearing
        setTimeout(() => {
          setIsBlinking(true);
          setTimeout(() => setIsBlinking(false), 200);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [variant, hasAppearedOnce]);

  // Logo hover blink
  const handleMouseEnter = useCallback(() => {
    if (variant === "logo" && !reducedMotion) {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }
  }, [variant, reducedMotion]);

  const handleClick = useCallback(() => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 3000);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  if (variant === "footer" && !isVisible) {
    return null;
  }

  const catSize = variant === "logo" ? "w-5 h-5" : "w-8 h-8";
  const animationClass = !reducedMotion && variant === "footer" && isVisible
    ? "animate-fade-in"
    : "";

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onKeyDown={handleKeyDown}
        className={`${catSize} cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${animationClass}`}
        aria-label="Black Cat mascot - click for a secret message"
        aria-describedby={showTooltip ? "cat-tooltip" : undefined}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Cat ears */}
          <path d="M4 2 L7 8 L1 8 Z" />
          <path d="M20 2 L23 8 L17 8 Z" />
          {/* Cat head */}
          <ellipse cx="12" cy="13" rx="10" ry="9" />
          {/* Eyes */}
          {isBlinking ? (
            <>
              <line x1="6" y1="11" x2="10" y2="11" stroke="white" strokeWidth="1.5" />
              <line x1="14" y1="11" x2="18" y2="11" stroke="white" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <ellipse cx="8" cy="11" rx="2" ry="2.5" fill="white" />
              <ellipse cx="16" cy="11" rx="2" ry="2.5" fill="white" />
              <circle cx="8" cy="11" r="1" fill="black" />
              <circle cx="16" cy="11" r="1" fill="black" />
            </>
          )}
          {/* Nose */}
          <path d="M12 14 L10.5 16 L13.5 16 Z" fill="#ffa0a0" />
          {/* Whiskers */}
          <line x1="2" y1="15" x2="8" y2="14" stroke="white" strokeWidth="0.5" />
          <line x1="2" y1="17" x2="8" y2="16" stroke="white" strokeWidth="0.5" />
          <line x1="22" y1="15" x2="16" y2="14" stroke="white" strokeWidth="0.5" />
          <line x1="22" y1="17" x2="16" y2="16" stroke="white" strokeWidth="0.5" />
        </svg>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          id="cat-tooltip"
          role="tooltip"
          className="absolute z-50 px-3 py-2 text-xs text-white bg-black rounded shadow-lg whitespace-nowrap bottom-full left-1/2 -translate-x-1/2 mb-2"
        >
          Made in Bangkok. Watching in New Orleans.
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black" />
        </div>
      )}
    </div>
  );
}

// Walking cat for Konami mode
export function WalkingCat({ onComplete }: { onComplete: () => void }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      onComplete();
      return;
    }
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <div
      className="fixed bottom-4 z-[100] pointer-events-none"
      style={{
        animation: "walkAcross 4s linear forwards",
      }}
    >
      <svg
        viewBox="0 0 48 24"
        fill="currentColor"
        className="w-16 h-8"
        aria-hidden="true"
      >
        {/* Walking cat silhouette */}
        <ellipse cx="24" cy="12" rx="12" ry="8" />
        <path d="M10 4 L14 10 L6 10 Z" />
        <path d="M38 4 L42 10 L34 10 Z" />
        <ellipse cx="18" cy="10" rx="1.5" ry="2" fill="white" />
        <ellipse cx="30" cy="10" rx="1.5" ry="2" fill="white" />
        {/* Tail */}
        <path d="M36 12 Q 44 8 46 14" stroke="currentColor" strokeWidth="3" fill="none" />
        {/* Legs */}
        <rect x="14" y="18" width="3" height="6" rx="1" className="animate-pulse" />
        <rect x="20" y="18" width="3" height="6" rx="1" />
        <rect x="26" y="18" width="3" height="6" rx="1" className="animate-pulse" />
        <rect x="32" y="18" width="3" height="6" rx="1" />
      </svg>
    </div>
  );
}
