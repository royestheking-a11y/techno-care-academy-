import { useState } from "react";
import { Play, Clock, X, Search, Users, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CourseEnrollmentDialog } from "./CourseEnrollmentDialog";
const sscCourseImg = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
const mathBookImg = "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800";
const polytechnicImg = "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800";

interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  enrolled: string;
  category: string;
  price: string;
}

interface AllCoursesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllCoursesDialog({ open, onOpenChange }: AllCoursesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleEnrollClick = (course: Course) => {
    setSelectedCourse(course);
    setShowEnrollment(true);
  };

  // 25 courses with detailed information
  const allCourses: Course[] = [
    // SSC Courses
    {
      id: 1,
      title: "SSC পরীক্ষা প্রস্তুতি - সম্পূর্ণ কোর্স",
      description: "Class 9 & 10 এর জন্য বিস্তারিত পাঠ্যক্রম",
      duration: "১২ মাস",
      image: sscCourseImg,
      enrolled: "712+",
      category: "ssc",
      price: "৳৫,৫০০",
    },
    {
      id: 2,
      title: "SSC বিজ্ঞান বিভাগ - সম্পূর্ণ কোর্স",
      description: "গণিত, পদার্থ, রসায়ন ও জীববিজ্ঞান সহ সকল বিষয়",
      duration: "১২ মাস",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
      enrolled: "856+",
      category: "ssc",
      price: "৳৬,০০০",
    },
    {
      id: 3,
      title: "SSC মানবিক বিভাগ - সম্পূর্ণ কোর্স",
      description: "ইতিহাস, ভূগোল, পৌরনীতি ও অর্থনীতি",
      duration: "১২ মাস",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      enrolled: "634+",
      category: "ssc",
      price: "৳৫,০০০",
    },
    {
      id: 4,
      title: "SSC ব্যবসায় শিক্ষা - সম্পূর্ণ কোর্স",
      description: "হিসাববিজ্ঞান, ব্যবসায় উদ্যোগ ও ফিন্যান্স",
      duration: "১২ মাস",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      enrolled: "478+",
      category: "ssc",
      price: "৳৫,০০০",
    },
    {
      id: 5,
      title: "SSC শেষ মুহূর্তের প্রস্তুতি",
      description: "পরীক্ষার আগের ৩ মাসের বিশেষ কোর্স",
      duration: "৩ মাস",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      enrolled: "523+",
      category: "ssc",
      price: "৳৩,০০০",
    },

    // Polytechnic Courses
    {
      id: 6,
      title: "পলিটেকনিক ভর্তি প্রস্তুতি",
      description: "ডিপ্লোমা ইঞ্জিনিয়ারিং ভর্তি পরীক্ষা সম্পূর্ণ গাইড",
      duration: "৬ মাস",
      image: polytechnicImg,
      enrolled: "543+",
      category: "polytechnic",
      price: "৳৪,৫০০",
    },
    {
      id: 7,
      title: "সিভিল টেকনোলজি ভর্তি প্রস্তুতি",
      description: "সিভিল ইঞ্জিনিয়ারিং ডিপ্লোমা কোর্স",
      duration: "৫ মাস",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
      enrolled: "412+",
      category: "polytechnic",
      price: "৳৩,৮০০",
    },
    {
      id: 8,
      title: "কম্পিউটার টেকনোলজি ভর্তি",
      description: "কম্পিউটার সায়েন্স ডিপ্লোমা প্রস্তুতি",
      duration: "৫ মাস",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
      enrolled: "789+",
      category: "polytechnic",
      price: "৳৪,০০০",
    },
    {
      id: 9,
      title: "ইলেকট্রিক্যাল টেকনোলজি কোর্স",
      description: "ইলেকট্রিক্যাল ইঞ্জিনিয়ারিং ডিপ্লোমা",
      duration: "৫ মাস",
      image: "https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800",
      enrolled: "356+",
      category: "polytechnic",
      price: "৳৩,৮০০",
    },

    // Math Courses
    {
      id: 10,
      title: "গণিত বিশেষ কোর্স",
      description: "৯ম ও ১০ম শ্রেণির সকল অধ্যায় বিস্তারিত",
      duration: "৮ মাস",
      image: mathBookImg,
      enrolled: "892+",
      category: "math",
      price: "৳৩,৫০০",
    },
    {
      id: 11,
      title: "উচ্চতর গণিত কোর্স",
      description: "ক্যালকুলাস, জ্যামিতি ও ত্রিকোণমিতি",
      duration: "৬ মাস",
      image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800",
      enrolled: "567+",
      category: "math",
      price: "৳৩,০০০",
    },
    {
      id: 12,
      title: "গণিত অলিম্পিয়াড প্রস্তুতি",
      description: "জাতীয় ও আন্তর্জাতিক প্রতিযোগিতার জন্য",
      duration: "১০ মাস",
      image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
      enrolled: "234+",
      category: "math",
      price: "৳৪,৫০০",
    },

    // Science Courses
    {
      id: 13,
      title: "বিজ্ঞান সমন্বিত কোর্স",
      description: "পদার্থ, রসায়ন ও জীববিজ্ঞান একসাথে",
      duration: "১০ মাস",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
      enrolled: "623+",
      category: "science",
      price: "৳৫,০০০",
    },
    {
      id: 14,
      title: "পদার্থবিজ্ঞান বিশেষ কোর্স",
      description: "৯ম ও ১০ম শ্রেণির পদার্থবিজ্ঞান",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800",
      enrolled: "445+",
      category: "science",
      price: "৳৩,২০০",
    },
    {
      id: 15,
      title: "রসায়ন বিশেষ কোর্স",
      description: "জৈব ও অজৈব রসায়ন বিস্তারিত",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800",
      enrolled: "398+",
      category: "science",
      price: "৳৩,২০০",
    },
    {
      id: 16,
      title: "জীববিজ্ঞান বিশেষ কোর্স",
      description: "উদ্ভিদবিজ্ঞান ও প্রাণীবিজ্ঞান সম্পূর্ণ",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
      enrolled: "512+",
      category: "science",
      price: "৳৩,২০০",
    },

    // ICT Courses
    {
      id: 17,
      title: "ICT সম্পূর্ণ কোর্স",
      description: "তথ্য ও যোগাযোগ প্রযুক্তি সম্পূর্ণ গাইড",
      duration: "৬ মাস",
      image: "https://images.unsplash.com/photo-1484807352052-23338990c6c6?w=800",
      enrolled: "678+",
      category: "ict",
      price: "৳৩,৫০০",
    },
    {
      id: 18,
      title: "প্রোগ্রামিং বেসিক কোর্স",
      description: "C, C++ এবং Python প্রোগ্রামিং",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      enrolled: "892+",
      category: "ict",
      price: "৳৪,০০০",
    },
    {
      id: 19,
      title: "ওয়েব ডেভেলপমেন্ট কোর্স",
      description: "HTML, CSS, JavaScript শিখুন",
      duration: "৬ মাস",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      enrolled: "756+",
      category: "ict",
      price: "৳৪,৫০০",
    },

    // English Courses
    {
      id: 20,
      title: "ইংরেজি ভাষা দক্ষতা কোর্স",
      description: "Speaking, Writing, Grammar সম্পূর্ণ",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
      enrolled: "823+",
      category: "english",
      price: "৳৩,৮০০",
    },
    {
      id: 21,
      title: "ইংরেজি গ্রামার মাস্টার কোর্স",
      description: "সম্পূর্ণ ব্যাকরণ বিস্তারিত আলোচনা",
      duration: "৬ মাস",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
      enrolled: "567+",
      category: "english",
      price: "৳৩,০০০",
    },
    {
      id: 22,
      title: "IELTS প্রস্তুতি কোর্স",
      description: "আন্তর্জাতিক ইংরেজি পরীক্ষা প্রস্তুতি",
      duration: "৪ মাস",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      enrolled: "289+",
      category: "english",
      price: "৳৫,৫০০",
    },

    // Bangla Courses
    {
      id: 23,
      title: "বাংলা ভাষা ও সাহিত্য",
      description: "৯ম ও ১০ম শ্রেণির বাংলা সম্পূর্ণ",
      duration: "৮ মাস",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
      enrolled: "734+",
      category: "bangla",
      price: "৳৩,০০০",
    },
    {
      id: 24,
      title: "বাংলা ব্যাকরণ ও রচনা",
      description: "ব্যাকরণ ও সৃজনশীল রচনা মাস্টার কোর্স",
      duration: "৬ মাস",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800",
      enrolled: "456+",
      category: "bangla",
      price: "৳২,৫০০",
    },

    // Special Courses
    {
      id: 25,
      title: "পরীক্ষা স্কিল ডেভেলপমেন্ট",
      description: "সময় ব্যবস্থাপনা ও পরীক্ষা টেকনিক",
      duration: "৩ মাস",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
      enrolled: "589+",
      category: "special",
      price: "৳২,০০০",
    },
  ];

  // Filter courses based on category and search query
  const filteredCourses = allCourses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[1600px] h-[90vh] overflow-hidden p-0 flex flex-col"
        aria-describedby="all-courses-description"
      >
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b shrink-0 bg-gradient-to-r from-[#285046] to-[#2F6057]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-3xl mb-2">সকল কোর্স সমূহ</DialogTitle>
              <DialogDescription id="all-courses-description" className="text-white/90 text-lg">
                আপনার পছন্দের কোর্স খুঁজে নিন এবং ভর্তি হন
              </DialogDescription>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-3 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="w-7 h-7 text-white" />
            </button>
          </div>
        </DialogHeader>

        {/* Search Bar */}
        <div className="px-8 py-5 border-b bg-[#F7FAFC] shrink-0">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <Input
              placeholder="কোর্স খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 bg-white h-14 text-lg rounded-xl border-gray-200"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="all"
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div className="px-8 pt-5 bg-white border-b shrink-0">
            <ScrollArea className="w-full whitespace-nowrap pb-4">
              <TabsList className="inline-flex h-auto p-1 bg-gray-100 rounded-xl gap-2">
                <TabsTrigger
                  value="all"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  সকল ({allCourses.length})
                </TabsTrigger>
                <TabsTrigger
                  value="ssc"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  SSC ({allCourses.filter(c => c.category === "ssc").length})
                </TabsTrigger>
                <TabsTrigger
                  value="polytechnic"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  পলিটেকনিক ({allCourses.filter(c => c.category === "polytechnic").length})
                </TabsTrigger>
                <TabsTrigger
                  value="math"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  গণিত ({allCourses.filter(c => c.category === "math").length})
                </TabsTrigger>
                <TabsTrigger
                  value="science"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  বিজ্ঞান ({allCourses.filter(c => c.category === "science").length})
                </TabsTrigger>
                <TabsTrigger
                  value="ict"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  ICT ({allCourses.filter(c => c.category === "ict").length})
                </TabsTrigger>
                <TabsTrigger
                  value="english"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  ইংরেজি ({allCourses.filter(c => c.category === "english").length})
                </TabsTrigger>
                <TabsTrigger
                  value="bangla"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  বাংলা ({allCourses.filter(c => c.category === "bangla").length})
                </TabsTrigger>
                <TabsTrigger
                  value="special"
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  বিশেষ ({allCourses.filter(c => c.category === "special").length})
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          {/* Content */}
          {["all", "ssc", "polytechnic", "math", "science", "ict", "english", "bangla", "special"].map((category) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-y-auto px-8 py-6 mt-0 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {filteredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden">
                        <ImageWithFallback
                          src={course.image}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:bg-[#FFB703] transition-colors">
                          <Play className="w-5 h-5 text-[#285046] group-hover:text-white" />
                        </div>
                        <div className="absolute bottom-4 left-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                          {course.enrolled} শিক্ষার্থী
                        </div>
                      </div>

                      {/* Course Details */}
                      <div className="p-6">
                        <h3 className="text-xl text-[#1A202C] mb-2">{course.title}</h3>
                        <p className="text-[#555555] mb-4">{course.description}</p>

                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[#555555] flex-shrink-0">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">{course.duration}</span>
                          </div>
                          <Button
                            onClick={() => handleEnrollClick(course)}
                            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-lg flex-shrink-0 px-3 py-1.5 h-auto text-xs"
                          >
                            Enroll
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-[#555555] text-xl">কোন কোর্স পাওয়া যায়নি</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <CourseEnrollmentDialog
          open={showEnrollment}
          onOpenChange={setShowEnrollment}
          course={selectedCourse}
        />
      </DialogContent>
    </Dialog>
  );
}