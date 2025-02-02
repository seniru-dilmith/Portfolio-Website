import Head from 'next/head';
import { motion } from 'framer-motion';
import HeroForHome from '@/components/carousal/HeroForHome';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="min-h-screen overflow-hidden flex flex-col bg-gradient-to-br from-primary/50 via-secondary/40 to-accent/30"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Head>
        <title>Welcome to Seniru&rsquo;s Place</title>
        <meta name="description" content="Home Page" />
      </Head>

      {/* Navbar with Animation */}
      <motion.div variants={fadeIn}>
        <Navbar pushContentDown={false} />
      </motion.div>

      {/* Hero Section with Animation */}
      <motion.div variants={fadeIn} className="flex-grow flex">
        <HeroForHome />
      </motion.div>

      {/* Footer with Animation */}
      <motion.div variants={fadeIn}>
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Home;
