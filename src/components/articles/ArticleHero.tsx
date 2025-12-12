import React from 'react';
import { motion } from 'framer-motion';

const ArticleHero = () => {
    return (
        <div className="relative w-full py-20 md:py-32 overflow-hidden bg-background">
            {/* Ambient Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-50 pointer-events-none" />

            {/* Animated Decorative Circle */}
            <motion.div
                className="absolute top-10 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container relative z-10 px-4 mx-auto text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Explore My <span className="text-primary">Thoughts</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                        A collection of articles on software engineering, system design, and the lessons I've learned while building digital products.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ArticleHero;
