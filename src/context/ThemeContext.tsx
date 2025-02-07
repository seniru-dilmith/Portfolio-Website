import { createContext, useEffect, useState, ReactNode } from "react";
import { ThemeContextType } from "@/types/ThemeContext";

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState("emerald");

    // Load theme from localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "emerald";
        setTheme(storedTheme);
        document.documentElement.setAttribute("data-theme", storedTheme);
    }, []);

    // Toggle theme function
    const toggleTheme = () => {
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
