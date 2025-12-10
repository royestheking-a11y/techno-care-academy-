import { useState } from "react";
import { Video, ExternalLink, X, Search, Users, Play, ArrowRight, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { motion } from "motion/react";

interface LiveClass {
  id: number;
  subject: string;
  teacher: string;
  viewers: string;
  isLive: boolean;
  category: string;
}

interface AllLiveClassesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllLiveClassesDialog({ open, onOpenChange }: AllLiveClassesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Extended live classes data
  const allLiveClasses: LiveClass[] = [
    // Science Classes
    { id: 1, subject: "পদার্থ বিজ্ঞান - প্রথম অধ্যায়", teacher: "মো. করিম স্যার", viewers: "234", isLive: true, category: "science" },
    { id: 2, subject: "জীববিজ্ঞান - কোষ বিভাজন", teacher: "শাকিল স্যার", viewers: "189", isLive: true, category: "science" },
    { id: 3, subject: "রসায়ন - জৈব যৌগ", teacher: "ফাতেমা ম্যাম", viewers: "167", isLive: true, category: "science" },
    { id: 4, subject: "পদার্থ বিজ্ঞান - গতিবিদ্যা", teacher: "মো. করিম স্যার", viewers: "201", isLive: false, category: "science" },
    { id: 5, subject: "জীববিজ্ঞান - মানব দেহতত্ত্ব", teacher: "শাকিল স্যার", viewers: "178", isLive: false, category: "science" },

    // Math Classes
    { id: 6, subject: "গণিত - জ্যামিতি", teacher: "রহিম স্যার", viewers: "276", isLive: true, category: "math" },
    { id: 7, subject: "গণিত - বীজগণিত", teacher: "রহিম স্যার", viewers: "298", isLive: false, category: "math" },
    { id: 8, subject: "গণিত - ত্রিকোণমিতি", teacher: "রহিম স্যার", viewers: "245", isLive: false, category: "math" },
    { id: 9, subject: "উচ্চতর গণিত - ক্যালকুলাস", teacher: "রহিম স্যার", viewers: "156", isLive: true, category: "math" },

    // English Classes
    { id: 10, subject: "ইংরেজি গ্রামার", teacher: "সালমা ম্যাম", viewers: "312", isLive: true, category: "english" },
    { id: 11, subject: "ইংরেজি - Reading Comprehension", teacher: "সালমা ম্যাম", viewers: "223", isLive: false, category: "english" },
    { id: 12, subject: "ইংরেজি - Writing Skills", teacher: "সালমা ম্যাম", viewers: "198", isLive: false, category: "english" },
    { id: 13, subject: "Spoken English", teacher: "সালমা ম্যাম", viewers: "267", isLive: true, category: "english" },

    // Bangla Classes
    { id: 14, subject: "বাংলা - সাহিত্য পর্যালোচনা", teacher: "নাজমা ম্যাম", viewers: "189", isLive: false, category: "bangla" },
    { id: 15, subject: "বাংলা ব্যাকরণ", teacher: "নাজমা ম্যাম", viewers: "234", isLive: true, category: "bangla" },
    { id: 16, subject: "বাংলা - রচনা লেখন", teacher: "নাজমা ম্যাম", viewers: "167", isLive: false, category: "bangla" },

    // ICT Classes
    { id: 17, subject: "ICT - প্রোগ্রামিং বেসিক", teacher: "আরিফ স্যার", viewers: "345", isLive: true, category: "ict" },
    { id: 18, subject: "ICT - ওয়েব ডিজাইন", teacher: "আরিফ স্যার", viewers: "289", isLive: false, category: "ict" },
    { id: 19, subject: "ICT - ডাটাবেস ম্যানেজমেন্ট", teacher: "আরিফ স্যার", viewers: "212", isLive: false, category: "ict" },

    // SSC Preparation
    { id: 20, subject: "SSC পরীক্ষা প্রস্তুতি - টিপস", teacher: "করিম স্যার", viewers: "456", isLive: true, category: "ssc" },
    { id: 21, subject: "SSC শেষ মুহূর্তের প্রস্তুতি", teacher: "ফাতেমা ম্যাম", viewers: "389", isLive: false, category: "ssc" },
    { id: 22, subject: "SSC মডেল টেস্ট আলোচনা", teacher: "রহিম স্যার", viewers: "412", isLive: true, category: "ssc" },
  ];

  // Filter live classes based on category and search query
  const filteredClasses = allLiveClasses.filter((liveClass) => {
    const matchesCategory = selectedCategory === "all" || liveClass.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      liveClass.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      liveClass.teacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Count live classes
  const liveCount = allLiveClasses.filter(c => c.isLive).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[1600px] h-[90vh] overflow-hidden p-0 flex flex-col"
        aria-describedby="all-live-classes-description"
      >
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b shrink-0 bg-gradient-to-r from-[#285046] to-[#2F6057]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-white text-3xl mb-2">সকল লাইভ ক্লাস</DialogTitle>
              <DialogDescription id="all-live-classes-description" className="text-white/90 text-lg">
                সরাসরি অংশ নিন এবং শিখুন অভিজ্ঞ শিক্ষকদের কাছ থেকে
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
              placeholder="লাইভ ক্লাস খুঁজুন..."
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
                  সকল ({allLiveClasses.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="science" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  বিজ্ঞান ({allLiveClasses.filter(c => c.category === "science").length})
                </TabsTrigger>
                <TabsTrigger 
                  value="math" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  গণিত ({allLiveClasses.filter(c => c.category === "math").length})
                </TabsTrigger>
                <TabsTrigger 
                  value="english" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  ইংরেজি ({allLiveClasses.filter(c => c.category === "english").length})
                </TabsTrigger>
                <TabsTrigger 
                  value="bangla" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  বাংলা ({allLiveClasses.filter(c => c.category === "bangla").length})
                </TabsTrigger>
                <TabsTrigger 
                  value="ict" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  ICT ({allLiveClasses.filter(c => c.category === "ict").length})
                </TabsTrigger>
                <TabsTrigger 
                  value="ssc" 
                  className="px-6 py-3 text-base data-[state=active]:bg-[#285046] data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg transition-all"
                >
                  SSC ({allLiveClasses.filter(c => c.category === "ssc").length})
                </TabsTrigger>
              </TabsList>
            </ScrollArea>
          </div>

          {/* Content */}
          {["all", "science", "math", "english", "bangla", "ict", "ssc"].map((category) => (
            <TabsContent key={category} value={category} className="flex-1 overflow-y-auto px-8 py-6 mt-0 min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {filteredClasses.map((liveClass, index) => (
                  <motion.div
                    key={liveClass.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                      {/* Video Background */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                        
                        {/* Video Icon */}
                        <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-full p-8 group-hover:bg-[#FFB703] transition-colors">
                          {liveClass.isLive ? (
                            <Play className="w-12 h-12 text-[#285046] group-hover:text-white" />
                          ) : (
                            <Video className="w-12 h-12 text-[#285046] group-hover:text-white" />
                          )}
                        </div>

                        {/* Live Badge */}
                        {liveClass.isLive && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse text-sm">
                            <span className="w-2 h-2 bg-white rounded-full" />
                            LIVE
                          </div>
                        )}

                        {/* Viewer Count */}
                        <div className="absolute bottom-4 left-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {liveClass.viewers}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-xl text-[#1A202C] mb-2">{liveClass.subject}</h3>
                        <p className="text-[#555555] mb-4">{liveClass.teacher}</p>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[#555555] flex-shrink-0">
                            <Users className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">{liveClass.viewers} watching</span>
                          </div>
                          <Button className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-lg flex-shrink-0 px-3 py-1.5 h-auto text-xs">
                            {liveClass.isLive ? "Join Live" : "Watch"}
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredClasses.length === 0 && (
                <div className="text-center py-20">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#555555] text-xl">কোন লাইভ ক্লাস পাওয়া যায়নি</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}