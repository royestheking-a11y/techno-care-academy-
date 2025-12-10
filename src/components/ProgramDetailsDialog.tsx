import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { GraduationCap, CheckCircle, Clock, Users, BookOpen, Award, Target, TrendingUp, MessageSquare, Star } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { reviewsAPI } from "../utils/api";
import { Review } from "../utils/localStorage";

interface ProgramDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProgramDetailsDialog({ open, onOpenChange }: ProgramDetailsDialogProps) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (open) {
      const fetchReviews = async () => {
        const res = await reviewsAPI.getAll();
        if (res.success) {
          // Filter for course reviews
          const courseReviews = res.data.filter(
            (r: Review) =>
              r.status === "approved" &&
              r.targetType === "course"
          );
          setReviews(courseReviews);
        }
      };
      fetchReviews();
    }
  }, [open]);

  const programs = [
    {
      title: "ক্লাস ৯ প্রোগ্রাম",
      description: "নবম শ্রেণীর শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা প্রোগ্রাম",
      features: [
        "সম্পূর্ণ সিলেবাস কভারেজ",
        "দৈনিক লাইভ ক্লাস",
        "সাপ্তাহিক মডেল টেস্ট",
        "ডিজিটাল নোটস এবং লেকচার শীট",
        "১০০+ প্র্যাকটিস পরীক্ষা",
        "ব্যক্তিগত মেন্টরিং সাপোর্ট"
      ],
      subjects: ["বাংলা", "ইংরেজি", "গণিত", "বিজ্ঞান", "সামাজিক বিজ্ঞান", "ধর্ম", "ICT"],
      duration: "১২ মাস",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "ক্লাস ১০ প্রোগ্রাম",
      description: "SSC পরীক্ষার জন্য সম্পূর্ণ প্রস্তুতি প্রোগ্রাম",
      features: [
        "SSC সিলেবাস অনুযায়ী সম্পূর্ণ কোর্স",
        "বোর্ড প্যাটার্ন অনুসরণ করে পরীক্ষা",
        "প্রতিদিন ২-৩টি লাইভ ক্লাস",
        "প্রিমিয়াম স্টাডি ম্যাটেরিয়াল",
        "মাসিক প্রগ্রেস রিপোর্ট",
        "SSC পূর্ববর্তী বছরের প্রশ্ন সল্ভ"
      ],
      subjects: ["বাংলা ১ম", "বাংলা ২য়", "ইংরেজি ১ম", "ইংরেজি ২য়", "গণিত", "পদার্থ", "রসায়ন", "জীববিজ্ঞান", "উচ্চতর গণিত"],
      duration: "১২ মাস",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "পলিটেকনিক প্রোগ্রাম",
      description: "ডিপ্লোমা ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা প্রস্তুতি",
      features: [
        "ভর্তি পরীক্ষার সিলেবাস অনুযায়ী কোর্স",
        "গণিত, পদার্থ, রসায়ন, ইংরেজি - সব বিষয়",
        "প্রতিদিন মডেল টেস্ট",
        "পূর্ববর্তী বছরের প্রশ্ন সমাধান",
        "ইন্সটিটিউট সিলেকশন গাইড",
        "অ্যাডমিশন প্রসেস সাপোর্ট"
      ],
      subjects: ["গণিত", "পদার্থবিজ্ঞান", "রসায়ন", "ইংরেজি"],
      duration: "৬ মাস",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const benefits = [
    { icon: Users, title: "অভিজ্ঞ শিক্ষক", description: "১০+ বছরের অভিজ্ঞতা সম্পন্ন শিক্ষকমণ্ডলী" },
    { icon: Clock, title: "সময়ের নমনীয়তা", description: "সুবিধাজনক সময়ে ক্লাস করার সুবিধা" },
    { icon: BookOpen, title: "প্রিমিয়াম কন্টেন্ট", description: "হাই-কোয়ালিটি স্টাডি ম্যাটেরিয়াল" },
    { icon: Award, title: "সার্টিফিকেট", description: "কোর্স সমাপ্তিতে সার্টিফিকেট প্রদান" },
    { icon: Target, title: "লক্ষ্য ভিত্তিক", description: "প্রতিটি শিক্ষার্থীর জন্য লক্ষ্য নির্ধারণ" },
    { icon: TrendingUp, title: "প্রগ্রেস ট্র্যাকিং", description: "নিয়মিত পারফরম্যান্স মনিটরিং" }
  ];

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
      <DialogContent className="max-w-[95vw] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl flex items-center gap-3">
            <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-[#285046]" />
            Techno Care Academy Program
          </DialogTitle>
          <DialogDescription>
            ক্লাস ৯-১০ এবং পলিটেকনিক শিক্ষার্থীদের জন্য বিশেষ প্রোগ্রাম
          </DialogDescription>
        </DialogHeader>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {programs.map((program, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
              <div className={`h-3 bg-gradient-to-r ${program.color}`} />
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl md:text-2xl text-[#1A202C] mb-2">{program.title}</h3>
                  <p className="text-sm text-[#555555]">{program.description}</p>
                </div>

                <div className="flex items-center gap-2 text-[#285046]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">সময়কাল: {program.duration}</span>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#1A202C]">বিষয়সমূহ:</p>
                  <div className="flex flex-wrap gap-2">
                    {program.subjects.map((subject, idx) => (
                      <span key={idx} className="px-3 py-1 bg-[#F7FAFC] text-[#285046] rounded-full text-xs">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-[#1A202C]">বৈশিষ্ট্য:</p>
                  <ul className="space-y-2">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-[#555555]">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white">
                  এনরোল করুন
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl text-[#1A202C] mb-6 text-center">
            প্রোগ্রামের সুবিধা
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-[#285046]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-xl">
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg text-[#1A202C] mb-1">{benefit.title}</h4>
                    <p className="text-sm text-[#555555]">{benefit.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <h3 className="text-2xl text-[#1A202C] mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#285046]" />
            শিক্ষার্থীদের মতামত ({reviews.length})
          </h3>

          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <Card key={review.id} className="p-5 bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                      {review.userAvatar ? (
                        <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">U</div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{review.userName}</h4>
                      <p className="text-xs text-capitalize text-gray-500">{review.targetName || review.targetType}</p>
                    </div>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  <p className="text-sm text-gray-600 line-clamp-3">"{review.comment}"</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              এখনো কোনো রিভিউ নেই
            </div>
          )}
        </div>

        {/* CTA Section */}
        <Card className="mt-8 p-8 bg-gradient-to-br from-[#285046] to-[#2F6057] text-white text-center">
          <h3 className="text-2xl md:text-3xl mb-3">আজই শুরু করুন আপনার সফলতার যাত্রা</h3>
          <p className="text-white/90 mb-6">
            হাজারো শিক্ষার্থী ইতিমধ্যে আমাদের প্রোগ্রামে যুক্ত হয়ে তাদের লক্ষ্য অর্জন করছে
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-[#285046] hover:bg-[#F7FAFC]">
              ফ্রি ট্রায়াল শুরু করুন
            </Button>
            <Button variant="outline" className="border-2 border-white bg-white text-[#1A202C] hover:bg-[#F7FAFC]">
              আরও জানুন
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}