import { ReactNode } from "react";
import Script from "next/script";

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
  const canonicalUrl = `https://seniru.dev${process.env.NEXT_PUBLIC_PATHNAME || ""}`;

  return (
    // 1) Static theme on <html>
    <html lang="en" data-theme="emerald" data-arp="">
      <head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      {/* 2) No data-theme on body */}
      <body>
        {/* 3) After hydration, pick up stored theme from localStorage */}
        <Script id="theme-init" strategy="afterInteractive">
          {`
            (function() {
              const theme = localStorage.getItem("theme") || "emerald";
              document.documentElement.setAttribute("data-theme", theme);
            })();
          `}
        </Script>

        <ThemeProvider>
          <AuthProvider>
            <GoogleAnalytics />
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
