"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { titleNames } from "./titles";
import ThemeToggle from "./ThemeToggle";
import { NavbarProps } from "@/types/Navbar";

const Navbar: React.FC<NavbarProps> = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);  const pathname = usePathname();

  // Handle scrolling behavior
  const handleScroll = useCallback(() => {
    setIsVisible(window.scrollY < lastScrollY);
    setLastScrollY(window.scrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Framer Motion Variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const menuItemVariants = {
    hover: {
      scale: 1.1,
      color: "#E91E63",
      textShadow: "0px 0px 8px rgba(233, 30, 99, 0.8)",
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    hidden: { y: -20, opacity: 0, height: 0 },
    visible: {
      y: 0,
      opacity: 1,
      height: "auto",
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      y: -20,
      opacity: 0,
      height: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  };

  return (
    <div>
      {/* Navbar */}
      <motion.div
        className={`fixed top-0 left-0 z-50 w-full bg-base-200 text-neutral shadow-lg`}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={navbarVariants}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-xl font-bold text-primary hover:text-primary-focus transition-all duration-300">
            <Link href="/" className="flex items-start gap-2">
              🏠
            </Link>
          </div>

          {/* Theme Toggle Centered in Navbar (Desktop) */}
          <div className="text-warning left-1/2 transform -translate-x-1/2 hidden lg:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <div className="rounded-full text-warning transition-all duration-300">
              <ThemeToggle />
            </div>

            {/* Hamburger Menu Button */}
            <button
              className="rounded-lg text-error transition-all duration-300 focus:outline-none"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <i
                  className={`fa ${
                    isMenuOpen ? "fa-times" : "fa-bars"
                  } text-2xl`}
                />
              </motion.div>
            </button>
          </div>          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">            {titleNames.map((item, index) => {
              const linkPath = `/${item === "Home" ? "" : item.toLowerCase()}`;
              const isActive = pathname === linkPath;
              
              return (
                <motion.div
                  key={index}
                  whileHover="hover"
                  variants={menuItemVariants}                  className={`text-lg font-medium cursor-pointer transition-all duration-300 ${
                    isActive
                      ? "text-success font-bold border-b-2 border-success pb-1"
                      : "text-primary hover:text-secondary"
                  }`}
                >
                  <Link href={linkPath}>{item}</Link>
                </motion.div>
              );
            })}
            {isAuthenticated && (
              <motion.div
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer text-error hover:text-accent transition-colors duration-300"
              >
                <Link href="/" onClick={handleLogout}>
                  Logout
                </Link>
              </motion.div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-base-200 shadow-lg"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
            >
              <nav className="flex flex-col items-center py-4 space-y-4">                {titleNames.map((item, index) => {
                  const linkPath = `/${item === "Home" ? "" : item.toLowerCase()}`;
                  const isActive = pathname === linkPath;
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover="hover"
                      variants={menuItemVariants}                      className={`text-lg font-medium cursor-pointer transition-all duration-300 ${
                        isActive 
                          ? "text-success font-bold border-b-2 border-success pb-1" 
                          : "text-base-content hover:text-accent"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link href={linkPath}>{item}</Link>
                    </motion.div>
                  );
                })}
                {isAuthenticated && (
                  <motion.div
                    whileHover="hover"
                    variants={menuItemVariants}
                    className="text-lg font-medium cursor-pointer text-error"
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    Logout
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Navbar;
