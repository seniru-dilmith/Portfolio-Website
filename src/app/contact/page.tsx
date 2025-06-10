"use client";
import Head from "next/head";
import HeroForContact from "@/components/contact/HeroForContact";
import Footer from "@/components/footer/Footer";
import Contact from "@/components/contact/Contact";
import { motion } from "framer-motion";

const ContactMe = () => {
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const bounceIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 10 },
    },
  };

  return (
    <>
      <Head>
        <title>About Me - Seniru Dilmith</title>
        <meta
          name="description"
          content="Get in touch with me for collaboration, inquiries, or networking opportunities."
        />
        <meta
          name="keywords"
          content="Contact, Email, Networking, Collaboration, Hire a Developer"
        />
        <meta property="og:title" content="Contact - Seniru Dilmith" />
        <meta
          property="og:description"
          content="Reach out to me for software development and collaboration opportunities."
        />
        <meta property="og:image" content="/images/contact-thumbnail.jpg" />
        <meta property="og:url" content="https://yourwebsite.com/contact" />
        <meta name="twitter:title" content="Contact - Seniru Dilmith" />
        <meta
          name="twitter:description"
          content="Let's connect! Contact me for tech collaborations."
        />
        <meta name="robots" content="index, follow" />
      </Head>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="bg-gradient-to-br from-primary/70 via-secondary/60 to-primary/70 min-h-screen"
      >
        <Head>
          <title>Contact Me</title>
          <meta
            name="description"
            content="Seniru Dilmith - Find my contact information here."
          />        </Head>

        {/* About Me */}
        <motion.div variants={bounceIn}>
          <HeroForContact />
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <Contact />
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <Footer />
        </motion.div>
      </motion.div>
    </>
  );
};

export default ContactMe;
