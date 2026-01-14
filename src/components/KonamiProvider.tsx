"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WalkingCat } from "./CatEasterEgg";

interface KonamiContextValue {
  isSecretMode: boolean;
  triggerSecretMode: () => void;
}

const KonamiContext = createContext<KonamiContextValue>({
  isSecretMode: false,
  triggerSecretMode: () => {},
});

export function useKonami() {
  return useContext(KonamiContext);
}

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

interface KonamiProviderProps {
  children: ReactNode;
}

export function KonamiProvider({ children }: KonamiProviderProps) {
  const [isSecretMode, setIsSecretMode] = useState(false);
  const [showCat, setShowCat] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const reducedMotion = useReducedMotion();

  const triggerSecretMode = useCallback(() => {
    if (isSecretMode) return;

    setIsSecretMode(true);
    setShowToast(true);

    if (!reducedMotion) {
      setShowCat(true);
    }

    // Reset after 10 seconds
    setTimeout(() => {
      setIsSecretMode(false);
    }, 10000);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, [isSecretMode, reducedMotion]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.code;
      setInputSequence((prev) => {
        const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

        // Check if sequence matches
        if (
          newSequence.length === KONAMI_CODE.length &&
          newSequence.every((k, i) => k === KONAMI_CODE[i])
        ) {
          triggerSecretMode();
          return [];
        }

        return newSequence;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerSecretMode]);

  const handleCatComplete = useCallback(() => {
    setShowCat(false);
  }, []);

  return (
    <KonamiContext.Provider value={{ isSecretMode, triggerSecretMode }}>
      {/* Accent color override during secret mode */}
      {isSecretMode && (
        <style jsx global>{`
          :root {
            --accent: #ff6b6b !important;
            --accent-light: #ff8e8e !important;
            --accent-dark: #e05555 !important;
          }
        `}</style>
      )}

      {children}

      {/* Walking cat */}
      {showCat && <WalkingCat onComplete={handleCatComplete} />}

      {/* Toast notification */}
      {showToast && (
        <div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-black text-white text-sm rounded-lg shadow-lg animate-fade-in"
          role="status"
          aria-live="polite"
        >
          🐱 Secret mode: ON
        </div>
      )}
    </KonamiContext.Provider>
  );
}
