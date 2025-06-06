import { motion } from 'framer-motion';

function SmallLoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-4">
      <motion.svg
        className="w-8 h-8"
        viewBox="0 0 50 50"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
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

export default SmallLoadingSpinner;
