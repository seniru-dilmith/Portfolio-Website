"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ModernNavbar from "@/components/navbar/ModernNavbar";

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const canonicalUrl = `https://seniru.dev${process.env.NEXT_PUBLIC_PATHNAME || ""
    }`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME || "My App"}</title>
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className="" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <GoogleAnalytics />
            {/* Unified layout for all pages to ensure scrollability */}
            <div className="flex flex-col min-h-screen">
              <div className="fixed top-0 left-0 w-full z-50">
                <ModernNavbar />
              </div>
              <main className="flex-grow pt-16">{children}</main>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
