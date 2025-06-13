"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Navbar from "@/components/navbar/Navbar";

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <GoogleAnalytics />
        <div className="h-screen flex flex-col overflow-hidden">
          {/* Fixed navbar that overlays the content */}
          <div className="fixed top-0 left-0 w-full z-50">
            <Navbar />
          </div>
          {/* Main content takes full screen height */}
          <main className="flex-1 h-full">{children}</main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
