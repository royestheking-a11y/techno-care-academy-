import { useState, useEffect } from "react";
import { Star, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { reviewsAPI } from "../utils/api";
import { Review } from "../utils/localStorage";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Label } from "./ui/label";

export function ReviewsSection() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReview, setNewReview] = useState({
    targetType: "course" as "course" | "teacher",
    targetName: "",
    rating: 5,
    comment: "",
  });

  useEffect(() => {
    fetchReviews();
    window.addEventListener("reviews-update", fetchReviews);
    return () => window.removeEventListener("reviews-update", fetchReviews);
  }, []);

  const fetchReviews = async () => {
    // Ideally we filter by userId, but getAll returns all. Filtering client side for now.
    const res = await reviewsAPI.getAll();
    if (res.success && user) {
      const myReviews = res.data.filter((r: Review) => r.userId === user.id);
      setReviews(myReviews);
    }
  };

  const calculateTargetId = (name: string) => {
    // Simple hash to generate a numeric ID from string for demo purposes
    // In real app, we would select from a list of real IDs
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!newReview.targetName.trim()) {
      toast.error("অনুগ্রহ করে যে বিষয়ে রিভিউ দিচ্ছেন তার নাম লিখুন");
      return;
    }

    try {
      const reviewData = {
        userId: user.id,
        userName: user.name,
        userAvatar: user.profilePicture,
        targetId: calculateTargetId(newReview.targetName),
        targetName: newReview.targetName,
        targetType: newReview.targetType,
        rating: newReview.rating,
        comment: newReview.comment,
      };

      await reviewsAPI.create(reviewData);
      toast.success("আপনার রিভিউ জমা দেওয়া হয়েছে এবং অনুমোদনের অপেক্ষায় আছে!");
      setShowAddDialog(false);
      setNewReview({
        targetType: "course",
        targetName: "",
        rating: 5,
        comment: "",
      });
      fetchReviews();
    } catch (error) {
      toast.error("রিভিউ সাবমিট করতে সমস্যা হয়েছে");
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-[#1A202C]">আমার রিভিউ</h2>
          <p className="text-gray-500 text-sm mt-1">আপনার মতামত আমাদের জন্য গুরুত্বপূর্ণ</p>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          রিভিউ দিন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
            <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900">কোনো রিভিউ নেই</h3>
            <p className="text-gray-500 text-sm mt-1">আপনি এখনো কোনো রিভিউ দেননি। ক্লাস বা কোর্স সম্পর্কে আপনার মতামত জানান!</p>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(true)}
              className="mt-4"
            >
              প্রথম রিভিউ দিন
            </Button>
          </div>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{review.targetName}</h3>
                  <p className="text-xs text-capitalize text-gray-500 capitalize">{review.targetType}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${review.status === 'approved' ? 'bg-green-100 text-green-700' :
                    review.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                  }`}>
                  {review.status === 'approved' ? 'Approved' : review.status === 'pending' ? 'Pending' : 'Hidden'}
                </div>
              </div>

              <div className="mb-3">
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-3 rounded-lg">
                {review.comment}
              </p>

              <div className="mt-3 text-xs text-gray-400 text-right">
                {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>নতুন রিভিউ দিন</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="review-type">কিসের উপর ভিত্তি করে রিভিউ দিচ্ছেন?</Label>
              <Select
                value={newReview.targetType}
                onValueChange={(v: "course" | "teacher") => setNewReview({ ...newReview, targetType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="course">কোর্স (Course)</SelectItem>
                  <SelectItem value="teacher">শিক্ষক (Teacher)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="target-name">নাম (কোর্স বা শিক্ষকের)</Label>
              <input
                id="target-name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newReview.targetName}
                onChange={(e) => setNewReview({ ...newReview, targetName: e.target.value })}
                placeholder="উদাহরণ: এসএসসি পদার্থবিজ্ঞান বা মো. করিম স্যার"
              />
            </div>

            <div className="grid gap-2">
              <Label>রেটিং</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-200"
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="comment">আপনার মতামত</Label>
              <Textarea
                id="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                placeholder="বিস্তারিত লিখুন..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>বাতিল</Button>
            <Button onClick={handleSubmit} className="bg-[#285046] text-white">
              <Send className="w-4 h-4 mr-2" />
              জমা দিন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
