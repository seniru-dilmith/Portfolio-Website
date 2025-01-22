import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

const milestones = [
    {
        title: 'Birth',
        date: 'January 1, 2000',
        description: 'The beginning of my incredible journey.',
        image: '/images/birth.jpg', 
    },
    {
        title: 'First Steps',
        date: 'December 15, 2000',
        description: 'I took my first steps and started exploring the world.',
        image: '/images/first-steps.jpg', 
    },
    {
        title: 'School Days',
        date: 'March 1, 2005',
        description: 'I began my formal education and made lifelong friends.',
        image: '/images/school-days.jpg', 
    },
    {
        title: 'Graduation',
        date: 'July 10, 2022',
        description: 'I graduated from university with a degree in Computer Science.',
        image: '/images/graduation.jpg',
    },
];

const Story: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-primary via-secondary to-accent text-primary-content">
            <Navbar />
            <div className="container mx-auto py-16 px-6">
                <h1 className="text-5xl font-bold text-center mb-12">My Story</h1>
                <div className="space-y-12">
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            variants={{
                                hidden: { opacity: 0, x: index % 2 === 0 ? -100 : 100 },
                                visible: { opacity: 1, x: 0 },
                            }}
                            className={`flex flex-col lg:flex-row ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                                } items-center`}
                        >
                            {/* Content Section */}
                            <div className="lg:w-1/2 p-6 bg-base-100 rounded-lg shadow-lg">
                                <h2 className="text-3xl font-bold mb-4 text-primary">{milestone.title}</h2>
                                <p className="text-sm font-semibold mb-2 text-secondary">{milestone.date}</p>
                                <p className="text-gray-600">{milestone.description}</p>
                            </div>

                            {/* Image Section */}
                            <motion.div
                                layout
                                transition={{ duration: 0.5 }}
                                className="lg:w-1/2 p-6"
                            >
                                <div className="relative w-full h-64 md:h-96">
                                    <Image
                                        src={milestone.image}
                                        alt={milestone.title}
                                        fill
                                        className="rounded-lg shadow-lg border-2 border-accent object-cover"
                                        priority={index === 0} // Prioritize the first image for better performance
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Story;
