import Link from 'next/link';

const Navbar = () => (
  <nav className="bg-gray-800 p-4 text-white">
    <ul className="flex space-x-4">
      <li><Link href="/">Home</Link></li>
      <li><Link href="/features">Features</Link></li>
      <li><Link href="/solutions">Solutions</Link></li>
      <li><Link href="/pricing">Pricing</Link></li>
      <li><Link href="/projects">Projects</Link></li>
      <li><Link href="/about">About</Link></li>
    </ul>
  </nav>
);

export default Navbar;
