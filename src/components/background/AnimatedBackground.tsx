"use client";

import { motion } from "framer-motion";

interface AnimatedBackgroundProps {
  /** Primary gradient colors for the background */
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  /** Animation duration in seconds */
  duration?: number;
  /** Opacity of the overlay */
  opacity?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  gradientFrom = "var(--primary)/0.1",
  gradientVia = "transparent",
  gradientTo = "var(--accent)/0.1",
  duration = 10,
  opacity = 1,
}) => {
  const gradientVariations = [
    `linear-gradient(45deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
    `linear-gradient(135deg, ${gradientTo.replace('0.1', '0.2')}, ${gradientVia}, ${gradientFrom.replace('0.1', '0.05')})`,
    `linear-gradient(225deg, var(--secondary)/0.15, ${gradientVia}, ${gradientTo.replace('0.1', '0.2')})`,
    `linear-gradient(315deg, ${gradientFrom}, ${gradientVia}, ${gradientTo})`,
  ];

  return (
    <motion.div 
      className="absolute inset-0 pointer-events-none"
      style={{ opacity }}
      animate={{
        background: gradientVariations
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export default AnimatedBackground;
