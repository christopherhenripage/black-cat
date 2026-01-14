"use client";

import { useState, useRef, useCallback, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface FabricHoverOverlayProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FabricHoverOverlay({
  children,
  className = "",
  disabled = false,
}: FabricHoverOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseEnter = useCallback(() => {
    if (!disabled && !reducedMotion) {
      setShowOverlay(true);
    }
  }, [disabled, reducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setShowOverlay(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(() => {
    if (disabled || reducedMotion) return;
    longPressTimer.current = setTimeout(() => {
      setShowOverlay(true);
    }, 600);
  }, [disabled, reducedMotion]);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    setShowOverlay(false);
  }, []);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {children}

      {/* Fabric texture overlay */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          showOverlay ? "opacity-30" : "opacity-0"
        }`}
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "150px 150px",
          mixBlendMode: "overlay",
        }}
      />

      {/* Subtle linen weave pattern */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          showOverlay ? "opacity-20" : "opacity-0"
        }`}
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          )`,
        }}
      />
    </div>
  );
}
