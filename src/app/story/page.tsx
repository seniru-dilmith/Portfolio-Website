"use client";

import React from "react";
import { motion } from "framer-motion";
import UpperImageSection from "@/components/story/UpperImageSection";
import MilestoneList from "@/components/story/MilestoneList";
import AboutMe from "@/components/story/MyStory";
import JourneyContinues from "@/components/story/JorneyConinues";
import PageLayout from "@/components/layout/PageLayout";
import { getPageConfig } from "@/constants/pageConfigs";
import { containerVariants, bounceIn } from "@/components/story/animations";

const Story: React.FC = () => {
  const pageConfig = getPageConfig('story');

  return (
    <PageLayout {...pageConfig}>
      <motion.div
        className="container mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <UpperImageSection />
          <MilestoneList />
          <JourneyContinues />
        </motion.div>
      </motion.div>
      
      <motion.div variants={bounceIn}>
        <motion.div
          className="rounded-3xl mx-4 sm:mx-6 lg:mx-8 p-6 md:p-8 mb-8"
          whileHover={{
            scale: 1.02,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <AboutMe />
        </motion.div>
      </motion.div>
    </PageLayout>
  );
};

export default Story;
