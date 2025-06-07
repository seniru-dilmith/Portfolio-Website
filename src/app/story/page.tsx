"use client";
import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import UpperImageSection from "@/components/story/UpperImageSection";
import MilestoneList from "@/components/story/MilestoneList";
import AboutMe from "@/components/story/MyStory";
import JourneyContinues from "@/components/story/JorneyConinues";
import FloatingSvg from "@/components/story/FloatingSvg";
import { containerVariants, bounceIn } from "@/components/story/animations";

const Story: React.FC = () => {
  // Music-themed SVG paths for floating animations
  const musicSvgPaths = [
    // Musical note
    "M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z",
    // Treble clef
    "M12.5 2C9.46 2 7 4.46 7 7.5c0 .83.19 1.61.52 2.31L9 11.29V17c0 1.66 1.34 3 3 3s3-1.34 3-3v-5.71l1.48-1.48c.33-.7.52-1.48.52-2.31C17 4.46 14.54 2 11.5 2zm0 3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S11 7.83 11 7.5s.67-1.5 1.5-1.5z",
    // Music notes
    "M12 3l.01 10.55c-.59-.34-1.27-.55-2.01-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6zm8.5 6c-.57 0-1.08.19-1.5.51v5.44c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V9.5c.57 0 1.08-.19 1.5-.51V9z",
    // Headphones
    "M12 3a9 9 0 0 0-9 9v7c0 1.11.89 2 2 2h2v-8H5v-1a7 7 0 1 1 14 0v1h-2v8h2c1.11 0 2-.89 2-2v-7a9 9 0 0 0-9-9z",
    // Microphone
    "M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z",
  ];

  return (
    <>
      <Head>
        <title>My Story - Sniru Dilmith</title>
        <meta
          name="description"
          content="Read articles on web development, AI, cloud computing, and technology trends."
        />
        <meta
          name="keywords"
          content="Tech Blog, AI, Web Development, Cloud Computing, Programming, Next.js"
        />
        <meta property="og:title" content="Blog - Seniru Dilmith" />
        <meta
          property="og:description"
          content="Read the latest articles on AI, web development, and software engineering."
        />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://seniru.dev/story" />
        <meta name="twitter:title" content="My Story - Seniru Dilmith" />
        <meta
          name="twitter:description"
          content="Insights on AI, Web Development, and Cloud Computing."
        />
        <meta name="robots" content="index, follow" />
      </Head>{" "}
      <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-accent text-primary-content overflow-x-hidden relative">
        {/* Animated Background Overlay with subtle pulsing effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none"
          animate={{
            background: [
              "linear-gradient(45deg, var(--primary)/0.2, transparent, var(--accent)/0.2)",
              "linear-gradient(135deg, var(--accent)/0.3, transparent, var(--primary)/0.1)",
              "linear-gradient(225deg, var(--secondary)/0.2, transparent, var(--accent)/0.3)",
              "linear-gradient(315deg, var(--primary)/0.2, transparent, var(--accent)/0.2)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {/* Floating Music SVGs */}
        {musicSvgPaths.map((path, index) => (
          <FloatingSvg key={`primary-${index}`} svgPath={path} />
        ))}
        {/* Additional floating elements for more density */}
        {Array.from({ length: 12 }).map((_, index) => (
          <FloatingSvg
            key={`extra-${index}`}
            svgPath={musicSvgPaths[index % musicSvgPaths.length]}
            className={`opacity-${60 + (index % 4) * 10}`}
          />
        ))}{" "}
        {/* Smaller ambient particles */}
        {Array.from({ length: 6 }).map((_, index) => (
          <FloatingSvg
            key={`ambient-${index}`}
            svgPath={musicSvgPaths[index % 2]}
            className="opacity-30"
          />
        ))}
        {/* Subtle star-like particles */}
        {Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={`star-${index}`}
            className="fixed pointer-events-none z-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
            }}
          >
            <div className="w-1 h-1 bg-white/40 rounded-full" />
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            minHeight: "100vh",
            background:
              "linear-gradient(to bottom, var(--primary), var(--secondary), var(--accent))",
            overflow: "hidden",
          }}
        >
          {" "}
          <div className="relative z-30">
            <Navbar />
          </div>
          <motion.div
            className="container mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8 relative z-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {" "}
            <motion.div
              whileHover={{
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <UpperImageSection />
              <MilestoneList />
              <JourneyContinues />
            </motion.div>
          </motion.div>
          <motion.div variants={bounceIn} className="relative z-20">
            {" "}
            <motion.div
              className="rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-6 md:p-8 mb-8"
              whileHover={{
                scale: 1.02,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <AboutMe />
            </motion.div>{" "}
          </motion.div>{" "}
          <div className="relative z-20">
            <Footer />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Story;
