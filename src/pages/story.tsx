import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { milestones } from '@/components/story/milestones';

const Story: React.FC = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const milestoneVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

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
                    overflow: 'hidden'
                }}
            >
                <Navbar />
                <motion.div
                    className="container mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <motion.h1
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-8 md:mb-12"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 10
                        }}
                    >
                        My Story
                    </motion.h1>
                    <div className="space-y-8 md:space-y-12">
                        {milestones.map((milestone, index) => (
                            <motion.div
                                key={index}
                                variants={milestoneVariants}
                                className={`flex flex-col lg:flex-row gap-6 lg:gap-8 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''} items-center`}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                {/* Content Section */}
                                <motion.div
                                    className="w-full lg:w-1/2 mt-9 p-4 md:p-6 bg-base-100 rounded-lg shadow-lg"
                                    whileHover={{
                                        boxShadow: "0px 10px 20px rgba(0,0,0,0.2)",
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <motion.h2
                                        className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-primary"
                                        initial={{ x: -50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        {milestone.title}
                                    </motion.h2>
                                    <motion.p
                                        className="text-xs md:text-sm font-semibold mb-2 text-secondary"
                                        initial={{ x: -30, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        {milestone.date}
                                    </motion.p>
                                    <motion.p
                                        className="text-sm md:text-base text-gray-600"
                                        initial={{ x: -20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                    >
                                        {milestone.description}
                                    </motion.p>
                                </motion.div>

                                {/* Image Section */}
                                <motion.div
                                    className="w-[80%] lg:w-1/2 p-2 md:p-6"
                                    whileHover={{
                                        rotate: index % 2 === 0 ? 2 : -2,
                                        transition: { duration: 0.3 }
                                    }}
                                >
                                    <motion.div
                                        className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[16/9]"
                                        initial={{
                                            opacity: 0,
                                            scale: 0.9,
                                            x: index % 2 === 0 ? -50 : 50
                                        }}
                                        animate={{
                                            opacity: 1,
                                            scale: 1,
                                            x: 0
                                        }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            damping: 15,
                                            delay: 0.7
                                        }}
                                    >
                                        <Image
                                            src={milestone.image}
                                            alt={milestone.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="rounded-lg shadow-lg border-2 border-accent object-cover"
                                            priority={index === 0}
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                <Footer />
            </motion.div>
        </div>
        </>
    );
};

export default Story;