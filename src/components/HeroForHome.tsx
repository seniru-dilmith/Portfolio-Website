import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { carouselItems } from './component/carousal/data';
import { CarouselItem } from '@/types/carousal_item';

const HeroForHome: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // Clone carousel items to create infinite scrolling effect
    const infiniteCarouselItems = [...carouselItems, ...carouselItems];

    // Auto-scroll logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => prevIndex + 1);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, []);

    // Reset position logic for infinite scroll
    useEffect(() => {
        if (currentIndex >= carouselItems.length) {
            setTimeout(() => {
                setCurrentIndex((prevIndex) => prevIndex % carouselItems.length);
            }, 500); // Smooth transition before resetting
        }
    }, [currentIndex]);

    const handleNext = (): void => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
    };

    const handlePrev = (): void => {
        if (currentIndex === 0) return; // Prevent going left indefinitely
        setCurrentIndex((prevIndex) => prevIndex - 1);
    };

    return (
        <div className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white">
            <div className="relative overflow-hidden">
                {/* Carousel Content */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${(currentIndex % carouselItems.length) * 100}%)`,
                    }}
                >
                    {infiniteCarouselItems.map((item: CarouselItem, idx: number) => (
                        <div key={idx} className="w-full flex-shrink-0">
                            <motion.div
                                className="relative w-full h-64 lg:h-96 flex flex-col items-center justify-center"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1 }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center p-8">
                                    <h2 className="text-3xl lg:text-5xl font-bold mb-4">{item.title}</h2>
                                    <p className="text-lg lg:text-xl">{item.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-black text-3xl rounded-full w-14 h-14 flex items-center justify-center transition"
                    aria-label="Previous"
                >
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-black text-3xl rounded-full w-14 h-14 flex items-center justify-center transition"
                    aria-label="Next"
                >
                    <i className="fa fa-chevron-right"></i>
                </button>
            </div>

            {/* Dots Navigation */}
            <div className="flex justify-center mt-4 space-x-2">
                {carouselItems.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-3 h-3 rounded-full ${
                            currentIndex % carouselItems.length === idx ? 'bg-white' : 'bg-gray-400'
                        } transition`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroForHome;
