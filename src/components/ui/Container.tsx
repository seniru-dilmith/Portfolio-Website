"use client";

import { ReactNode } from "react";
import { motion, MotionProps } from "framer-motion";

interface ContainerProps {
  /** Content to be rendered inside the container */
  children: ReactNode;
  /** Maximum width class */
  maxWidth?: string;
  /** Padding classes */
  padding?: string;
  /** Additional CSS classes */
  className?: string;
  /** Whether to add motion animation */
  animated?: boolean;
  /** Motion animation props */
  motionProps?: MotionProps;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "max-w-7xl",
  padding = "px-4 sm:px-6 lg:px-8",
  className = "",
  animated = true,
  motionProps = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.2 }
  },
}) => {
  const containerClasses = `mx-auto ${maxWidth} ${className}`;
  const contentClasses = padding;

  if (animated) {
    return (
      <div className={containerClasses}>
        <motion.div className={contentClasses} {...motionProps}>
          {children}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  );
};

export default Container;
