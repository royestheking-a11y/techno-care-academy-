import { useState, useEffect } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSlides, Slide } from "../utils/localStorage";
import { getOptimizedImageUrl, isCloudinaryUrl } from "../utils/cloudinary";

export function HeroCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [slides, setSlides] = useState<Slide[]>([]);

    useEffect(() => {
        // Load slides from local storage
        getSlides().then((loadedSlides) => {
            setSlides(loadedSlides);
            // Preload first slide image for instant display
            if (loadedSlides.length > 0 && loadedSlides[0].image) {
                const preloadImg = new Image();
                preloadImg.src = isCloudinaryUrl(loadedSlides[0].image)
                    ? getOptimizedImageUrl(loadedSlides[0].image, { width: 1600, quality: 'auto', format: 'auto' })
                    : loadedSlides[0].image;
            }
        });

        // Listen for changes
        const handleStorageChange = () => {
            getSlides().then(setSlides);
        };
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('carousel-update', handleStorageChange); // Custom event for same-tab updates

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('carousel-update', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (isHovered) return; // Pause on hover
        if (slides.length === 0) return; // Add check inside effect if needed

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 4500); // 4.5 seconds

        return () => clearInterval(timer);
    }, [slides.length, isHovered]);

    if (slides.length === 0) return null;

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div
            className="relative w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                >
                    {/* Background Image */}
                    <ImageWithFallback
                        src={isCloudinaryUrl(slide.image)
                            ? getOptimizedImageUrl(slide.image, { width: 1600, quality: 'auto', format: 'auto' })
                            : slide.image}
                        alt={slide.institute}
                        className="w-full h-full object-cover"
                    />

                    {/* Gradient Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(40,80,70,0.85) 0%, rgba(40,80,70,0.3) 70%, transparent 100%)",
                        }}
                    />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center md:justify-start">
                        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-16">
                            <div className="max-w-2xl text-center md:text-left">
                                {/* Main Text */}
                                <h1
                                    className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-4 sm:mb-6 md:mb-8 drop-shadow-lg leading-tight px-2 sm:px-0"
                                    style={{
                                        textShadow: "2px 2px 8px rgba(0,0,0,0.6)",
                                    }}
                                >
                                    {slide.title || "এখন আর দূরে নয় তোমার স্বপ্নের পলিটেকনিক ইনস্টিটিউট"}
                                </h1>

                                {/* CTA Button */}
                                {(slide.buttonText || slide.buttonLink) && (
                                    <a
                                        href={slide.buttonLink || "#courses"}
                                        className="inline-block px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg cursor-pointer"
                                        style={{
                                            background:
                                                "linear-gradient(90deg, #285046 0%, #2F6057 100%)",
                                            boxShadow: "0 4px 12px rgba(40,80,70,0.3)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.boxShadow =
                                                "0 0 16px rgba(47,96,87,0.6)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(40,80,70,0.3)";
                                        }}
                                    >
                                        {slide.buttonText || "এখনই শুরু করো"}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Arrows */}
            <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white rounded-full p-2 sm:p-3 transition-all duration-300 hover:scale-110 active:scale-95"
                aria-label="Next slide"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dot Indicators - Optimized for Mobile */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 md:gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`transition-all duration-300 rounded-full ${index === currentSlide
                            ? "bg-white w-6 sm:w-8 md:w-10 h-2 sm:h-2.5 md:h-3"
                            : "bg-white/50 w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 hover:bg-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Subtitle Badge - Top Right with Glass UI */}
            {slides[currentSlide].subtitle && (
                <div
                    className="absolute z-20"
                    style={{ top: "20%", right: "8%" }}
                >
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg shadow-xl">
                        <p className="text-white font-medium text-sm sm:text-base md:text-lg tracking-wide">
                            {slides[currentSlide].subtitle}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
