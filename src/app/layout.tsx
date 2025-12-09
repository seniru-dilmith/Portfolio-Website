import { ReactNode } from "react";
import { Metadata } from "next";

// This is a Server Component
import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import ModernNavbar from "@/components/navbar/ModernNavbar";
import Footer from "@/components/footer/Footer";
import { AppProviders } from "@/components/providers/AppProviders";

interface LayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  metadataBase: new URL("https://seniru.dev"),
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "Seniru Dilmith | Portfolio",
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "Seniru Dilmith"}`,
  },
  description: "Portfolio of Seniru Dilmith, a Computer Science Undergraduate specializing in Full Stack Development.",
  keywords: ["Seniru Dilmith", "Portfolio", "Full Stack Developer", "Software Engineer", "React", "Next.js", "Sri Lanka"],
  authors: [{ name: "Seniru Dilmith" }],
  creator: "Seniru Dilmith",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seniru.dev",
    siteName: "Seniru Dilmith Portfolio",
    images: [
      {
        url: "/og-image.png", // Ensure this exists or use a default
        width: 1200,
        height: 630,
        alt: "Seniru Dilmith Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@senirudilmith", // Replace/Remove if unknown
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="" suppressHydrationWarning>
        <AppProviders>
          {/* Unified layout for all pages to ensure scrollability */}
          <div className="flex flex-col min-h-screen">
            <div className="fixed top-0 left-0 w-full z-50">
              <ModernNavbar />
            </div>
            <main className="flex-grow pt-16">{children}</main>
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
