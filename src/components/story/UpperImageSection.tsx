import { motion } from "framer-motion";
import Image from "next/image";

const UpperImageSection: React.FC = () => (
  <>
    <motion.div
      className="flex flex-col items-center pt-8 mx-auto sm:pt-8"
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.4 },
      }}
    >
      {/* Image Container */}
      <motion.div
        className="relative w-2/3 md:w-1/3 lg:w-1/4 sm:w-2/3 aspect-square"
        initial={{
          opacity: 0,
          scale: 0.8,
          x: 50,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 120,
          damping: 12,
          delay: 0.5,
        }}
      >
        <Image
          src="/story/seniru.jpg"
          alt="My Photo"
          fill
          priority
          sizes="100vw 50vw 33vw"
          className="rounded-lg shadow-lg border-8 object-cover"
        />
      </motion.div>
    </motion.div>
    {/* Text Below Image */}
    <motion.div
      className="p-10 mt-4 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-2xl md:text-4xl font-semibold">
        &rdquo;Your Decisions make what you are&rdquo;
      </h2>
      <p className="text-base italic md:text-lg text-neutral mt-2">
        A journey of passion, perseverance, and purpose
      </p>
    </motion.div>
  </>
);

export default UpperImageSection;
