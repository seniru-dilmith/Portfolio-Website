import Head from 'next/head';
import Hero from '../components/Hero';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Home = () => (
  <div>
    <Head>
      <meta name="description" content="Solutions Page" />
    </Head>
    <Navbar />
    <Hero />
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Solutios Page</h2>
    </div>
    <Footer />
  </div>
);

export default Home;
