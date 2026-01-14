"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number; // milliseconds
  direction?: "up" | "down" | "left" | "right";
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: RevealSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, reducedMotion]);

  const getTransform = () => {
    if (reducedMotion || isVisible) return "translate(0, 0)";
    switch (direction) {
      case "up":
        return "translateY(20px)";
      case "down":
        return "translateY(-20px)";
      case "left":
        return "translateX(20px)";
      case "right":
        return "translateX(-20px)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reducedMotion ? 1 : isVisible ? 1 : 0,
        transform: getTransform(),
        transition: reducedMotion ? "none" : "opacity 0.3s ease-out, transform 0.3s ease-out",
      }}
    >
      {children}
    </div>
  );
}
