import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';

const Home = () => (
  <div>
    <Navbar />
    <Hero />
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Solutios Page</h2>
    </div>
    <Footer />
  </div>
);

export default Home;
