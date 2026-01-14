"use client";

import { useState, useEffect } from "react";
import { useSessionState } from "@/hooks/useSessionState";

interface TimeGreetingProps {
  className?: string;
}

function getGreeting(hour: number): { text: string; emoji: string } {
  // Bangkok is UTC+7, New Orleans is UTC-6 (or -5 during DST)
  // We'll use the user's local time for the greeting

  if (hour >= 5 && hour < 12) {
    return {
      text: "Good morning from the Crescent City",
      emoji: "☀️",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: "Afternoon vibes from NOLA",
      emoji: "🌤️",
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: "Evening hours in New Orleans",
      emoji: "🌆",
    };
  } else {
    return {
      text: "Late night in the Big Easy",
      emoji: "🌙",
    };
  }
}

function getBangkokTime(localHour: number): string {
  // Rough approximation: Bangkok is ~13 hours ahead of New Orleans
  const bangkokHour = (localHour + 13) % 24;
  if (bangkokHour >= 5 && bangkokHour < 12) {
    return "morning in Bangkok";
  } else if (bangkokHour >= 12 && bangkokHour < 17) {
    return "afternoon in Bangkok";
  } else if (bangkokHour >= 17 && bangkokHour < 21) {
    return "evening in Bangkok";
  } else {
    return "night in Bangkok";
  }
}

export function TimeGreeting({ className = "" }: TimeGreetingProps) {
  const [hasShown, setHasShown] = useSessionState("time-greeting-shown", false);
  const [greeting, setGreeting] = useState<{ text: string; emoji: string; bangkok: string } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (hasShown) return;

    const hour = new Date().getHours();
    const greetingData = getGreeting(hour);
    const bangkokNote = getBangkokTime(hour);

    setGreeting({
      ...greetingData,
      bangkok: bangkokNote,
    });

    // Small delay for entrance animation
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // Hide after 6 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setHasShown(true), 500);
    }, 6000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hasShown, setHasShown]);

  if (hasShown || !greeting) return null;

  return (
    <div
      className={`overflow-hidden transition-all duration-500 ${
        isVisible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      } ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="py-3 text-center">
        <p className="text-sm text-gray-600">
          <span className="mr-1" aria-hidden="true">{greeting.emoji}</span>
          {greeting.text}
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-accent">{greeting.bangkok}</span>
        </p>
      </div>
    </div>
  );
}
