"use client";

import { motion } from "framer-motion";
import FloatingSvg from "@/components/FloatingSvg";
import { useHydration } from "@/hooks/useHydration";
import { useState, useEffect } from "react";

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
  customColors?: string[];
}

interface StarParticle {
  id: string;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({
  svgPaths,
  primaryCount = 5,
  extraCount = 10,
  ambientCount = 8,
  starCount = 12,
  starOpacity = "25",
  starColor = "accent/60",
  customColors,
}) => {
  const isHydrated = useHydration();
  const [starParticles, setStarParticles] = useState<StarParticle[]>([]);

  // Generate star particles after hydration to prevent SSR/client mismatch
  useEffect(() => {
    if (isHydrated) {
      const particles: StarParticle[] = Array.from({ length: starCount }, (_, index) => ({
        id: `star-${index}`,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 6,
      }));
      setStarParticles(particles);
    }
  }, [isHydrated, starCount]);

  return (
    <>
      {/* Primary Floating SVGs */}
      {svgPaths.slice(0, primaryCount).map((path, index) => (
        <FloatingSvg key={`primary-${index}`} svgPath={path} customColors={customColors} />
      ))}

      {/* Additional floating elements for more density */}
      {Array.from({ length: extraCount }).map((_, index) => (
        <FloatingSvg
          key={`extra-${index}`}
          svgPath={svgPaths[index % svgPaths.length]}
          className={`opacity-${50 + (index % 4) * 15}`}
          customColors={customColors}
        />
      ))}

      {/* Smaller ambient particles */}
      {Array.from({ length: ambientCount }).map((_, index) => (
        <FloatingSvg
          key={`ambient-${index}`}
          svgPath={svgPaths[index % Math.min(3, svgPaths.length)]}
          className={`opacity-${starOpacity}`}
          customColors={customColors}
        />
      ))}

      {/* Subtle star-like particles - only render after hydration */}
      {isHydrated && starParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-5"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0.3, 1.2, 0.3],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
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
