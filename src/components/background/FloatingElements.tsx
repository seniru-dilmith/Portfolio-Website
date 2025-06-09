"use client";

import { motion } from "framer-motion";
import FloatingSvg from "@/components/FloatingSvg";

interface FloatingElementsProps {
  /** Array of SVG paths to use for floating elements */
  svgPaths: string[];
  /** Number of primary floating elements */
  primaryCount?: number;
  /** Number of extra floating elements for more density */
  extraCount?: number;
  /** Number of ambient (smaller) floating elements */
  ambientCount?: number;
  /** Number of star particles */
  starCount?: number;
  /** Base opacity for star particles */
  starOpacity?: string;
  /** Color for star particles */
  starColor?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  svgPaths,
  primaryCount = 5,
  extraCount = 10,
  ambientCount = 8,
  starCount = 12,
  starOpacity = "25",
  starColor = "accent/60",
}) => {
  return (
    <>
      {/* Primary Floating SVGs */}
      {svgPaths.slice(0, primaryCount).map((path, index) => (
        <FloatingSvg key={`primary-${index}`} svgPath={path} />
      ))}
      
      {/* Additional floating elements for more density */}
      {Array.from({ length: extraCount }).map((_, index) => (
        <FloatingSvg 
          key={`extra-${index}`} 
          svgPath={svgPaths[index % svgPaths.length]} 
          className={`opacity-${50 + (index % 4) * 15}`}
        />
      ))}
      
      {/* Smaller ambient particles */}
      {Array.from({ length: ambientCount }).map((_, index) => (
        <FloatingSvg 
          key={`ambient-${index}`} 
          svgPath={svgPaths[index % Math.min(3, svgPaths.length)]} 
          className={`opacity-${starOpacity}`}
        />
      ))}
      
      {/* Subtle star-like particles */}
      {Array.from({ length: starCount }).map((_, index) => (
        <motion.div
          key={`star-${index}`}
          className="fixed pointer-events-none z-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 6,
            ease: "easeInOut",
          }}
        >
          <div className={`w-1.5 h-1.5 bg-${starColor} rounded-full`} />
        </motion.div>
      ))}
    </>
  );
};

export default FloatingElements;
