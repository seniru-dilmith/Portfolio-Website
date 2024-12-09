import { motion } from 'framer-motion';

const Hero = () => (
  <motion.div 
    className="text-center py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <h1 className="text-4xl font-bold">{ process.env.NEXT_PUBLIC_SITE_NAME }</h1>
  </motion.div>
);

export default Hero;
