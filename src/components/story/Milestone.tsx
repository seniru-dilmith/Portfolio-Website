import { motion, useAnimation } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

const milestoneVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

interface MilestoneProps {
    milestone: {
        title: string;
        date: string;
        description: string;
        image: string;
    };
    reverse: boolean;
}

const Milestone: React.FC<MilestoneProps> = ({ milestone, reverse }) => {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const controls = useAnimation();

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [inView, controls]);

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            variants={milestoneVariants}
            className={`flex flex-col lg:flex-row gap-6 lg:gap-8 ${
                reverse ? 'lg:flex-row-reverse' : ''
            } items-center`}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.3 },
            }}
        >
            {/* Content Section */}
            <motion.div
                className="w-full lg:w-1/2 mt-9 p-4 md:p-6 bg-base-100 rounded-lg shadow-lg"
                whileHover={{
                    boxShadow: '0px 10px 20px rgba(0,0,0,0.2)',
                    transition: { duration: 0.3 },
                }}
            >
                <motion.h2
                    className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-primary"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {milestone.title}
                </motion.h2>
                <motion.p
                    className="text-xs md:text-sm font-semibold mb-2 text-secondary"
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {milestone.date}
                </motion.p>
                <motion.p
                    className="text-sm md:text-base text-gray-600"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {milestone.description}
                </motion.p>
            </motion.div>
            {/* Image Section */}
            <motion.div
                className="w-[80%] lg:w-1/2 p-2 md:p-6"
                whileHover={{
                    rotate: reverse ? 2 : -2,
                    transition: { duration: 0.3 },
                }}
            >
                <motion.div
                    className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[16/9]"
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                        x: reverse ? -50 : 50,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        x: 0,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 100,
                        damping: 15,
                        delay: 0.5,
                    }}
                >
                    <Image
                        src={milestone.image}
                        alt={milestone.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="rounded-lg shadow-lg border-2 border-accent object-cover"
                        priority={reverse}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Milestone;
