"use client";

import { motion } from "framer-motion";
import {
    SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs,
    SiMongodb, SiFirebase, SiDocker, SiPython, SiAmazon, SiGit, SiAngular
} from "react-icons/si";

const techs = [
    { name: "React", icon: SiReact },
    { name: "Next.js", icon: SiNextdotjs },
    { name: "Angular.js", icon: SiAngular },
    { name: "TypeScript", icon: SiTypescript },
    { name: "Tailwind", icon: SiTailwindcss },
    { name: "Node.js", icon: SiNodedotjs },
    { name: "MongoDB", icon: SiMongodb },
    { name: "Firebase", icon: SiFirebase },
    { name: "Docker", icon: SiDocker },
    { name: "Python", icon: SiPython },
    { name: "AWS", icon: SiAmazon },
    { name: "Git", icon: SiGit },
];

export default function TechTicker() {
    return (
        <section className="w-full py-12 bg-muted/30 border-y border-border/40 overflow-hidden">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Technologies I work with</p>
            </div>
            <div className="flex">
                {/* First copy */}
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex flex-shrink-0 gap-16 px-8 min-w-full justify-around"
                >
                    {techs.map((tech, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group">
                            <tech.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tech.name}</span>
                        </div>
                    ))}
                </motion.div>

                {/* Second copy for infinite loop */}
                <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: "-100%" }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex flex-shrink-0 gap-16 px-8 min-w-full justify-around"
                >
                    {techs.map((tech, index) => (
                        <div key={`copy-${index}`} className="flex flex-col items-center gap-2 group">
                            <tech.icon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                            <span className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300">{tech.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
