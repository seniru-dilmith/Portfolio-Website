"use client";

import { ReactNode, useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
import { usePathname } from "next/navigation";

import "../styles/globals.css";
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
  const canonicalUrl = `https://seniru.dev${pathname}`;

  useEffect(() => {
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Seniru Dilmith",
      jobTitle: "Full Stack Developer",
      url: "https://seniru.dev",
      sameAs: [
        "https://linkedin.com/in/seniru-dilmith",
        "https://github.com/seniru-dilmith",
        "https://twitter.com/seniru_dilmith",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Moraspirit",
      },
      studiesAt: {
        "@type": "University",
        name: "University of Moratuwa",
      },
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Initialize theme as early as possible to avoid FOUC */}
      <Script id="theme-init" strategy="beforeInteractive">
        {`
          (function() {
            const theme = localStorage.getItem("theme") || "emerald";
            document.documentElement.setAttribute("data-theme", theme);
          })();
        `}
      </Script>

      <body>
        <ThemeProvider>
          <AuthProvider>
            <GoogleAnalytics />

            <div className="flex flex-col min-h-screen">
              <Navbar />

              <main className="flex-grow">
                {children}
              </main>
            </div>
          </AuthProvider>
        </ThemeProvider>

        <Script src="/_next/script" strategy="afterInteractive" />
      </body>
    </html>
  );
}