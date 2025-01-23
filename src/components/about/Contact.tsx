import React from 'react';
import { motion } from 'framer-motion';

function Contact() {
    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const popIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const fadeLeft = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    const fadeRight = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } },
    };

    return (
        <section className="py-16 bg-gradient-to-r from-accent via-pink-500 to-red-600 text-white text-center">
            <motion.div
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >

                {/* Contact Email */}
                <motion.a
                    href="mailto:dilmithseniru@gmail.com"
                    className="btn btn-primary btn-lg text-white hover:bg-primary-focus mb-6 shadow-lg transform hover:scale-105 transition"
                    variants={popIn}
                >
                    Contact Me
                </motion.a>

                {/* Social Media Links */}
                <motion.div
                    className="flex justify-center space-x-6 mt-6"
                    variants={fadeInUp}
                >
                    <motion.a
                        href="https://www.youtube.com/channel/UCRmiVlt8wLBN3GSY5uZScgg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-outline text-white hover:bg-white hover:text-red-500 hover:shadow-lg transition duration-300"
                        whileHover={{ scale: 1.5, rotate: 20 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-youtube"></i>
                    </motion.a>
                    <motion.a
                        href="https://www.tiktok.com/@seniru.dilmith"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-circle btn-outline text-white hover:bg-white hover:text-black hover:shadow-lg transition duration-300"
                        whileHover={{ scale: 1.5, rotate: -20 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <i className="fab fa-tiktok"></i>
                    </motion.a>
                </motion.div>

                {/* Personal Details */}
                <motion.div
                    className="mt-10 text-left bg-white text-black p-6 rounded-lg"
                    variants={fadeInUp}
                >
                    <h3 className="text-2xl font-semibold mb-4 text-center">Personal Details</h3>
                    <motion.ul 
    className="space-y-4"
    initial="hidden" 
    animate="visible" 
    variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
    }}
>
    <motion.li
        className="flex justify-between text-lg mb-2 border-b border-gray-300 pb-2"
        variants={fadeLeft}
    >
        <span className="font-bold">Email:</span>
        <span>dilmithseniru@gmail.com</span>
    </motion.li>
    <motion.li
        className="flex justify-between text-lg mb-2 border-b border-gray-300 pb-2"
        variants={fadeRight}
    >
        <span className="font-bold">Phone:</span>
        <span>+94 71 462 5671</span>
    </motion.li>
    <motion.li
        className="flex justify-between text-lg border-b border-gray-300 pb-2"
        variants={fadeLeft}
    >
        <span className="font-bold">Location:</span>
        <span>Horana, Sri Lanka</span>
    </motion.li>
</motion.ul>


                </motion.div>
            </motion.div>
        </section>
    );
}

export default Contact;
