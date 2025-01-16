import { motion } from 'framer-motion';

const AnimatedSection = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    className="p-8"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {children}
  </motion.div>
);

export default AnimatedSection;
