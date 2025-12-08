"use client";

import React from "react";
import { motion } from "framer-motion";

const HeroForContact: React.FC = () => {
  return (
    <section className="relative min-h-[50vh] flex flex-col items-center justify-center p-8 overflow-hidden text-center pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-3xl"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Have a question, a project, or just want to say hi? I&rsquo;m here
          to help you. Reach out, and let&rsquo;s create something amazing
          together!
        </p>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:14px_24px]"></div>
    </section>
  );
};

export default HeroForContact;
