import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { titleNames } from "./navbar/titles";
import ThemeToggle from "./ThemeToggle";

interface NavbarProps {
  pushContentDown?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ pushContentDown = true }) => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Optimize scroll event with useCallback
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
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const menuItemVariants = {
    hover: {
      scale: 1.1,
      color: "#E91E63",
      textShadow: "0px 0px 8px rgba(233, 30, 99, 0.8)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="flex flex-col">
      {/* Navbar */}
      <motion.div
        className={`fixed top-0 left-0 z-50 w-full bg-neutral-50 ${
          pushContentDown ? "bg-opacity-90" : ""
        } text-gray-800 shadow-lg`}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={navbarVariants}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-xl font-bold">
            <Link href="/">Hi, It&rsquo;s me Seniru!</Link>
          </div>

          {/* Theme Toggle Centered in Navbar (Desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
            <ThemeToggle />
          </div>

          {/* Mobile Menu & Theme Toggle */}
          <div className="lg:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="focus:outline-none"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <i className={`fa ${isMenuOpen ? "fa-times" : "fa-bars"} text-2xl text-gray-800 hover:text-gray-500`} />
              </motion.div>
            </button>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">
            {titleNames.map((item, index) => (
              <motion.div
                key={index}
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer"
              >
                <Link href={`/${item === "Home" ? "" : item.toLowerCase()}`}>{item}</Link>
              </motion.div>
            ))}
            {isAuthenticated && (
              <motion.div
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer text-red-500"
              >
                <Link href="/" onClick={handleLogout}>
                  Logout
                </Link>
              </motion.div>
            )}
          </nav>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="lg:hidden bg-neutral-100 text-gray-800 overflow-hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={isMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            {titleNames.map((item, index) => (
              <motion.div
                key={index}
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href={`/${item === "Home" ? "" : item.toLowerCase()}`}>{item}</Link>
              </motion.div>
            ))}
            {isAuthenticated && (
              <motion.div
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer text-red-500"
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
      </motion.div>
    </div>
  );
};

export default Navbar;
