import { useState, useEffect } from "react";
import { ArrowLeft, FileText, Clock, Award, TrendingUp, Calendar, Users, CheckCircle, Play } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface Exam {
  id: number;
  title: string;
  description: string;
  duration: string;
  totalMarks: number;
  category: string;
  questions: number;
  date: string;
  time: string;
  status: "upcoming" | "live" | "completed";
  participants: number;
}

interface FreeExamPageProps {
  onBackToHome: () => void;
}

export function FreeExamPage({ onBackToHome }: FreeExamPageProps) {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    const stored = localStorage.getItem("exams");
    if (stored) {
      setExams(JSON.parse(stored));
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      upcoming: "bg-blue-100 text-blue-700 border-blue-200",
      live: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-gray-100 text-gray-700 border-gray-200"
    };
    const labels = {
      upcoming: "আসন্ন",
      live: "চলমান",
      completed: "সমাপ্ত"
    };
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] };
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      class9: "bg-blue-100 text-blue-700 border-blue-200",
      class10: "bg-green-100 text-green-700 border-green-200",
      polytechnic: "bg-purple-100 text-purple-700 border-purple-200"
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      class9: "ক্লাস ৯",
      class10: "ক্লাস ১০",
      polytechnic: "পলিটেকনিক"
    };
    return names[category] || category;
  };

  const filteredExams = filter === "all" ? exams : exams.filter(e => e.category === filter);

  const examStats = {
    total: exams.length,
    upcoming: exams.filter(e => e.status === "upcoming").length,
    live: exams.filter(e => e.status === "live").length,
    completed: exams.filter(e => e.status === "completed").length
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>হোমপেজে ফিরে যান</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl mb-1">Free Exam</h1>
              <p className="text-white/90">নিয়মিত ফ্রি পরীক্ষা এবং মূল্যায়ন সিস্টেম</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">মোট পরীক্ষা</p>
                <p className="text-3xl text-[#1A202C]">{examStats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">চলমান</p>
                <p className="text-3xl text-[#1A202C]">{examStats.live}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">আসন্ন</p>
                <p className="text-3xl text-[#1A202C]">{examStats.upcoming}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-xl">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">সমাপ্ত</p>
                <p className="text-3xl text-[#1A202C]">{examStats.completed}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-[#F7FAFC] to-white border-2">
          <h2 className="text-2xl md:text-3xl text-[#1A202C] mb-6 text-center">পরীক্ষা সিস্টেমের বৈশিষ্ট্য</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "বিভিন্ন ধরনের পরীক্ষা",
                description: "MCQ, লিখিত এবং মিশ্র ধরনের পরীক্ষা"
              },
              {
                icon: Clock,
                title: "সময় নির্ধারিত",
                description: "প্রতিটি পরীক্ষার জন্য নির্দিষ্ট সময়সীমা"
              },
              {
                icon: TrendingUp,
                title: "তাৎক্ষণিক ফলাফল",
                description: "পরীক্ষা শেষে সাথে সাথে ফলাফল"
              },
              {
                icon: Award,
                title: "পারফরম্যান্স বিশ্লেষণ",
                description: "বিস্তারিত পারফরম্যান্স রিপোর্ট"
              }
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="p-4 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-2xl mb-3">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg text-[#1A202C] mb-2">{feature.title}</h4>
                <p className="text-sm text-[#555555]">{feature.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#285046]" : ""}
          >
            সকল পরীক্ষা
          </Button>
          <Button
            variant={filter === "class9" ? "default" : "outline"}
            onClick={() => setFilter("class9")}
            className={filter === "class9" ? "bg-[#285046]" : ""}
          >
            ক্লাস ৯
          </Button>
          <Button
            variant={filter === "class10" ? "default" : "outline"}
            onClick={() => setFilter("class10")}
            className={filter === "class10" ? "bg-[#285046]" : ""}
          >
            ক্লাস ১০
          </Button>
          <Button
            variant={filter === "polytechnic" ? "default" : "outline"}
            onClick={() => setFilter("polytechnic")}
            className={filter === "polytechnic" ? "bg-[#285046]" : ""}
          >
            পলিটেকনিক
          </Button>
        </div>

        {/* Exams Grid */}
        {filteredExams.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-[#1A202C] mb-2">কোনো পরীক্ষা পাওয়া যায়নি</h3>
            <p className="text-[#555555]">এই ক্যাটাগরিতে পরীক্ষা যোগ করা হয়নি</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const statusBadge = getStatusBadge(exam.status);
              return (
                <Card
                  key={exam.id}
                  className="overflow-hidden border-2 hover:border-[#285046] hover:shadow-xl transition-all duration-300"
                >
                  {/* Header */}
                  <div className="p-6 bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`${getCategoryBadge(exam.category)} border`}>
                        {getCategoryName(exam.category)}
                      </Badge>
                      <Badge className={`${statusBadge.style} border`}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                    <h3 className="text-xl mb-2">{exam.title}</h3>
                    <p className="text-white/80 text-sm">{exam.description}</p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-[#555555]">
                        <Clock className="w-4 h-4 text-[#285046]" />
                        <span>{exam.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#555555]">
                        <Award className="w-4 h-4 text-[#285046]" />
                        <span>{exam.totalMarks} নম্বর</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#555555]">
                        <FileText className="w-4 h-4 text-[#285046]" />
                        <span>{exam.questions} প্রশ্ন</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#555555]">
                        <Users className="w-4 h-4 text-[#285046]" />
                        <span>{exam.participants}+ অংশগ্রহণ</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-[#555555] mb-3">
                        <Calendar className="w-4 h-4 text-[#285046]" />
                        <span>{exam.date} | {exam.time}</span>
                      </div>

                      {exam.status === "live" && (
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white">
                          <Play className="w-4 h-4 mr-2" />
                          এখনই অংশগ্রহণ করুন
                        </Button>
                      )}
                      {exam.status === "upcoming" && (
                        <Button className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          রেজিস্ট্রেশন করুন
                        </Button>
                      )}
                      {exam.status === "completed" && (
                        <Button variant="outline" className="w-full border-[#285046] text-[#285046]">
                          ফলাফল দেখুন
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Benefits Section */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
          <h3 className="text-2xl md:text-3xl mb-6 text-center">ফ্রি পরীক্ষায় অংশগ্রহণের সুবিধা</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "সম্পূর্ণ বিনামূল্যে পরীক্ষায় অংশগ্রহণ",
              "বোর্ড প্যাটার্ন অনুসরণ করে প্রশ্ন",
              "তাৎক্ষণিক ফলাফল এবং উত্তরপত্র",
              "বিস্তারিত পারফরম্যান্স বিশ্লেষণ",
              "র্যাঙ্কিং সিস্টেম এবং লিডারবোর্ড",
              "দুর্বল দিক চিহ্নিতকরণ এবং উন্নতির পরামর্শ"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#FFB703] flex-shrink-0 mt-0.5" />
                <span className="text-white/90">{benefit}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
