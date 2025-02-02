import React from 'react';
import { motion } from 'framer-motion';

const JourneyContinues = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const textVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.3 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-center"
        >
            {/* Content Section */}
            <motion.div
                className="text-center w-full mt-9 p-4 md:p-6 bg-base-100 rounded-lg shadow-lg"
                whileHover={{
                    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
                    scale: 1.02,
                    transition: { duration: 0.3 },
                }}
            >
                <motion.h2
                    className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-primary"
                    variants={textVariants}
                >
                    The Journey Continues
                </motion.h2>
                <motion.p
                    className="text-sm md:text-base text-info"
                    variants={textVariants}
                >
                    The story of growth, learning, and adventure is far from over. With every step forward, new opportunities await, and the journey continues toward an even brighter future.
                </motion.p>
                <motion.div
                    className="text-center relative w-full from-primary to-secondary rounded-lg flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                >
                    <p className="text-warning text-lg md:text-xl lg:text-2xl font-semibold">
                        “Keep moving forward; the best is yet to come.”
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default JourneyContinues;
