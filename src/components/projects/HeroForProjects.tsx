import { motion } from 'framer-motion';

const HeroForProjects = () => (
  <motion.div 
    className="text-center py-20 bg-gradient-to-r from-primary to-secondary text-white"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <h1 className="pt-16 text-4xl font-bold">Hi! See the projects that I have done!</h1>
  </motion.div>
);

export default HeroForProjects;
