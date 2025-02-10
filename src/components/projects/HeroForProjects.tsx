import { motion } from "framer-motion";
import Link from "next/link";

const HeroForProjects = () => {
  return (
    <motion.div
      className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Hero Title */}
      <motion.h1
        className="text-4xl md:text-5xl font-extrabold leading-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        Hi! Check Out My Projects! 🚀
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        Explore my portfolio of web development, AI, and software engineering
        projects. From full-stack applications to machine learning models,
        here&#39;s what I&#39;ve built!
      </motion.p>

      {/* Animated Call-to-Action */}
      <motion.div
        className="mt-8 flex justify-center space-x-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
      >
        <Link
          href="/contact"
          className="px-6 py-3 bg-base-100 text-primary font-semibold rounded-lg shadow-md hover:bg-primary hover:text-secondary transition-all"
        >
          Contact Me
        </Link>
      </motion.div>

      {/* Floating Icons Animation */}
      <motion.div
        className="absolute inset-x-0 -bottom-10 flex justify-center opacity-60"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
      >
      </motion.div>
    </motion.div>
  );
};

export default HeroForProjects;
