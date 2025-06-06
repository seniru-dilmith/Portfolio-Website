import { motion } from "framer-motion";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.svg
        className="w-16 h-16"
        viewBox="0 0 50 50"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1,
          ease: "linear",
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="5"
          strokeDasharray="90 50"
          strokeLinecap="round"
          className="text-primary"
        />
      </motion.svg>
    </div>
  );
}

export default LoadingSpinner;
