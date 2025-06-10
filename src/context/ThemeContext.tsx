"use client";
import { createContext, useEffect, useState, ReactNode } from "react";
import { ThemeContextType } from "@/types/ThemeContext";
import { useHydration } from "@/hooks/useHydration";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<string>("emerald"); // Always start with emerald for consistency
    const isHydrated = useHydration();

    // Handle initial theme setup after hydration
    useEffect(() => {
        if (!isHydrated) return;
        
        const storedTheme = localStorage.getItem("theme") || "emerald";
        setTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
    }, [isHydrated]);

    // Update theme when changed (only after hydration)
    useEffect(() => {
        if (isHydrated) {
            document.documentElement.setAttribute("data-theme", theme);
        }
    }, [theme, isHydrated]);    // Toggle theme function
    const toggleTheme = () => {
        if (!isHydrated) return; // Don't toggle before hydration
        
        const newTheme = theme === "emerald" ? "dark" : "emerald";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
