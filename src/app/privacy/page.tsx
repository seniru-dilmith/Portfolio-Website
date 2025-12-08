"use client";

import React from "react";
import Head from "next/head";
import { motion } from "framer-motion";


const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut",
            staggerChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const PrivacyPolicy = () => {
    return (
        <>
            <Head>
                <title>Privacy Policy - Seniru Dilmith</title>
                <meta
                    name="description"
                    content="Privacy Policy of Seniru Dilmith's website. Learn how we collect, use, and protect your personal information."
                />
                <meta name="robots" content="index, follow" />
            </Head>

            <motion.main
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="min-h-screen bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/80 text-base-content px-4 sm:px-8 md:px-16 py-12"
            >
                <motion.section variants={itemVariants} className="max-w-4xl mx-auto bg-gradient-to-br from-white via-blue-50 to-purple-100 rounded-lg shadow-lg p-8 text-base-content dark:text-accent-content">
                    <h1 className="text-4xl font-extrabold mb-6 text-center text-primary drop-shadow-lg">Privacy Policy</h1>

                    <p className="mb-4">
                        At Seniru Dilmith, your privacy is of utmost importance to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Information We Collect</h2>
                    <ul className="list-disc list-inside space-y-2 text-base-content dark:text-accent-content/90">
                        <li>
                            <strong>Personal Information:</strong> When you contact us or subscribe to newsletters, we may collect your name, email address, and other contact details.
                        </li>
                        <li>
                            <strong>Usage Data:</strong> We collect information about how you interact with our website, including IP addresses, browser type, pages visited, and time spent on pages.
                        </li>
                        <li>
                            <strong>Cookies and Tracking Technologies:</strong> Our site uses cookies to enhance your experience. You can manage cookies via your browser settings.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">How We Use Your Information</h2>
                    <p className="mb-4">
                        We use your information to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-base-content dark:text-accent-content/90">
                        <li>Provide, operate, and maintain our website.</li>
                        <li>Respond to your inquiries and provide customer support.</li>
                        <li>Send newsletters or marketing communications if you have subscribed.</li>
                        <li>Improve our services and analyze website usage.</li>
                    </ul>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Information Sharing and Disclosure</h2>
                    <p>
                        We do not sell, trade, or rent your personal information to others. We may share your information with trusted third parties only to help us operate our website or provide services, subject to confidentiality agreements.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Data Security</h2>
                    <p>
                        We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. You can also unsubscribe from marketing communications at any time by following the unsubscribe link in emails.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Cookies</h2>
                    <p>
                        Our website uses cookies to enhance user experience. Cookies help us understand site usage and customize content. You can disable cookies through your browser settings, but this may affect site functionality.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically. We encourage you to review this page regularly for any changes.
                    </p>

                    <h2 className="text-2xl font-semibold mt-8 mb-3 text-accent drop-shadow-lg dark:text-accent-content">Contact Us</h2>
                    <p>
                        If you have any questions or concerns about this Privacy Policy, please contact us at:
                    </p>
                    <p className="mt-2 font-semibold text-base-content dark:text-accent-content">Email: <a href="mailto:dilmithseniru@gmail.com" className="text-primary underline hover:text-accent transition-colors">dilmithseniru@gmail.com</a></p>
                </motion.section>
            </motion.main>

        </>
    );
};

export default PrivacyPolicy;
