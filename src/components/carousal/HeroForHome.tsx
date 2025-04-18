"use client"; 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { carouselItems } from './data';
import { CarouselItem } from '@/types/carousal_item';
import React from 'react';

const HeroForHome: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);

    const startAutoScroll = () => {
        stopAutoScroll(); // Prevent multiple intervals
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        }, 5000);
        setAutoScrollInterval(interval);
    };

    const stopAutoScroll = () => {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            setAutoScrollInterval(null);
        }
    };

    const resetAutoScroll = () => {
        startAutoScroll();
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
        resetAutoScroll();
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
        resetAutoScroll();
    };

    const handleDotNavigation = (index: number) => {
        setCurrentIndex(index);
        resetAutoScroll();
    };

    return (
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }} // Start state
            animate={{ scale: 1, opacity: 1 }} // End state
            transition={{ duration: 0.8, ease: 'easeOut' }} // Smooth transition
            className="flex items-center justify-center w-full flex-grow bg-gradient-to-r from-primary to-secondary text-primary-content"
        >
            <div className="relative w-full h-full max-h-[calc(100vh-4rem)]">
                {/* Carousel Content */}
                <div className="relative h-full">
                    {carouselItems.map((item: CarouselItem, idx: number) => (
                        <motion.div
                            key={idx}
                            className={`absolute w-full h-full flex flex-row items-center justify-center transition-opacity duration-700 ${
                                currentIndex === idx ? 'opacity-100 z-20' : 'opacity-0 z-0'
                            }`}
                        >
                            {idx % 2 === 0 ? (
                                <>
                                    {/* Content Area */}
                                    <div className="w-1/2 h-full bg-black bg-opacity-70 flex flex-col justify-center items-center p-4 lg:p-8">
                                        <h2 className="text-center font-bold mb-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl">
                                            {item.title}
                                        </h2>
                                        <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl leading-snug">
                                            {item.description.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>
                                    {/* Image Area */}
                                    <div className="w-1/2 h-full relative z-10">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Image Area */}
                                    <div className="w-1/2 h-full relative z-10">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover"
                                        />
                                    </div>
                                    {/* Content Area */}
                                    <div className="w-1/2 h-full bg-black bg-opacity-70 flex flex-col justify-center items-center p-4 lg:p-8">
                                        <h2 className="text-center font-bold mb-4 text-xl sm:text-2xl md:text-4xl lg:text-5xl">
                                            {item.title}
                                        </h2>
                                        <p className="text-center text-sm sm:text-base md:text-lg lg:text-xl leading-snug">
                                            {item.description.split('\n').map((line, index) => (
                                                <React.Fragment key={index}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </p>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Dots Navigation */}
                <div className="absolute bottom-4 w-full flex flex-row justify-center space-x-4 -mt-5 z-30">
                    {carouselItems.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleDotNavigation(idx)}
                            className={`w-3 h-3 rounded-full border-2 transition ${
                                currentIndex === idx
                                    ? 'bg-primary border-primary scale-150'
                                    : 'bg-base border-base'
                            }`}
                        />
                    ))}
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={handlePrev}
                    className="absolute bg-neutral-200 left-2 top-1/2 -translate-y-1/2 z-30 btn btn-circle btn-outline bg-transparent hover:bg-opacity-800 border-white text-white hover:text-white transition duration-300"
                    aria-label="Previous"
                >
                    <i className="fa fa-chevron-left"></i>
                </button>
                <button
                    onClick={handleNext}
                    className="absolute bg-neutral-200 right-2 top-1/2 -translate-y-1/2 z-30 btn btn-circle btn-outline bg-transparent hover:bg-opacity-800 border-white text-white hover:text-white transition duration-300"
                    aria-label="Next"
                >
                    <i className="fa fa-chevron-right"></i>
                </button>
            </div>
        </motion.div>
    );
};

export default HeroForHome;
