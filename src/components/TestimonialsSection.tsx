import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { reviewsAPI } from "../utils/api";
import { Review } from "../utils/localStorage";
import { Card } from "./ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "./ui/carousel";

export function TestimonialsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        const fetchReviews = async () => {
            const res = await reviewsAPI.getAll();
            if (res.success) {
                // Filter only approved reviews for public display
                const approved = res.data.filter(r => r.status === 'approved');
                setReviews(approved);
            }
        };
        fetchReviews();
        window.addEventListener('reviews-update', fetchReviews);
        return () => window.removeEventListener('reviews-update', fetchReviews);
    }, []);

    if (reviews.length === 0) return null;

    return (
        <div className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-[#1A202C] mb-2">শিক্ষার্থীদের মতামত</h2>
                    <p className="text-gray-600">আমাদের সম্পর্কে শিক্ষার্থীরা যা বলছে</p>
                </div>

                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-5xl mx-auto"
                >
                    <CarouselContent>
                        {reviews.map((review) => (
                            <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1">
                                    <Card className="p-6 h-full border-t-4 border-t-[#285046] shadow-sm hover:shadow-md transition-shadow">
                                        <Quote className="w-8 h-8 text-[#285046] opacity-20 mb-4" />

                                        <p className="text-gray-600 italic mb-6 line-clamp-4 min-h-[80px]">
                                            "{review.comment}"
                                        </p>

                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                <img
                                                    src={review.userAvatar || `https://ui-avatars.com/api/?name=${review.userName}&background=random`}
                                                    alt={review.userName}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-sm text-[#1A202C]">{review.userName}</h4>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}
