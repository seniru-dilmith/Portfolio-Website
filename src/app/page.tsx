import Head from "next/head";

import SpotlightHero from "@/components/hero/SpotlightHero";
import TechTicker from "@/components/tech/TechTicker";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Code2, Rocket, Users, GraduationCap, Heart, Cpu, Globe, Briefcase } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <>
      <Head>
        <title>Seniru Dilmith | Full Stack Developer & CS Undergraduate</title>
        <meta
          name="description"
          content="Portfolio of Seniru Dilmith, a Computer Science Undergraduate at University of Moratuwa specializing in Full Stack Development and Cloud Computing."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </Head>

      <div className="flex flex-col min-h-screen">
        {/* Client Side Hero */}
        <SpotlightHero />

        {/* Client Side Ticker */}
        <TechTicker />

        {/* About Summary Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Me</h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Hi, I&rsquo;m <span className="font-semibold text-primary">Seniru Dilmith</span>, a passionate Computer Science and Engineering undergraduate at the University of Moratuwa, Sri Lanka.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Beyond semicolons and syntax, I am a creative problem solver who loves building digital products that make a difference.
                  When I&rsquo;m not coding, you can find me creating melodies on my keyboard or organizing events with MoraSpirit.
                </p>
                <div className="pt-4">
                  <Button asChild variant="outline">
                    <Link href="/about">Read My Full Story <ArrowRight className="ml-2 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">

                <Card className="bg-secondary/10 border-none">
                  <CardHeader>
                    <GraduationCap className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Education</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">B.Sc. Eng (Hons) in Computer Science & Engineering</p>
                    <p className="text-xs font-medium mt-1">University of Moratuwa</p>
                  </CardContent>
                </Card>
          
                <Card className="bg-secondary/10 border-none">
                  <CardHeader>
                    <Briefcase className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Software Engineer Intern</p>
                    <p className="text-xs font-medium mt-1">GTN Tech</p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/10 border-none">
                  <CardHeader>
                    <Heart className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>Volunteering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">Head of Web and Technolofy Pillar</p>
                    <p className="text-xs font-medium mt-1">MoraSpirit</p>
                  </CardContent>
                </Card>

              </div>
            </div>
          </div>
        </section>

        {/* Services / What I Do Section */}
        <section className="py-24 bg-muted/30">
          <div className="container px-4 mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">What I Do</h2>
              <p className="text-muted-foreground text-lg">
                I bridge the gap between complex engineering and intuitive user experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Globe className="h-6 w-6" />
                  </div>
                  <CardTitle>Web Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Crafting responsive, high-performance web applications using React, Next.js, and modern CSS frameworks.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Cpu className="h-6 w-6" />
                  </div>
                  <CardTitle>System Design</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Designing scalable architectures with the aid of low-level system logic.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background border-border/50 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Fostering collaboration and leadership through community engagement and event organization.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-24 bg-background">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Featured Projects</h2>
                <p className="text-muted-foreground">A selection of my recent technical endeavors.</p>
              </div>
              <Button variant="ghost" asChild className="hidden md:flex">
                <Link href="/projects">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Project 1 */}
              <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted w-full relative group">
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <Cpu className="h-12 w-12 text-primary/50" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Nano Processor</CardTitle>
                    <Badge variant="secondary">VHDL</Badge>
                  </div>
                  <CardDescription>Processor Design</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    A custom 8-bit microprocessor designed from scratch using VHDL. Implements a custom instruction set architecture.
                  </p>
                </CardContent>
              </Card>

              {/* Project 2 */}
              <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted w-full relative text-primary/50">
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <Code2 className="h-12 w-12" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Dreamy Delights E-commerce Platform</CardTitle>
                    <Badge variant="secondary">Next.JS 15</Badge>
                  </div>
                  <CardDescription>Web Application</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    A fully functioning E-commerce platform built with Next.js 15, TypeScript, and Tailwind CSS live on <Link className="underline hover:text-primary" href="https://thedreamydelights.com">thedreamydelights.com</Link>
                  </p>
                </CardContent>
              </Card>

              {/* Project 3 */}
              <Card className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow">
                <div className="h-48 bg-muted w-full relative text-primary/50">
                  <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-12 w-12" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Portfolio V2</CardTitle>
                    <Badge variant="secondary">Next.js 15</Badge>
                  </div>
                  <CardDescription>Personal Website</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground text-sm">
                    The modern, responsive website you are viewing now. Built with Next.js 15, Shadcn UI, and Tailwind CSS.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-12 text-center md:hidden">
              <Button variant="outline" asChild className="w-full">
                <Link href="/projects">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="container px-4 mx-auto text-center max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Let&rsquo;s Build Something Amazing</h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              I&rsquo;m currently open to new opportunities and collaborations. Whether you have a question or just want to say hi, I&rsquo;ll try my best to get back to you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="font-semibold">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link href="https://github.com/seniru-dilmith" target="_blank">View GitHub</Link>
              </Button>
            </div>
          </div>
        </section>


      </div>
    </>
  );
}
