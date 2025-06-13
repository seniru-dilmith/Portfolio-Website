"use client";
import Head from "next/head";
import { motion } from "framer-motion";
import HeroForHome from "@/components/carousal/HeroForHome";
import Footer from "@/components/footer/Footer";

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
    <>
      <Head>
        <title>Welcome to Seniru&rsquo;s Place</title>
        <meta
          name="description"
          content="Welcome to my personal website. I'm Seniru Dilmith, a passionate full stack developer specializing in web development, cyber security, and cloud computing."
        />
        <meta
          name="keywords"
          content="Seniru Dilmith, Full Stack Developer, Web Developer, AI, Cloud, Portfolio, React, Next.js"
        />
        <meta name="author" content="Seniru Dilmith" />
        <meta
          property="og:title"
          content="Seniru Dilmith - Full Stack Developer | Portfolio"
        />
        <meta
          property="og:description"
          content="Explore my projects, skills, and experience in software development and cloud computing."
        />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://seniru.dev" />
        <meta
          name="twitter:title"
          content="Seniru Dilmith - Full Stack Developer"
        />
        <meta
          name="twitter:description"
          content="Explore my portfolio and projects in AI, Web, and Cloud Computing."
        />
        <meta name="twitter:image" content="/favicon.ico" />
        <meta name="robots" content="index, follow" />
      </Head>

      <motion.div
        className="h-full flex flex-col bg-gradient-to-br from-primary/50 via-secondary/40 to-accent/30"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section with Animation */}
        <motion.div variants={fadeIn} className="flex-grow flex">
          <HeroForHome />
        </motion.div>

        {/* Footer with Animation */}
        <motion.div variants={fadeIn}>
          <Footer />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Home;
