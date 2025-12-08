"use client";

import React from "react";
import { motion } from "framer-motion";
import links from "@/components/footer/links";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="z-50 overflow-hidden bg-background py-5 rounded-t-lg shadow-inner border-t">
      <div className="w-screen flex flex-col md:flex-row items-center justify-between px-6 md:space-x-6">
        {/* Left Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm text-center md:text-left text-muted-foreground"
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        >
          <p className="text-lg font-semibold text-primary">
            &copy; 2025 Seniru Dilmith.
          </p>
          <p>Made with ❤️ and creativity.</p>
        </motion.div>

        {/* Center Section */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col items-center text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          {/* Social Links */}
          <div className="flex space-x-4 mb-4">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full border bg-background hover:bg-primary/10 hover:text-primary transition-all duration-300"
                aria-label={link.label}
              >
                <i className={link.iconClass}></i>
              </a>
            ))}
          </div>

          {/* Bottom Section */}
          <div className="text-sm text-muted-foreground mb-4">
            Powered by innovation and passion to bring something new to the
            world!
          </div>
          <Link
            href="https://www.buymeacoffee.com/seniru.dilmith"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Image
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              width={160}
              height={40}
              className="hover:opacity-80 transition-opacity duration-300"
            />
          </Link>
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="w-full md:w-1/4 text-sm md:text-base text-center md:text-right text-muted-foreground"
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        >
          <p>
            Built using{" "}
            <span className="text-primary font-semibold">Next.js</span> and{" "}
            <span className="text-primary font-semibold">Shadcn UI</span>.
          </p>
          <p>Designed for excellence.</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
