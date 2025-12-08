"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const HeroForProjects = () => {
  return (
    <div className="relative isolate pt-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex justify-center"
          >
            <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </motion.div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            My Projects
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of web development, AI, and software engineering projects.
            From full-stack applications to machine learning models, here&apos;s what I&apos;ve built!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/contact">Contact Me</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="https://github.com/seniru-dilmith" target="_blank">View GitHub</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-10 h-full w-full bg-background [background-image:linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] [background-size:14px_24px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
    </div>
  );
};

export default HeroForProjects;
