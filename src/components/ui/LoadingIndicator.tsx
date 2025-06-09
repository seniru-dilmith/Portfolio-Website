"use client";

import { motion } from "framer-motion";
import SmallLoadingSpinner from "@/util/SmallLoadingSpinner";

interface LoadingIndicatorProps {
  /** Loading text to display */
  text?: string;
  /** Whether to show the loading indicator */
  show: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom spinner component */
  customSpinner?: React.ReactNode;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  text = "Loading...",
  show,
  className = "flex flex-col items-center justify-center py-20 relative z-20",
  customSpinner,
}) => {
  if (!show) return null;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {customSpinner || <SmallLoadingSpinner />}
      <motion.p 
        className="mt-4 text-muted-foreground text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

export default LoadingIndicator;
