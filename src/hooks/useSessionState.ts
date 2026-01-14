"use client";

import { useState, useEffect, useCallback } from "react";

export function useSessionState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // sessionStorage not available or parse error
    }
    setIsHydrated(true);
  }, [key]);

  const setStoredValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof newValue === "function"
          ? (newValue as (prev: T) => T)(prev)
          : newValue;
        try {
          sessionStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // sessionStorage not available
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue, isHydrated];
}
