import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
    onComplete: () => void;
    minDuration?: number;
    isDataLoaded?: boolean;
}

export function SplashScreen({ onComplete, minDuration = 2500, isDataLoaded = true }: SplashScreenProps) {
    const [isExiting, setIsExiting] = useState(false);
    const [minDurationPassed, setMinDurationPassed] = useState(false);

    useEffect(() => {
        // Check if splash was already shown this session
        const splashShown = sessionStorage.getItem('splashShown');

        // If already shown, we don't enforce the minimum duration (set to 0),
        // BUT we still wait for data to be loaded.
        const effectiveDuration = splashShown === 'true' ? 0 : minDuration;

        // Timer for minimum duration
        const timer = setTimeout(() => {
            setMinDurationPassed(true);
        }, effectiveDuration);

        return () => clearTimeout(timer);
    }, [minDuration]);

    useEffect(() => {
        // Only exit if BOTH min duration passed AND data is loaded
        if (minDurationPassed && isDataLoaded && !isExiting) {

            // If it's a reload (duration 0) and data is ready instantly, 
            // we might want to skip animation or keep it fast. 
            // For now, consistent exit animation is safer than a "cut".

            setIsExiting(true);
            sessionStorage.setItem('splashShown', 'true');
            // Wait for exit animation to complete
            setTimeout(onComplete, 600);
        }
    }, [minDurationPassed, isDataLoaded, isExiting, onComplete]);

    // Removed the early return "if (splashShown) return null" 
    // because that was causing the white page while waiting for data.

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#1A3A32] via-[#285046] to-[#2F6057]"
                >
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Floating orbs */}
                        <motion.div
                            animate={{
                                x: [0, 30, 0],
                                y: [0, -20, 0],
                            }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-[#FFB703]/20 to-transparent rounded-full blur-3xl"
                        />
                        <motion.div
                            animate={{
                                x: [0, -20, 0],
                                y: [0, 30, 0],
                            }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-[#2F6057]/30 to-transparent rounded-full blur-3xl"
                        />
                    </div>

                    {/* Logo Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Favicon/Logo Image */}
                        <motion.div
                            animate={{
                                boxShadow: [
                                    '0 0 20px rgba(255, 183, 3, 0.3)',
                                    '0 0 40px rgba(255, 183, 3, 0.5)',
                                    '0 0 20px rgba(255, 183, 3, 0.3)',
                                ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-3xl flex items-center justify-center mb-5 shadow-2xl p-2"
                        >
                            <img
                                src="/favicon.svg"
                                alt="Techno Care Academy"
                                className="w-full h-full object-contain"
                            />
                        </motion.div>

                        {/* Title - Smaller */}
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-2xl md:text-3xl font-bold text-white mb-1 text-center drop-shadow-lg"
                        >
                            Techno Care Academy
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="text-white/70 text-base md:text-lg mb-8"
                        >
                            শিক্ষার নতুন দিগন্ত
                        </motion.p>

                        {/* Loading Animation - Dots Only */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex items-center gap-2"
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        y: [0, -8, 0],
                                        opacity: [0.5, 1, 0.5],
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.2,
                                        ease: 'easeInOut',
                                    }}
                                    className="w-2.5 h-2.5 bg-[#FFB703] rounded-full shadow-lg"
                                />
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Bottom gradient fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#1A3A32] to-transparent" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
