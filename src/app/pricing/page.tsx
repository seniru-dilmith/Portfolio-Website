"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Link from 'next/link';
import Head from 'next/head';
import Footer from '@/components/footer/Footer';
import Navbar from '@/components/navbar/Navbar';

const SubscriptionPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post<{ success: boolean; message?: string }>('/api/subscribe', { email });

      if (response.data.success) {
        setMessage('Subscription successful! Thank you for joining.');
        setSuccess(true);
        setEmail('');
      } else {
        setMessage(response.data.message || 'Failed to subscribe. Please try again.');
        setSuccess(false);
      }
    } catch (error) {
      const errorMessage =
        axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : 'An error occurred. Please try again later.';
      setMessage(errorMessage);
      setSuccess(false);
    }
  };

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9, y: -50 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.4 } },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  const messageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3, delay: 0.6 } },
  };

  return (
    <>
    <Head>
      <title>Subscribe - Seniru Dilmith</title>
      <meta
        name="description" content="Stay updated with the latest news and updates from Seniru Dilmith." />
    </Head>
    <div className="h-screen flex flex-col bg-gradient-to-br from-primary/50 via-secondary/40 to-accent/30">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-4 overflow-auto">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 w-full max-w-lg flex flex-col items-center text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 mb-4 md:mb-6">
            📬 Stay Updated!
          </h2>
          <p className="text-sm md:text-lg font-light text-gray-700 italic mb-4 md:mb-8 leading-relaxed">
            I&rsquo;m not currently accepting outside projects, but I will be soon. Stay informed by subscribing to my mailing list. Enter your email below, and I&rsquo;ll notify you when I&rsquo;m ready to take orders.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4 w-full items-center">
            <motion.input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 w-full border border-gray-300 rounded-lg text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              variants={inputVariants}
            />
            <motion.button
              type="submit"
              className="p-3 w-1/2 bg-purple-600 text-white font-semibold text-lg shadow-lg hover:bg-purple-700 transition rounded-lg"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Subscribe
            </motion.button>
          </form>
          {message && (
            <motion.p
              className={`mt-4 text-sm md:text-lg font-medium ${
                success ? 'text-green-600' : 'text-red-600'
              }`}
              initial="hidden"
              animate="visible"
              variants={messageVariants}
            >
              {message}
            </motion.p>
          )}
          <p className="text-xs md:text-sm text-gray-500 mt-4">
            By subscribing, you agree to our{' '}
            <Link href="/privacy">
              <span className="underline hover:text-red-500 transition duration-300 cursor-pointer">
                Privacy Policy
              </span>
            </Link>
            .
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
    </>
  );
};

export default SubscriptionPage;
