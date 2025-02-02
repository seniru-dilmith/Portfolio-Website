import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UpperImageSection from '@/components/story/UpperImageSection';
import MilestoneList from '@/components/story/MilestoneList';
import AboutMe from '@/components/story/AboutMe';
import JourneyContinues from '@/components/story/JorneyConinues';
import { containerVariants, bounceIn } from '@/components/story/animations';

const Story: React.FC = () => {
    return (
        <>
            <Head>
                <title>My Story</title>
                <meta name="description" content="Seniru's life Story" />
            </Head>
            <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-accent text-primary-content overflow-x-hidden">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        minHeight: '100vh',
                        background: 'linear-gradient(to bottom, var(--primary), var(--secondary), var(--accent))',
                        overflow: 'hidden',
                    }}
                >
                    <Navbar />
                    <motion.div
                        className="container mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8"
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        <UpperImageSection />
                        <MilestoneList />
                        <JourneyContinues />
                    </motion.div>
                    <motion.div variants={bounceIn}>
                        <AboutMe />
                    </motion.div>
                    <Footer />
                </motion.div>
            </div>
        </>
    );
};

export default Story;
