import { motion } from 'framer-motion';
import React from 'react';

const AboutMe = () => {
    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const headingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
    };

    return (
        <section className="py-16 px-6 sm:px-12 lg:px-24 mx-4 sm:mx-8 lg:mx-16">
            {/* Heading */}
            <motion.h2
                className="text-5xl font-bold text-primary-content mb-12 text-center"
                variants={headingVariants}
            >
                My Story
            </motion.h2>

            {/* Paragraphs */}
            <motion.p
                className="text-lg text-base-content leading-relaxed text-center"
                variants={textVariants}
            >
                Hi, I&rsquo;m <span className="font-semibold text-accent">Seniru Dilmith</span>, a passionate Computer Science and Engineering undergraduate at the University of Moratuwa, Sri Lanka. I specialize in software development, networking, and creative problem-solving.
            </motion.p>

            <motion.p
                className="mt-6 text-lg text-base-content leading-relaxed text-center"
                variants={textVariants}
            >
                Beyond coding, I am a music enthusiast and enjoy creating melodies on my keyboard. I am also actively involved in organizing events at MoraSpirit, where I contribute to fostering creativity and collaboration.
            </motion.p>

            {/* Decorative Elements */}
            <motion.div
                className="mt-12 flex justify-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            >
            </motion.div>
        </section>
    );
};

export default AboutMe;
