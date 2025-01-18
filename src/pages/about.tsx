import Head from 'next/head';
import Hero from '../components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 min-h-screen">
      <Head>
        <title>Welcome to Seniru&rsquo;s Place</title>
        <meta name="description" content="Seniru Dilmith - Computer Science Enthusiast and Creator" />
      </Head>
      <Navbar />
      <Hero />

      {/* About Section */}
      <section className="py-16 px-6 sm:px-12 lg:px-24 bg-base-100/90 rounded-lg shadow-lg mx-4 sm:mx-8 lg:mx-16">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold text-primary-content mb-6">About Me</h2>
          <p className="text-lg text-base-content leading-relaxed">
            Hi, I&rsquo;m <span className="font-semibold text-accent">Seniru Dilmith</span>, a passionate Computer Science and Engineering undergraduate at the University of Moratuwa, Sri Lanka. I specialize in software development, artificial intelligence, and creative problem-solving. 
          </p>
          <p className="mt-4 text-lg text-base-content leading-relaxed">
            Beyond coding, I am a music enthusiast and enjoy creating melodies on my keyboard. I am also actively involved in organizing events at MoraSpirit, where I contribute to fostering creativity and collaboration.
          </p>
        </motion.div>
      </section>

      {/* Skills Section */}
      <section className="py-16 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white text-center">
        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6">My Skills</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-center">
            {['React', 'Next.js', 'Laravel', 'Flutter', 'Python', 'C++', 'Java', 'R'].map((skill) => (
              <div
                key={skill}
                className="bg-base-100 text-primary-content p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <p className="text-xl font-semibold">{skill}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-accent via-pink-500 to-red-600 text-white text-center">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg mb-6">
            Have questions or want to collaborate? Feel free to reach out!
          </p>
          <a
            href="mailto:dilmithseniru@gmail.com"
            className="btn btn-primary btn-lg text-white hover:bg-primary-focus"
          >
            Contact Me
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
