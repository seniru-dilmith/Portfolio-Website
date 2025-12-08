"use client";

import React from "react";
import { motion } from "framer-motion";
import UpperImageSection from "@/components/story/UpperImageSection";
import MilestoneList from "@/components/story/MilestoneList";
import AboutMe from "@/components/story/MyStory";
import JourneyContinues from "@/components/story/JorneyConinues";
import PageLayout from "@/components/layout/PageLayout";
import { getPageConfig } from "@/constants/pageConfigs";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const AboutPage: React.FC = () => {
    // Reusing 'story' config or we could create a new one. Using 'story' for now as it matches content.
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

                    <div className="my-12">
                        <AboutMe />
                    </div>

                    <MilestoneList />
                    <JourneyContinues />
                </motion.div>
            </motion.div>
        </PageLayout>
    );
};

export default AboutPage;
