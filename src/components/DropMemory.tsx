"use client";

import { useState, useEffect } from "react";
import { useSessionState } from "@/hooks/useSessionState";

const brandMemories = [
  "Our first shirt took 47 attempts to get the collar right.",
  "The gold accent color? Inspired by a sunset over the Mississippi.",
  "Every button is hand-selected. Yes, really.",
  "Our Bangkok tailor has been sewing for 40 years.",
  "The French Quarter White was designed during a jazz fest.",
  "We once shipped a shirt to Antarctica. True story.",
  "The chambray fabric comes from a 100-year-old Japanese mill.",
  "Our fitting model is named after a street in the Marigny.",
  "The cat? She adopted us, not the other way around.",
  "Each shirt travels 9,000 miles before it reaches you.",
  "We test every fabric by wearing it in NOLA summer heat.",
  "The best shirts are the ones you forget you're wearing.",
];

interface DropMemoryProps {
  className?: string;
  productNote?: string; // Optional product-specific note
}

export function DropMemory({ className = "", productNote }: DropMemoryProps) {
  const [memoryIndex, setMemoryIndex] = useSessionState("drop-memory-index", -1);
  const [memory, setMemory] = useState<string>("");

  useEffect(() => {
    if (productNote) {
      setMemory(productNote);
      return;
    }

    if (memoryIndex === -1) {
      // First visit - pick a random memory
      const randomIndex = Math.floor(Math.random() * brandMemories.length);
      setMemoryIndex(randomIndex);
      setMemory(brandMemories[randomIndex]);
    } else {
      // Returning visit - use the same memory
      setMemory(brandMemories[memoryIndex]);
    }
  }, [memoryIndex, setMemoryIndex, productNote]);

  if (!memory) return null;

  return (
    <aside
      className={`text-sm text-gray-500 italic border-l-2 border-accent/30 pl-4 ${className}`}
      aria-label="A note from Black Cat"
    >
      &ldquo;{memory}&rdquo;
    </aside>
  );
}
