import Head from 'next/head';
import Hero from '../components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import AboutMe from '@/components/about/AboutMe';
import Skills from '@/components/about/Skills';
import Contact from '@/components/about/Contact';
import { motion } from 'framer-motion';

const Home = () => {
  // Framer Motion Variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
  };

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const slideIn = {
    hidden: { x: '-100vw' },
    visible: { x: 0, transition: { duration: 1, ease: 'easeOut' } },
  };

  const bounceIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 10 },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerChildren}
      className="bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 min-h-screen"
    >
      <Head>
        <title>Welcome to Seniru&rsquo;s Place</title>
        <meta
          name="description"
          content="Seniru Dilmith - Computer Science Enthusiast and Creator"
        />
      </Head>

      {/* Navbar */}
      <motion.div variants={slideIn}>
        <Navbar />
      </motion.div>

      {/* Hero Section */}
      <motion.div variants={fadeIn}>
        <Hero />
      </motion.div>

      {/* About Me */}
      <motion.div variants={bounceIn}>
        <AboutMe />
      </motion.div>

      {/* Skills Section */}
      <motion.div
        variants={fadeIn}
        className="transition duration-1000 hover:scale-105"
      >
        <Skills />
      </motion.div>

      {/* Contact Section */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        <Contact />
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};

export default Home;
