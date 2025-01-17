import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuHeight, setMenuHeight] = useState(0);

  // Toggle visibility of navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Update the height of the mobile menu dynamically
  useEffect(() => {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
      setMenuHeight(isMenuOpen ? menu.scrollHeight : 0);
    }
  }, [isMenuOpen]);

  // Animations for navbar
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-full bg-neutral-200 bg-opacity-90 text-white z-50 shadow-lg"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={navbarVariants}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          <div className="text-xl font-bold">
            <Link href="/">MySite</Link>
          </div>
          {/* Hamburger Menu Button */}
          <button
            className="lg:hidden block focus:outline-none"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isMenuOpen ? 45 : 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 48 48"
                className="fill-current text-gray-800 hover:text-gray-500"
              >
                <path
                  d="M6 22H42V26H6zM6 10H42V14H6zM6 34H42V38H6z"
                  className={`transition-transform ${isMenuOpen ? 'rotate-45 scale-125' : ''
                    }`}
                ></path>
              </svg>
            </motion.div>
          </button>
          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/solutions">Solutions</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/about">About</Link>
            {isAuthenticated && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </nav>
        </div>
        {/* Mobile Menu */}
        <motion.div
          id="mobile-menu"
          className={`lg:hidden bg-gray-700 bg-opacity-95 overflow-hidden`}
          initial={{ height: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link href="/features" onClick={() => setIsMenuOpen(false)}>
              Features
            </Link>
            <Link href="/solutions" onClick={() => setIsMenuOpen(false)}>
              Solutions
            </Link>
            <Link href="/pricing" onClick={() => setIsMenuOpen(false)}>
              Pricing
            </Link>
            <Link href="/projects" onClick={() => setIsMenuOpen(false)}>
              Projects
            </Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            {isAuthenticated && (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleLogout();
                }}
              >
                Logout
              </button>
            )}
          </nav>
        </motion.div>
      </motion.div>
      {/* Content below navbar */}
      <div
        className="pt-16"
        style={{
          marginTop: `${menuHeight}px`,
          transition: 'margin-top 0.3s ease',
        }}
      >
        {/* Your page content goes here */}
        <div className="p-4">
          <h1 className="text-2xl font-bold">Page Content</h1>
          <p>
            This is the main content of the page. It moves down when the hamburger menu opens
            and moves back up when the menu collapses.
          </p>
        </div>
      </div>
    </>
  );
};

export default Navbar;
