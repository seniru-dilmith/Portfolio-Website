/**
 * Simple test component to check hydration issues
 * This component will help us identify if hydration is working correctly
 */
"use client";

import { useHydration } from "@/hooks/useHydration";
import { useState, useEffect } from "react";

export default function HydrationTest() {
  const isHydrated = useHydration();
  const [localStorageValue, setLocalStorageValue] = useState<string | null>(null);

  useEffect(() => {
    if (isHydrated) {
      setLocalStorageValue(localStorage.getItem("theme"));
      console.log("Hydration test - Theme from localStorage:", localStorage.getItem("theme"));
      console.log("Hydration test - Current data-theme:", document.documentElement.getAttribute("data-theme"));
    }
  }, [isHydrated]);

  if (!isHydrated) {
    return <div className="p-4 bg-yellow-100 border border-yellow-400 rounded">Loading...</div>;
  }

  return (
    <div className="p-4 bg-green-100 border border-green-400 rounded">
      <h3 className="font-bold">Hydration Test</h3>
      <p>Hydrated: {isHydrated ? "✓" : "✗"}</p>
      <p>Theme from localStorage: {localStorageValue || "not set"}</p>
      <button
        onClick={() => {
          const newTheme = localStorageValue === "dark" ? "emerald" : "dark";
          localStorage.setItem("theme", newTheme);
          setLocalStorageValue(newTheme);
          document.documentElement.setAttribute("data-theme", newTheme);
        }}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
      >
        Toggle Theme
      </button>
    </div>
  );
}
