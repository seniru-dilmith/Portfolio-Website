'use client';

import { motion } from 'framer-motion';
import { FloatingSvgProps } from '@/types/FloatingMusic';

const FloatingSvg: React.FC<FloatingSvgProps> = ({ svgPath, className = '' }) => {

    // Generate random values for animation
    const randomDelay = Math.random() * 5;
    const randomDuration = 15 + Math.random() * 10;
    const randomX = Math.random() * 200 - 100; // -100 to 100
    const randomRotation = Math.random() * 720 + 360; // 360 to 1080 degrees
    const randomScale = 0.5 + Math.random() * 1; // 0.5 to 1.5
    
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
                repeatDelay: Math.random() * 3,
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
            className={`fixed pointer-events-none z-10 ${className}`}
            style={{
                left: `${Math.random() * 100}%`,
            }}
            variants={floatingVariants}
            initial="initial"
            animate="animate"
        >
            <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                className={`fill-current ${colorClasses[Math.floor(Math.random() * colorClasses.length)]}`}
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