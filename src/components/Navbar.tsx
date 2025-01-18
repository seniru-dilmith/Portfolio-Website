import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, handleLogout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle visibility of navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsVisible(false); // Hide navbar on scroll down
      } else {
        setIsVisible(true); // Show navbar on scroll up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Framer Motion Variants
  const navbarVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const menuItemVariants = {
    hover: {
      scale: 1.1,
      color: '#E91E63',
      textShadow: '0px 0px 8px rgba(233, 30, 99, 0.8)',
      transition: { duration: 0.3 },
    },
  };

  const mobileMenuVariants = {
    open: { height: 'auto', opacity: 1 },
    closed: { height: 0, opacity: 0 },
  };

  return (
    <>
      {/* Navbar */}
      <motion.div
        className="fixed top-0 left-0 w-full bg-neutral-100 bg-opacity-90 text-gray-800 z-50 shadow-lg"
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        variants={navbarVariants}
      >
        <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
          {/* Logo */}
          <div className="text-xl font-bold tracking-wide">
            <Link href="/">Hi, It&rsquo;s me Seniru!</Link>
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
                <path d="M6 22H42V26H6zM6 10H42V14H6zM6 34H42V38H6z"></path>
              </svg>
            </motion.div>
          </button>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex space-x-6">
            {['Home', 'Features', 'Solutions', 'Pricing', 'Projects', 'About'].map((item, index) => (
              <motion.div
                key={index}
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer"
              >
                <Link href={`/${item === 'Home' ? '' : item.toLowerCase()}`}>{item}</Link>
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
          id="mobile-menu"
          className="lg:hidden bg-neutral-100 text-gray-100 overflow-hidden"
          initial="closed"
          animate={isMenuOpen ? 'open' : 'closed'}
          variants={mobileMenuVariants}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <nav className="flex flex-col items-center py-4 space-y-4">
            {['Home', 'Features', 'Solutions', 'Pricing', 'Projects', 'About'].map((item, index) => (
              <motion.div
                key={index}
                whileHover="hover"
                variants={menuItemVariants}
                className="text-lg font-medium cursor-pointer"
                onClick={() => setIsMenuOpen(false)}
              >
                <Link href={`/${item === 'Home' ? '' : item.toLowerCase()}`}>{item}</Link>
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

      {/* Content below navbar */}
      <div className={`pt-16 ${isMenuOpen ? 'lg:pt-64' : 'pt-16'}`}>
        {/* Page content goes here */}
      </div>
    </>
  );
};

export default Navbar;
