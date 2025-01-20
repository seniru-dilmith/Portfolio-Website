import React from 'react';
import { motion } from 'framer-motion';
import links from '@/components/footer/links';

const Footer: React.FC = () => {
  return (
    <footer className="z-9999 overflow-hidden bg-gradient-to-br from-primary via-secondary to-accent text-white py-10 rounded-t-lg shadow-inner ">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-8 md:space-y-0">
        {/* Left Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm md:text-base text-center md:text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-lg font-semibold text-white">
            &copy; 2025 <span className="text-accent-content">Seniru Dilmith</span>.
          </p>
          <p className="text-gray-200">Made with ❤️ and creativity.</p>
        </motion.div>

        {/* Center Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center space-y-4 text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
        >
          {/* Social Links */}
          <div className="flex space-x-4">
          {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-circle btn-outline text-white hover:text-black hover:bg-white hover:shadow-lg"
          aria-label={link.label}
        >
          <i className={link.iconClass}></i>
        </a>
      ))}
          </div>

          {/* Bottom Section */}
          <div className="text-sm text-gray-300">
            Powered by innovation and passion to bring something new to the world!
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm md:text-base text-center md:text-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.4 }}
        >
          <p className="text-white">
            Built using <span className="text-accent-content font-semibold">Next.js</span> and{' '}
            <span className="text-accent-content font-semibold">Daisy UI</span>.
          </p>
          <p className="text-gray-200">Designed for excellence.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
