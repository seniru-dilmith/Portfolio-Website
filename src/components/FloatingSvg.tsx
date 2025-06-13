"use client";

import { motion } from "framer-motion";
import { FloatingSvgProps } from "@/types/FloatingMusic";
import { useHydration } from "@/hooks/useHydration";
import { useState, useEffect } from "react";

const FloatingSvg: React.FC<FloatingSvgProps> = ({
  svgPath,
  className = "",
}) => {  const isHydrated = useHydration();
  const [animationValues, setAnimationValues] = useState({
    randomDelay: 0,
    randomDuration: 15,
    randomX: 0,
    randomRotation: 360,
    randomScale: 1,
    randomLeft: 50,
    randomTop: 0,
    pageHeight: 0,
  });
  
  // State for color cycling
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  // Generate random values only after hydration to prevent SSR/client mismatch
  useEffect(() => {
    if (isHydrated) {
      const pageHeight = window.innerHeight;
      setAnimationValues({
        randomDelay: Math.random() * 5,
        randomDuration: 15 + Math.random() * 10,
        randomX: Math.random() * 200 - 100, // -100 to 100
        randomRotation: Math.random() * 720 + 360, // 360 to 1080 degrees
        randomScale: 0.5 + Math.random() * 1, // 0.5 to 1.5
        randomLeft: Math.random() * 100,
        randomTop: Math.random() * pageHeight,
        pageHeight,
      });
      
      // Set initial random color index
      setCurrentColorIndex(Math.floor(Math.random() * 7)); // 7 colors available
    }
  }, [isHydrated]);

  // Color cycling effect - change color every second
  useEffect(() => {
    if (!isHydrated) return;
    
    const colorInterval = setInterval(() => {
      setCurrentColorIndex(prevIndex => (prevIndex + 1) % 7); // Cycle through 7 colors
    }, 10000); // Change every 10 seconds

    return () => clearInterval(colorInterval);
  }, [isHydrated]);

  // Don't render until hydrated to prevent mismatch
  if (!isHydrated) {
    return null;
  }
  const {
    randomDelay,
    randomDuration,
    randomX,
    randomRotation,
    randomScale,
    randomLeft,
    pageHeight,
  } = animationValues;  // Color values for smooth transitions (using CSS custom properties or hex values)
  const colorValues = [
    "#3b82f6", // primary blue
    "#8b5cf6", // secondary purple
    "#06b6d4", // accent cyan
    "#10b981", // success green
    "#f59e0b", // warning amber
    "#ef4444", // error red
    "#ec4899", // pink
  ];

  // Use current color index for cycling
  const selectedColor = colorValues[currentColorIndex];

  const floatingVariants = {
    initial: {
      y: 0,
      x: 0,
      rotate: 0,
      scale: randomScale,
      opacity: 0,
    },
    animate: {
      y: -(pageHeight + 200),
      x: [0, randomX, -randomX * 0.5, randomX * 0.8, 0],
      rotate: randomRotation,
      scale: [randomScale, randomScale * 1.2, randomScale * 0.8, randomScale],
      opacity: [0, 1, 1, 1, 0],
      transition: {
        duration: randomDuration,
        delay: randomDelay,
        ease: "linear",
        repeat: Infinity,
        repeatDelay: animationValues.randomDelay * 0.6,
      },
    },  };

  return (
    <motion.div
      className={`fixed pointer-events-none z-10 ${className}`}
      style={{
        left: `${randomLeft}%`,
        top: `${animationValues.randomTop}px`,
      }}
      variants={floatingVariants}
      initial="initial"
      animate="animate"
    >
      {" "}      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        className="fill-current"
        animate={{
          fill: selectedColor,
          filter: [
            "hue-rotate(0deg) brightness(1)",
            "hue-rotate(90deg) brightness(1.2)",
            "hue-rotate(180deg) brightness(0.8)",
            "hue-rotate(270deg) brightness(1.1)",
            "hue-rotate(360deg) brightness(1)",
          ],
        }}
        transition={{
          fill: {
            duration: 1,
            ease: "easeInOut",
          },
          filter: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        <path d={svgPath} />
      </motion.svg>
    </motion.div>
  );
};

export default FloatingSvg;
