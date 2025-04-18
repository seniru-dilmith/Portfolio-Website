import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 text-base-content px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        {/* 404 Heading */}
        <h1 className="text-7xl font-extrabold text-accent">404</h1>
        <p className="text-xl md:text-2xl font-semibold mt-4">Oops! Page not found</p>
        <p className="text-gray-500 mt-2">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has been moved.
        </p>

        {/* Illustration */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 relative w-64 md:w-80 h-64 md:h-80"
        >
          <Image
            src="/404-illustration.svg"
            alt="Lost astronaut illustration"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* Go Back Button */}
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="mt-6 px-6 py-3 bg-accent text-white font-semibold rounded-lg shadow-md hover:bg-accent-focus transition-all"
          >
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
