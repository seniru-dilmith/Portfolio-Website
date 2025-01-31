import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { motion } from "framer-motion";

const ThemeToggle = () => {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;

    const { theme, toggleTheme } = themeContext;

    return (
        <button
            className="theme-toggle flex items-center justify-center p-2 rounded-full transition-all shadow-lg bg-gray-200 dark:bg-gray-800"
            type="button"
            title="Toggle theme"
            aria-label="Toggle theme"
            onClick={toggleTheme}
        >
            <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                width="32"
                height="32"
                fill="currentColor"
                className="theme-toggle__icon text-gray-800 dark:text-yellow-400"
                viewBox="0 0 32 32"
                initial={{ rotate: 0, scale: 1 }}
                animate={{
                    rotate: theme === "dark" ? 180 : 0,
                    scale: theme === "dark" ? 1.2 : 1,
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                <clipPath id="theme-toggle__around__cutout">
                    <path d="M0 0h42v30a1 1 0 00-16 13H0Z" />
                </clipPath>
                <g clipPath="url(#theme-toggle__around__cutout)">
                    {/* Moon Icon (Dark Mode) */}
                    <motion.circle
                        cx="16"
                        cy="16"
                        r="8.4"
                        className="fill-current"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: theme === "dark" ? 1 : 0,
                            scale: theme === "dark" ? 1 : 0.8,
                        }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Sun Rays (Light Mode) */}
                    <motion.g
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{
                            opacity: theme === "dark" ? 0 : 1,
                            scale: theme === "dark" ? 0.8 : 1.2,
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        <circle cx="16" cy="3.3" r="2.3" />
                        <circle cx="27" cy="9.7" r="2.3" />
                        <circle cx="27" cy="22.3" r="2.3" />
                        <circle cx="16" cy="28.7" r="2.3" />
                        <circle cx="5" cy="22.3" r="2.3" />
                        <circle cx="5" cy="9.7" r="2.3" />
                    </motion.g>
                </g>
            </motion.svg>
        </button>
    );
};

export default ThemeToggle;
