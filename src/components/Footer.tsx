import React from 'react';
import { motion } from 'framer-motion';
import links from '@/components/footer/links';

const Footer: React.FC = () => {
  return (
    <footer className="z-50 overflow-hidden bg-base-200 py-10 rounded-t-lg shadow-inner">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 space-y-8 md:space-y-0">
        
        {/* Left Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm text-center md:text-left text-base-content"
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        >
          <p className="text-lg font-semibold text-accent">
            &copy; 2025 Seniru Dilmith.
          </p>
          <p className="text-base-content">Made with ❤️ and creativity.</p>
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
                className="btn btn-circle btn-outline text-accent hover:text-white hover:bg-primary hover:shadow-md transition-all duration-300"
                aria-label={link.label}
              >
                <i className={link.iconClass}></i>
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="text-sm text-base-content">
            Powered by innovation and passion to bring something new to the world!
          </div>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm md:text-base text-center md:text-right text-base-content"
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.4 }}
        >
          <p>
            Built using <span className="text-accent font-semibold">Next.js</span> and{' '}
            <span className="text-accent font-semibold">Daisy UI</span>.
          </p>
          <p className="text-base-content">Designed for excellence.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
