import Link from 'next/link';
import { useAuth } from '@/components/context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, handleLogout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 text-white">
      <nav>
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/features">Features</Link></li>
          <li><Link href="/solutions">Solutions</Link></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/projects">Projects</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
      </nav>
      {isAuthenticated && (
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
