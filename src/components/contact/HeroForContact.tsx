import React from "react";
import { motion } from "framer-motion";

const HeroForContact: React.FC = () => {
  return (
    <motion.section
      className="relative bg-base-100 text-base-content min-h-[70vh] flex items-center justify-center p-8 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <div className="container mx-auto flex flex-col items-center text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-primary"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Get in Touch
        </motion.h1>
        <motion.p
          className="text-lg font-sans italic font-bold md:text-xl  mb-8 max-w-2xl text-secondary"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Have a question, a project, or just want to say hi? We&rsquo;re here
          to help you. Reach out to us, and let&rsquo;s create something amazing
          together!
        </motion.p>
      </div>
    </motion.section>
  );
};

export default HeroForContact;
