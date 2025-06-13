"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import Navbar from "@/components/navbar/Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const canonicalUrl = `https://seniru.dev${
    process.env.NEXT_PUBLIC_PATHNAME || ""
  }`;

  return (
    // Start with no theme attribute to prevent hydration mismatch
    <html lang="en" data-arp="">
      <head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* 
          Note: Do not set data-theme here to avoid hydration mismatch.
          ThemeContext will handle theme initialization after hydration.
        */}
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          <AuthProvider>
            <GoogleAnalytics />
            {isHomePage ? (
              /* Home page - full screen height with overlaid navbar */
              <div className="h-screen flex flex-col overflow-hidden">
                <div className="fixed top-0 left-0 w-full z-50">
                  <Navbar />
                </div>
                <main className="flex-1 h-full">{children}</main>
              </div>
            ) : (
              /* Other pages - fixed navbar layout */
              <div className="flex flex-col min-h-screen">
                <div className="fixed top-0 left-0 w-full z-50">
                  <Navbar />
                </div>
                <main className="flex-grow">{children}</main>
              </div>
            )}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
