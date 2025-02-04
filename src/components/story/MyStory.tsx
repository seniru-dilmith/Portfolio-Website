import { motion } from 'framer-motion';
import React from 'react';

const MyStory = () => {
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const headingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    };

    const decorativeVariants = {
        hidden: { opacity: 0, scale: 0.5, rotate: 0 },
        visible: { opacity: 1, scale: 1, rotate: 360, transition: { duration: 1 } },
    };

    return (
        <section className="py-16 px-6 sm:px-12 lg:px-24 mx-4 sm:mx-8 lg:mx-16 bg-gradient-to-br from-primary via-secondary to-accent text-primary-content rounded-lg shadow-lg">
            {/* Heading */}
            <motion.h2
                className="text-5xl font-bold text-white mb-12 text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={headingVariants}
            >
                My Story
            </motion.h2>

            {/* Paragraphs */}
            <motion.p
                className="text-lg text-gray-200 leading-relaxed text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={textVariants}
            >
                Hi, I&rsquo;m <span className="font-semibold text-yellow-400">Seniru Dilmith</span>, a passionate Computer Science and Engineering undergraduate at the University of Moratuwa, Sri Lanka. I specialize in software development, networking, and creative problem-solving.
            </motion.p>

            <motion.p
                className="mt-6 text-lg text-gray-300 leading-relaxed text-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={textVariants}
            >
                Beyond coding, I am a music enthusiast and enjoy creating melodies on my keyboard. I am also actively involved in organizing events at MoraSpirit, where I contribute to fostering creativity and collaboration.
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
                className="mt-12 flex justify-center gap-16 md:gap-60"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.6 }}
                variants={decorativeVariants}
            >
                <motion.div
                    className="w-8 h-8 bg-base-300 rounded-full shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                ></motion.div>
                <motion.div
                    className="w-8 h-8 bg-base-300 rounded-full shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                ></motion.div>
                <motion.div
                    className="w-8 h-8 bg-base-300 rounded-full shadow-lg"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                ></motion.div>
            </motion.div>
        </section>
    );
};

export default MyStory;
