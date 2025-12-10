import { X, Award, GraduationCap, Book, Mail, Phone, Star, MessageSquare } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { reviewsAPI } from "../utils/api";
import { Review } from "../utils/localStorage";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  image: string;
  category: string;
}

interface TeacherProfileViewProps {
  teacher: Teacher | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TeacherProfileView({
  teacher,
  open,
  onOpenChange,
}: TeacherProfileViewProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (teacher && open) {
      const fetchReviews = async () => {
        const res = await reviewsAPI.getAll();
        if (res.success) {
          const teacherReviews = res.data.filter(
            (r: Review) =>
              r.status === "approved" &&
              r.targetType === "teacher" &&
              r.targetName === teacher.name
          );
          setReviews(teacherReviews);
        }
      };
      fetchReviews();
    }
  }, [teacher, open]);

  if (!teacher) return null;

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3 h-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-0" aria-describedby={undefined}>
        {/* Header with Image */}
        <div className="relative h-64 bg-gradient-to-br from-[#285046] to-[#2F6057]">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute inset-0 flex items-end justify-center pb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-2xl">
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <span className="text-4xl text-white">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#FFB703] text-white rounded-full p-2">
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Name and Badge */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl text-[#1A202C]">{teacher.name}</h2>
            <div className="flex items-center justify-center gap-3">
              <Badge className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0 px-4 py-1">
                <GraduationCap className="w-4 h-4 mr-1" />
                {teacher.subject}
              </Badge>
              <Badge variant="outline" className="border-2 border-[#FFB703] text-[#FFB703] px-4 py-1">
                {teacher.category}
              </Badge>
            </div>
          </div>

          {/* Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm text-gray-600">শিক্ষাগত যোগ্যতা</h3>
              </div>
              <p className="text-[#1A202C]">{teacher.qualification}</p>
            </div>

            <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm text-gray-600">অভিজ্ঞতা</h3>
              </div>
              <p className="text-[#1A202C]">{teacher.experience}</p>
            </div>
          </div>

          {/* About Section */}
          <div className="p-6 bg-[#F7FAFC] rounded-xl border-2 border-gray-200">
            <h3 className="text-lg text-[#1A202C] mb-3 flex items-center gap-2">
              <Book className="w-5 h-5 text-[#285046]" />
              শিক্ষক সম্পর্কে
            </h3>
            <p className="text-[#555555] leading-relaxed">
              {teacher.name} একজন অভিজ্ঞ {teacher.subject} শিক্ষক যিনি {teacher.experience} ধরে
              শিক্ষার্থীদের পড়াচ্ছেন। তিনি {teacher.qualification} ডিগ্রি অর্জন করেছেন এবং
              তার পাঠদান পদ্ধতি অত্যন্ত কার্যকর ও শিক্ষার্থী-বান্ধব।
            </p>
          </div>

          {/* Reviews Section */}
          <div className="space-y-4">
            <h3 className="text-lg text-[#1A202C] flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#285046]" />
              শিক্ষার্থী রিভিউ ({reviews.length})
            </h3>
            {reviews.length > 0 ? (
              <div className="grid gap-3">
                {reviews.map((review) => (
                  <div key={review.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                          {review.userAvatar ? (
                            <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">U</div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{review.userName}</p>
                          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-sm text-gray-600 pl-10">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                এখনো কোনো রিভিউ নেই
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200">
            <h3 className="text-lg text-[#1A202C] mb-4">যোগাযোগ করুন</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[#555555]">
                <div className="p-2 bg-white rounded-lg">
                  <Mail className="w-5 h-5 text-[#285046]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ইমেইল</p>
                  <p className="text-sm">technocareacademy.edu@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#555555]">
                <div className="p-2 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-[#285046]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">ফোন</p>
                  <p className="text-sm">01629648302</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-2 border-gray-300"
            >
              বন্ধ করুন
            </Button>
            <Button
              onClick={() => {
                onOpenChange(false);
                // Scroll to courses section
                const coursesSection = document.getElementById("courses");
                if (coursesSection) {
                  coursesSection.scrollIntoView({ behavior: "smooth" });
                } else {
                  // Fallback if ID not found (e.g. on another page), navigate to home
                  window.location.href = "/#courses";
                }
              }}
              className="flex-1 bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
            >
              <Book className="w-4 h-4 mr-2" />
              কোর্সে ভর্তি হন
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
