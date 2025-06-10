"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { titleNames } from "./titles";

// Simple debug navbar to test functionality
export default function DebugNavbar() {
  const pathname = usePathname();

  return (
    <div className="fixed top-0 left-0 z-[9999] w-full bg-red-500 text-white p-4">
      <div className="flex justify-between items-center">
        <div>DEBUG NAVBAR</div>
        <nav className="flex space-x-4">
          {titleNames.map((item, index) => {
            const linkPath = `/${item === "Home" ? "" : item.toLowerCase()}`;
            const isActive = pathname === linkPath;
            
            return (
              <Link
                key={index}
                href={linkPath}
                className={`px-3 py-1 border rounded ${
                  isActive 
                    ? "bg-white text-red-500" 
                    : "border-white hover:bg-white hover:text-red-500"
                }`}
              >
                {item}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
