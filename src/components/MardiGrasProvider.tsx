"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface MardiGrasContextType {
  isMardiGras: boolean;
  toggleMardiGras: () => void;
  isAutoEnabled: boolean;
}

const MardiGrasContext = createContext<MardiGrasContextType>({
  isMardiGras: false,
  toggleMardiGras: () => {},
  isAutoEnabled: false,
});

export function useMardiGras() {
  return useContext(MardiGrasContext);
}

// Check if we're in Mardi Gras season (Feb 1 through Fat Tuesday)
// Fat Tuesday is 47 days before Easter, but we'll approximate as mid-Feb to early March
function isMardiGrasSeason(): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const day = now.getDate();

  // Approximate Mardi Gras season: Jan 6 (Epiphany) through March 5
  // This covers most years' Fat Tuesday dates
  if (month === 0 && day >= 6) return true; // Jan 6+
  if (month === 1) return true; // All of February
  if (month === 2 && day <= 5) return true; // Early March

  return false;
}

export function MardiGrasProvider({ children }: { children: ReactNode }) {
  const [isMardiGras, setIsMardiGras] = useState(false);
  const [isAutoEnabled, setIsAutoEnabled] = useState(false);

  useEffect(() => {
    // Check URL param for preview mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("mardigras") === "true") {
      setIsMardiGras(true);
      return;
    }

    // Check localStorage for manual toggle
    const stored = localStorage.getItem("mardigras-mode");
    if (stored === "true") {
      setIsMardiGras(true);
      return;
    }

    // Auto-enable during Mardi Gras season
    if (isMardiGrasSeason()) {
      setIsMardiGras(true);
      setIsAutoEnabled(true);
    }
  }, []);

  useEffect(() => {
    // Apply/remove Mardi Gras class to body
    if (isMardiGras) {
      document.body.classList.add("mardi-gras");
    } else {
      document.body.classList.remove("mardi-gras");
    }
  }, [isMardiGras]);

  const toggleMardiGras = () => {
    const newValue = !isMardiGras;
    setIsMardiGras(newValue);
    localStorage.setItem("mardigras-mode", String(newValue));
  };

  return (
    <MardiGrasContext.Provider value={{ isMardiGras, toggleMardiGras, isAutoEnabled }}>
      {children}
      {isMardiGras && <FloatingBeads />}
    </MardiGrasContext.Provider>
  );
}

// Floating beads animation
function FloatingBeads() {
  const [beads, setBeads] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    duration: number;
    color: string;
    size: number;
  }>>([]);

  useEffect(() => {
    // Generate random beads
    const colors = ["#9333ea", "#eab308", "#22c55e"]; // purple, gold, green
    const newBeads = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      color: colors[i % 3],
      size: 6 + Math.random() * 4,
    }));
    setBeads(newBeads);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {beads.map((bead) => (
        <div
          key={bead.id}
          className="absolute rounded-full opacity-60"
          style={{
            left: `${bead.x}%`,
            width: bead.size,
            height: bead.size,
            backgroundColor: bead.color,
            animation: `floatUp ${bead.duration}s linear infinite`,
            animationDelay: `${bead.delay}s`,
            boxShadow: `0 0 ${bead.size}px ${bead.color}`,
          }}
        />
      ))}
    </div>
  );
}

// Mardi Gras toggle button for footer
export function MardiGrasToggle() {
  const { isMardiGras, toggleMardiGras } = useMardiGras();

  return (
    <button
      onClick={toggleMardiGras}
      className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
      title={isMardiGras ? "Disable Mardi Gras mode" : "Enable Mardi Gras mode"}
    >
      <span className="text-lg">{isMardiGras ? "🎭" : "⚜️"}</span>
      <span>{isMardiGras ? "Laissez les bons temps rouler!" : "Mardi Gras Mode"}</span>
    </button>
  );
}
