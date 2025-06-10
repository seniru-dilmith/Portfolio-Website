'use client';

import { motion } from 'framer-motion';
import { FloatingSvgProps } from '@/types/FloatingMusic';
import { useHydration } from '@/hooks/useHydration';
import { useState, useEffect } from 'react';

const FloatingSvg: React.FC<FloatingSvgProps> = ({ svgPath, className = '' }) => {
    const isHydrated = useHydration();
    const [animationValues, setAnimationValues] = useState({
        randomDelay: 0,
        randomDuration: 15,
        randomX: 0,
        randomRotation: 360,
        randomScale: 1,
        randomLeft: 50
    });

    // Generate random values only after hydration to prevent SSR/client mismatch
    useEffect(() => {
        if (isHydrated) {
            setAnimationValues({
                randomDelay: Math.random() * 5,
                randomDuration: 15 + Math.random() * 10,
                randomX: Math.random() * 200 - 100, // -100 to 100
                randomRotation: Math.random() * 720 + 360, // 360 to 1080 degrees
                randomScale: 0.5 + Math.random() * 1, // 0.5 to 1.5
                randomLeft: Math.random() * 100
            });
        }
    }, [isHydrated]);

    // Don't render until hydrated to prevent mismatch
    if (!isHydrated) {
        return null;
    }

    const { randomDelay, randomDuration, randomX, randomRotation, randomScale, randomLeft } = animationValues;
    
    // Random color classes for cycling
    const colorClasses = [
        'text-primary',
        'text-secondary', 
        'text-accent',
        'text-info',
        'text-success',
        'text-warning',
        'text-error',
    ];

    const floatingVariants = {
        initial: {
            y: '100vh',
            x: 0,
            rotate: 0,
            scale: randomScale,
            opacity: 0,
        },
        animate: {
            y: '-100vh',
            x: [0, randomX, -randomX * 0.5, randomX * 0.8, 0],
            rotate: randomRotation,
            scale: [randomScale, randomScale * 1.2, randomScale * 0.8, randomScale],
            opacity: [0, 1, 1, 1, 0],
            transition: {
                duration: randomDuration,
                delay: randomDelay,
                ease: 'linear',
                repeat: Infinity,
                repeatDelay: animationValues.randomDelay * 0.6,
            },
        },
    };

    const colorVariants = {
        animate: {
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
            },
        },
    };

    return (
        <motion.div
            className={`fixed pointer-events-none z-10 ${className}`}            style={{
                left: `${randomLeft}%`,
            }}
            variants={floatingVariants}
            initial="initial"
            animate="animate"
        >
            <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className={`fill-current ${colorClasses[0]}`}
                variants={colorVariants}
                animate={{
                    filter: [
                        'hue-rotate(0deg) brightness(1)',
                        'hue-rotate(90deg) brightness(1.2)',
                        'hue-rotate(180deg) brightness(0.8)',
                        'hue-rotate(270deg) brightness(1.1)',
                        'hue-rotate(360deg) brightness(1)',
                    ],
                }}
            >
                <path d={svgPath} />
            </motion.svg>
        </motion.div>
    );
};

export default FloatingSvg;