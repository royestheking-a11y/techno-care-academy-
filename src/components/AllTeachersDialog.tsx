import { useState } from "react";
import { Star, X, Search, ArrowRight, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import teacher1 from "figma:asset/48270327a4e815b623f8289d3e1d48bc41ab5cbd.png";
import teacher2 from "figma:asset/f84a4fe2fdd985bf376e1786cf85c22b46fe8755.png";
import teacher3 from "figma:asset/835e9e66d42eb36daf2b5c0e857dd914dcb93d72.png";
import teacher4 from "figma:asset/96bb4a37e15efe0a903c030e8e8b6a1ffa7d687e.png";
import teacher5 from "figma:asset/74eccd820b240770c0be1ae1d90e8034a32efc12.png";
import teacher6 from "figma:asset/0f8f57e0ef02906bee742ca0ab59821cbd0f57f4.png";

interface Teacher {
  id: number;
  name: string;
  subject: string;
  experience: string;
  rating: number;
  students: string;
  initial: string;
  image: string;
  category: string;
}

interface AllTeachersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllTeachersDialog({ open, onOpenChange }: AllTeachersDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Generate 52 teachers with realistic data
  const allTeachers: Teacher[] = [
    // Featured teachers with uploaded images
    { id: 1, name: "ফাতেমা খাতুন", subject: "রসায়ন", experience: "১২ বছর", rating: 4.8, students: "450+", initial: "FK", image: teacher1, category: "science" },
    { id: 2, name: "সালমা বেগম", subject: "ইংরেজি", experience: "১০ বছর", rating: 4.7, students: "380+", initial: "SB", image: teacher2, category: "language" },
    { id: 3, name: "নাজমা আক্তার", subject: "বাংলা", experience: "১৪ বছর", rating: 4.8, students: "490+", initial: "NA", image: teacher3, category: "language" },
    { id: 4, name: "মো. করিম উদ্দিন", subject: "পদার্থ বিজ্ঞান", experience: "১৫ বছর", rating: 4.9, students: "500+", initial: "MK", image: teacher4, category: "science" },
    { id: 5, name: "রহিম আলী", subject: "গণিত", experience: "১৮ বছর", rating: 5.0, students: "700+", initial: "RA", image: teacher5, category: "math" },
    { id: 6, name: "শাকিল আহমেদ", subject: "জীববিজ্ঞান", experience: "১৩ বছর", rating: 4.9, students: "520+", initial: "SA", image: teacher6, category: "science" },
    { id: 7, name: "ড. আব্দুল কাদির", subject: "উচ্চতর পদার্থবিজ্ঞান", experience: "২০ বছর", rating: 4.9, students: "600+", initial: "AK", image: teacher4, category: "science" },
    { id: 8, name: "রুমানা পারভীন", subject: "জৈব রসায়ন", experience: "১১ বছর", rating: 4.7, students: "420+", initial: "RP", image: teacher1, category: "science" },
    { id: 9, name: "নাসরিন সুলতানা", subject: "পরিবেশ বিজ্ঞান", experience: "৯ বছর", rating: 4.6, students: "350+", initial: "NS", image: teacher2, category: "science" },
    { id: 10, name: "মো. জাহিদুল ইসলাম", subject: "পদার্থ বিজ্ঞান", experience: "১৪ বছর", rating: 4.8, students: "480+", initial: "JI", image: teacher5, category: "science" },
    { id: 11, name: "শাহীন আক্তার", subject: "উচ্চতর গণিত", experience: "১৬ বছর", rating: 4.9, students: "550+", initial: "SA", image: teacher3, category: "math" },
    { id: 12, name: "মো. রফিকুল ইসলাম", subject: "বীজগণিত", experience: "১৫ বছর", rating: 4.8, students: "520+", initial: "RI", image: teacher6, category: "math" },
    { id: 13, name: "তাসলিমা বেগম", subject: "জ্যামিতি", experience: "১২ বছর", rating: 4.7, students: "460+", initial: "TB", image: teacher1, category: "math" },
    { id: 14, name: "মো. আবুল কালাম", subject: "ত্রিকোণমিতি", experience: "১৭ বছর", rating: 4.9, students: "580+", initial: "AK", image: teacher4, category: "math" },
    { id: 15, name: "মাহমুদা আক্তার", subject: "পরিসংখ্যান", experience: "১০ বছর", rating: 4.6, students: "400+", initial: "MA", image: teacher2, category: "math" },
    { id: 16, name: "ড. শামসুন নাহার", subject: "বাংলা সাহিত্য", experience: "১৮ বছর", rating: 4.8, students: "530+", initial: "SN", image: teacher3, category: "language" },
    { id: 17, name: "মো. নূরুল ইসলাম", subject: "বাংলা ব্যাকরণ", experience: "১৩ বছর", rating: 4.7, students: "470+", initial: "NI", image: teacher5, category: "language" },
    { id: 18, name: "রাশিদা সুলতানা", subject: "ইংরেজি সাহিত্য", experience: "১১ বছর", rating: 4.8, students: "450+", initial: "RS", image: teacher1, category: "language" },
    { id: 19, name: "মো. শফিকুল ইসলাম", subject: "ইংরেজি গ্রামার", experience: "১৫ বছর", rating: 4.9, students: "510+", initial: "SI", image: teacher6, category: "language" },
    { id: 20, name: "সাদিয়া পারভীন", subject: "স্পোকেন ইংলিশ", experience: "৮ বছর", rating: 4.6, students: "380+", initial: "SP", image: teacher2, category: "language" },
    { id: 21, name: "মো. তানভীর আহমেদ", subject: "তথ্য ও যোগাযোগ প্রযুক্তি", experience: "১০ বছর", rating: 4.8, students: "440+", initial: "TA", image: teacher4, category: "ict" },
    { id: 22, name: "নুসরাত জাহান", subject: "কম্পিউটার সায়েন্স", experience: "৯ বছর", rating: 4.7, students: "390+", initial: "NJ", image: teacher1, category: "ict" },
    { id: 23, name: "মো. সাইফুল ইসলাম", subject: "প্রোগ্রামিং", experience: "১২ বছর", rating: 4.9, students: "480+", initial: "SI", image: teacher5, category: "ict" },
    { id: 24, name: "তাহমিনা খাতুন", subject: "ওয়েব ডেভেলপমেন্ট", experience: "৭ বছর", rating: 4.6, students: "320+", initial: "TK", image: teacher3, category: "ict" },
    { id: 25, name: "মো. রাকিবুল হাসান", subject: "ডেটাবেস ম্যানেজমেন্ট", experience: "১১ বছর", rating: 4.8, students: "420+", initial: "RH", image: teacher6, category: "ict" },
    { id: 26, name: "ড. মাহবুবুর রহমান", subject: "ইতিহাস", experience: "১৯ বছর", rating: 4.9, students: "560+", initial: "MR", image: teacher4, category: "social" },
    { id: 27, name: "লায়লা আফরোজ", subject: "ভূগোল", experience: "১৩ বছর", rating: 4.7, students: "470+", initial: "LA", image: teacher2, category: "social" },
    { id: 28, name: "মো. শহিদুল ইসলাম", subject: "পৌরনীতি", experience: "১৪ বছর", rating: 4.8, students: "490+", initial: "SI", image: teacher5, category: "social" },
    { id: 29, name: "রোকসানা বেগম", subject: "অর্থনীতি", experience: "১০ বছর", rating: 4.6, students: "410+", initial: "RB", image: teacher1, category: "social" },
    { id: 30, name: "মো. আলমগীর হোসেন", subject: "সমাজবিজ্ঞান", experience: "১৫ বছর", rating: 4.8, students: "500+", initial: "AH", image: teacher6, category: "social" },
    { id: 31, name: "মাওলানা আব্দুল্লাহ", subject: "ইসলাম শিক্ষা", experience: "২০ বছর", rating: 4.9, students: "620+", initial: "MA", image: teacher4, category: "religion" },
    { id: 32, name: "সাবিনা ইয়াসমিন", subject: "ইসলামিক স্টাডিজ", experience: "১১ বছর", rating: 4.7, students: "440+", initial: "SY", image: teacher3, category: "religion" },
    { id: 33, name: "মো. ইমরান হোসেন", subject: "আরবি", experience: "১৪ বছর", rating: 4.8, students: "480+", initial: "IH", image: teacher5, category: "religion" },
    { id: 34, name: "নাদিরা সুলতানা", subject: "কৃষি শিক্ষা", experience: "৯ বছর", rating: 4.6, students: "360+", initial: "NS", image: teacher2, category: "other" },
    { id: 35, name: "মো. জাহাঙ্গীর আলম", subject: "ক্যারি���়ার গাইডেন্স", experience: "১২ বছর", rating: 4.8, students: "450+", initial: "JA", image: teacher6, category: "other" },
    { id: 36, name: "সুমাইয়া আক্তার", subject: "ফিন্যান্স", experience: "৮ বছর", rating: 4.5, students: "340+", initial: "SA", image: teacher1, category: "other" },
    { id: 37, name: "মো. মনিরুল ইসলাম", subject: "হিসাববিজ্ঞান", experience: "১৫ বছর", rating: 4.8, students: "510+", initial: "MI", image: teacher4, category: "other" },
    { id: 38, name: "ফারজানা পারভীন", subject: "ব্যবসায় শিক্ষা", experience: "১০ বছর", rating: 4.7, students: "420+", initial: "FP", image: teacher3, category: "other" },
    { id: 39, name: "মো. আরিফুর রহমান", subject: "যুক্তিবিদ্যা", experience: "১৩ বছর", rating: 4.7, students: "460+", initial: "AR", image: teacher5, category: "other" },
    { id: 40, name: "শারমিন সুলতানা", subject: "গার্হস্থ্য বিজ্ঞান", experience: "৯ বছর", rating: 4.6, students: "370+", initial: "SS", image: teacher2, category: "other" },
    { id: 41, name: "মো. জামাল উদ্দিন", subject: "শারীরিক শিক্ষা", experience: "১১ বছর", rating: 4.7, students: "430+", initial: "JU", image: teacher6, category: "other" },
    { id: 42, name: "পারভীন আক্তার", subject: "মনোবিজ্ঞান", experience: "৮ বছর", rating: 4.5, students: "350+", initial: "PA", image: teacher1, category: "other" },
    { id: 43, name: "মো. সাইফুদ্দিন", subject: "দর্শন", experience: "১৬ বছর", rating: 4.8, students: "520+", initial: "SD", image: teacher4, category: "other" },
    { id: 44, name: "নাজনীন আক্তার", subject: "সংগীত", experience: "৭ বছর", rating: 4.6, students: "310+", initial: "NA", image: teacher3, category: "other" },
    { id: 45, name: "মো. আব্দুর রহিম", subject: "চারু ও কারুকলা", experience: "১০ বছর", rating: 4.7, students: "390+", initial: "AR", image: teacher5, category: "other" },
    { id: 46, name: "রেহানা পারভীন", subject: "পরিবেশ ও জলবায়ু", experience: "৯ বছর", rating: 4.6, students: "360+", initial: "RP", image: teacher2, category: "science" },
    { id: 47, name: "মো. তৌহিদুল ইসলাম", subject: "খেলাধুলা প্রশিক্ষণ", experience: "১২ বছর", rating: 4.8, students: "450+", initial: "TI", image: teacher6, category: "other" },
    { id: 48, name: "সানজিদা আফরিন", subject: "সৃজনশীল লেখা", experience: "৮ বছর", rating: 4.5, students: "330+", initial: "SA", image: teacher1, category: "language" },
    { id: 49, name: "মো. মাসুদুর রহমান", subject: "বিতর্ক ও বক্তৃতা", experience: "১৩ বছর", rating: 4.9, students: "470+", initial: "MR", image: teacher4, category: "language" },
    { id: 50, name: "মাহফুজা খাতুন", subject: "প্রজেক্ট ওয়ার্ক", experience: "৭ বছর", rating: 4.6, students: "340+", initial: "MK", image: teacher3, category: "other" },
    { id: 51, name: "মো. শাহজাহান আলী", subject: "ক্যারিয়ার কাউন্সেলিং", experience: "১৫ বছর", rating: 4.9, students: "530+", initial: "SA", image: teacher5, category: "other" },
    { id: 52, name: "তাহসিনা আক্তার", subject: "স্টাডি স্কিলস", experience: "৬ বছর", rating: 4.5, students: "300+", initial: "TA", image: teacher2, category: "other" },
  ];

  // Filter teachers based on category and search query
  const filteredTeachers = allTeachers.filter((teacher) => {
    const matchesCategory = selectedCategory === "all" || teacher.category === selectedCategory;
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[1600px] h-[90vh] overflow-hidden p-0 flex flex-col"
        aria-describedby="all-teachers-description"
      >
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b shrink-0 bg-gradient-to-r from-[#285046] to-[#2F6057]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-3xl mb-2">সকল শিক্ষকবৃন্দ</DialogTitle>
              <DialogDescription id="all-teachers-description" className="text-white/90 text-lg">
                আমাদের অভিজ্ঞ শিক্ষকদের সাথে পরিচিত হন
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
              placeholder="শিক্ষক বা বিষয় খুঁজুন..."
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
                <TabsTrigger value="all" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  সকল ({allTeachers.length})
                </TabsTrigger>
                <TabsTrigger value="science" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  বিজ্ঞান ({allTeachers.filter(t => t.category === "science").length})
                </TabsTrigger>
                <TabsTrigger value="math" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  গণিত ({allTeachers.filter(t => t.category === "math").length})
                </TabsTrigger>
                <TabsTrigger value="language" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  ভাষা ({allTeachers.filter(t => t.category === "language").length})
                </TabsTrigger>
                <TabsTrigger value="ict" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  আইসিটি ({allTeachers.filter(t => t.category === "ict").length})
                </TabsTrigger>
                <TabsTrigger value="social" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  সামাজিক ({allTeachers.filter(t => t.category === "social").length})
                </TabsTrigger>
                <TabsTrigger value="religion" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  ধর্ম ({allTeachers.filter(t => t.category === "religion").length})
                </TabsTrigger>
                <TabsTrigger value="other" className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all">
                  অন্যান্য ({allTeachers.filter(t => t.category === "other").length})
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          {/* Content */}
          {["all", "science", "math", "language", "ict", "social", "religion", "other"].map((category) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-y-auto px-8 py-6 mt-0 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {filteredTeachers.map((teacher, index) => (
                  <motion.div
                    key={teacher.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                      {/* Teacher Image/Avatar Section */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                        
                        {/* Avatar */}
                        <Avatar className="w-32 h-32 ring-4 ring-white shadow-xl relative z-10">
                          <AvatarImage src={teacher.image} alt={teacher.name} />
                          <AvatarFallback className="bg-white text-[#285046] text-3xl">
                            {teacher.initial}
                          </AvatarFallback>
                        </Avatar>

                        {/* Rating Badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#FFB703] text-[#FFB703]" />
                          <span className="text-sm">{teacher.rating}</span>
                        </div>

                        {/* Students Badge */}
                        <div className="absolute bottom-4 left-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                          {teacher.students} শিক্ষার্থী
                        </div>
                      </div>

                      {/* Teacher Details */}
                      <div className="p-6">
                        <h3 className="text-xl text-[#1A202C] mb-2">{teacher.name}</h3>
                        <p className="text-[#555555] mb-4">{teacher.subject}</p>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[#555555] flex-shrink-0">
                            <User className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">অভিজ্ঞতা: {teacher.experience}</span>
                          </div>
                          <Button className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-lg flex-shrink-0 px-3 py-1.5 h-auto text-xs">
                            View Profile
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredTeachers.length === 0 && (
                <div className="text-center py-20">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#555555] text-xl">কোন শিক্ষক পাওয়া যায়নি</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}