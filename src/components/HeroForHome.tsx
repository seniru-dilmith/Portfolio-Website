import { useState, useEffect, SetStateAction } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const HeroForHome = () => {
    const carouselItems = [
        {
            id: 1,
            title: 'Welcome to Seniru’s Place!',
            description: 'A hub of innovation and creativity.',
            image: '/caro-01.png',
        },
        {
            id: 2,
            title: 'Explore Amazing Projects',
            description: 'Dive into exciting tech and ideas.',
            image: '/caro-02.png',
        },
        {
            id: 3,
            title: 'Join the Journey',
            description: 'Stay tuned for more amazing content.',
            image: '/caro-03.png',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-rotate logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [carouselItems.length]);

    const handleManualNavigation = (index: SetStateAction<number>) => {
        setCurrentIndex(index);
    };

    return (
        <div className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                >
                    {carouselItems.map((item) => (
                        <div key={item.id} className="w-full flex-shrink-0">
                            <motion.div
                                className="relative w-full h-64 lg:h-96 flex flex-col items-center text-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="w-full h-full"
                                    priority={item.id === 1} // Prioritize loading the first image
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-8">
                                    <h2 className="text-3xl lg:text-5xl font-bold mb-4">{item.title}</h2>
                                    <p className="text-lg lg:text-xl">{item.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Carousel Navigation */}
            <div className="flex justify-center mt-4 space-x-2">
                {carouselItems.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleManualNavigation(idx)}
                        className={`btn btn-xs ${currentIndex === idx ? 'btn-primary' : 'btn-outline'}`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HeroForHome;
