"use client";

import { motion } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ErrorDisplayProps {
  /** Error message to display */
  error: string | null;
  /** Function to dismiss the error */
  onDismiss?: () => void;
  /** Whether the error is dismissible */
  dismissible?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Error type for styling */
  type?: "error" | "warning" | "info";
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onDismiss,
  dismissible = false,
  className = "p-8 text-center relative z-20",
  type = "error",
}) => {
  if (!error) return null;

  const getColorClasses = () => {
    switch (type) {
      case "warning":
        return "text-yellow-500 bg-yellow-50 border-yellow-200";
      case "info":
        return "text-blue-500 bg-blue-50 border-blue-200";
      default:
        return "text-red-500 bg-red-50 border-red-200";
    }
  };

  return (
    <motion.div
      className={`${className} ${getColorClasses()} border rounded-lg`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-center gap-2">
        <AlertCircle className="w-5 h-5" />
        <span>{error}</span>
        {dismissible && onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-2 p-1 hover:bg-opacity-20 hover:bg-current rounded"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorDisplay;
