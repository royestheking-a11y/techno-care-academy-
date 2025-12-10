import { useState, useEffect, useRef } from 'react';
import { getOptimizedImageUrl, isCloudinaryUrl } from '../utils/cloudinary';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    quality?: 'auto' | number;
    lazy?: boolean;
    placeholder?: 'blur' | 'empty';
    onLoad?: () => void;
    onError?: () => void;
}

export function OptimizedImage({
    src,
    alt,
    className = '',
    width,
    height,
    quality = 'auto',
    lazy = true,
    placeholder = 'blur',
    onLoad,
    onError,
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(!lazy);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (!lazy || isInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Start loading 50px before entering viewport
                threshold: 0.01,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [lazy, isInView]);

    // Get optimized URL with width/height transformations
    const optimizedSrc = isCloudinaryUrl(src)
        ? getOptimizedImageUrl(src, { width, height, quality, format: 'auto' })
        : src;

    // Generate low-quality placeholder for blur effect
    const placeholderSrc = isCloudinaryUrl(src)
        ? getOptimizedImageUrl(src, { width: 20, quality: 10, format: 'auto' })
        : undefined;

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        onError?.();
    };

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <span className="text-gray-400 text-sm">Image not available</span>
            </div>
        );
    }

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Blur placeholder */}
            {placeholder === 'blur' && placeholderSrc && !isLoaded && (
                <img
                    src={placeholderSrc}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-lg scale-110"
                    aria-hidden="true"
                />
            )}

            {/* Actual image */}
            {isInView && (
                <img
                    src={optimizedSrc}
                    alt={alt}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    loading={lazy ? 'lazy' : 'eager'}
                    decoding="async"
                />
            )}

            {/* Loading skeleton */}
            {!isLoaded && placeholder === 'empty' && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
        </div>
    );
}

// Preload critical images (e.g., hero carousel first slide)
export function preloadImage(src: string): void {
    if (!src) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = isCloudinaryUrl(src)
        ? getOptimizedImageUrl(src, { width: 1200, quality: 'auto', format: 'auto' })
        : src;
    document.head.appendChild(link);
}

// Preload multiple images
export function preloadImages(srcs: string[]): void {
    srcs.slice(0, 3).forEach(preloadImage); // Only preload first 3
}
