import { motion } from 'framer-motion';
import Head from 'next/head';

const Hero = () => (
  <motion.div 
    className="text-center py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <h1 className="text-4xl font-bold">Hi! Welcome to my place...</h1>
  </motion.div>
);

export default Hero;
