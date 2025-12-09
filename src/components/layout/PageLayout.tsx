"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

import AnimatedBackground from "../background/AnimatedBackground";
import FloatingElements from "../background/FloatingElements";
import Head from "next/head";

interface PageLayoutProps {
  /** Page title for SEO */
  title: string;
  /** Page description for SEO */
  description: string;
  /** Keywords for SEO */
  keywords: string;
  /** Open Graph title (optional, defaults to title) */
  ogTitle?: string;
  /** Open Graph description (optional, defaults to description) */
  ogDescription?: string;
  /** Open Graph image URL */
  ogImage?: string;
  /** Page URL for Open Graph */
  ogUrl: string;
  /** Twitter title (optional, defaults to title) */
  twitterTitle?: string;
  /** Twitter description (optional, defaults to description) */
  twitterDescription?: string;
  /** Background gradient classes */
  backgroundClassName?: string;
  /** SVG paths for floating elements */
  floatingSvgPaths: string[];
  /** Children components to render */
  children: ReactNode;
  /** Whether to show navbar */
  showNavbar?: boolean;
  /** Whether to show footer */
  showFooter?: boolean;
  /** Custom animated background props */
  animatedBackgroundProps?: {
    gradientFrom?: string;
    gradientVia?: string;
    gradientTo?: string;
    duration?: number;
    opacity?: number;
  };
  /** Custom floating elements props */
  floatingElementsProps?: {
    primaryCount?: number;
    extraCount?: number;
    ambientCount?: number;
    starCount?: number;
    starOpacity?: string;
    starColor?: string;
  };
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage = "/favicon.ico",
  ogUrl,
  twitterTitle,
  twitterDescription,
  backgroundClassName = "bg-gradient-to-br from-primary/70 via-secondary/60 to-accent/50 min-h-screen relative overflow-x-hidden",
  floatingSvgPaths,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showNavbar = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showFooter = true,
  animatedBackgroundProps,
  floatingElementsProps,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta property="og:title" content={ogTitle || title} />
        <meta property="og:description" content={ogDescription || description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:title" content={twitterTitle || title} />
        <meta name="twitter:description" content={twitterDescription || description} />
        <meta name="robots" content="index, follow" />
      </Head>

      <div className={backgroundClassName}>
        {/* Animated Background Overlay */}
        <AnimatedBackground {...animatedBackgroundProps} />

        {/* Floating Elements */}
        <FloatingElements
          svgPaths={floatingSvgPaths}
          {...floatingElementsProps}
        />

        {/* Navbar - Removed to prevent double rendering with RootLayout */}


        {/* Main Content */}
        <motion.div
          className="relative z-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          {children}
        </motion.div>

        {/* Footer */}

      </div>
    </>
  );
};

export default PageLayout;
