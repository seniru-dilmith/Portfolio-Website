import Head from 'next/head';
import HeroForHome from '@/components/HeroForHome';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const Home = () => (
  <div className="min-h-screen flex flex-col">
    <Head>
      <meta name="description" content="Home Page" />
    </Head>
    <Navbar />
    {/* Hero Section */}
    <div className="flex-grow">
      <HeroForHome />
    </div>

    {/* Footer */}
    <Footer />
  </div>
);

export default Home;
