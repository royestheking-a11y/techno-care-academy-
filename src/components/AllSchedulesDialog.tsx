import { useState, useEffect } from "react";
import { Calendar, ExternalLink, X, Search, Loader2, Clock, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { schedulesAPI } from "../utils/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Schedule {
  id: number;
  day: string;
  subject: string;
  teacher: string;
  time: string;
  platform: string;
  link: string;
  isLive: boolean;
}

interface AllSchedulesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AllSchedulesDialog({ open, onOpenChange }: AllSchedulesDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchSchedules();
    }
  }, [open]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await schedulesAPI.getAll();
      if (response.success && response.data.length > 0) {
        setSchedules(response.data);
      } else {
        // Fallback data if no schedules in database
        setSchedules([
          {
            id: 1,
            day: "রবিবার",
            subject: "পদার্থ বিজ্ঞান",
            teacher: "মো. করিম স্যার",
            time: "সকাল ১০:০০",
            platform: "YouTube",
            link: "https://youtube.com",
            isLive: false,
          },
          {
            id: 2,
            day: "সোমবার",
            subject: "রসায়ন",
            teacher: "ফাতেমা ম্যাম",
            time: "বিকাল ৩:০০",
            platform: "Zoom",
            link: "https://zoom.us",
            isLive: true,
          },
          {
            id: 3,
            day: "মঙ্গলবার",
            subject: "গণিত",
            teacher: "রহিম স্যার",
            time: "সকাল ৯:০০",
            platform: "YouTube",
            link: "https://youtube.com",
            isLive: false,
          },
          {
            id: 4,
            day: "বুধবার",
            subject: "ইংরেজি",
            teacher: "সালমা ম্যাম",
            time: "বিকাল ৪:০০",
            platform: "Zoom",
            link: "https://zoom.us",
            isLive: false,
          },
          {
            id: 5,
            day: "বৃহস্পতিবার",
            subject: "জীববিজ্ঞান",
            teacher: "শাকিল স্যার",
            time: "সকাল ১১:০০",
            platform: "YouTube",
            link: "https://youtube.com",
            isLive: true,
          },
          {
            id: 6,
            day: "শুক্রবার",
            subject: "বাংলা",
            teacher: "নাজমা ম্যাম",
            time: "বিকাল ২:০০",
            platform: "Zoom",
            link: "https://zoom.us",
            isLive: false,
          },
          {
            id: 7,
            day: "শনিবার",
            subject: "ICT",
            teacher: "আরিফ স্যার",
            time: "সকাল ১০:০০",
            platform: "YouTube",
            link: "https://youtube.com",
            isLive: false,
          },
          {
            id: 8,
            day: "রবিবার",
            subject: "উচ্চতর গণিত",
            teacher: "রহিম স্যার",
            time: "বিকাল ৫:০০",
            platform: "Zoom",
            link: "https://zoom.us",
            isLive: false,
          },
        ]);
      }
    } catch (error) {
      console.warn("Error fetching schedules:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter schedules based on search query
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesSearch = searchQuery === "" || 
      schedule.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      schedule.day.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-[1600px] h-[90vh] overflow-hidden p-0 flex flex-col"
        aria-describedby="all-schedules-description"
      >
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b shrink-0 bg-gradient-to-r from-[#285046] to-[#2F6057]">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-4xl text-white mb-2">
                সম্পূর্ণ ক্লাস সময়সূচী
              </DialogTitle>
              <DialogDescription id="all-schedules-description" className="text-white/90 text-lg">
                সাপ্তাহিক সকল ক্লাসের বিস্তারিত সময়সূচী ({filteredSchedules.length} টি ক্লাস)
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
              placeholder="ক্লাস খুঁজুন (বিষয়, শিক্ষক, দিন)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-14 bg-white h-14 text-lg rounded-xl border-gray-200"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <Loader2 className="w-16 h-16 animate-spin text-[#285046]" />
            </div>
          ) : (
            <>
              {/* Grid Cards Layout - Same as courses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                {filteredSchedules.map((schedule, index) => (
                  <motion.div
                    key={schedule.id || index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                      {/* Schedule Image - Gradient background with icon */}
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
                        <Calendar className="w-24 h-24 text-white/30" />
                        
                        {/* Live Badge */}
                        {schedule.isLive && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full flex items-center gap-2 animate-pulse text-sm">
                            <span className="w-2 h-2 bg-white rounded-full" />
                            LIVE
                          </div>
                        )}
                        
                        {/* Day Badge */}
                        <div className="absolute bottom-4 left-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                          {schedule.day}
                        </div>
                      </div>

                      {/* Schedule Details */}
                      <div className="p-6">
                        <h3 className="text-xl text-[#1A202C] mb-2">{schedule.subject}</h3>
                        <p className="text-[#555555] mb-4">{schedule.teacher}</p>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-[#555555] flex-shrink-0">
                            <Clock className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm whitespace-nowrap">{schedule.time}</span>
                          </div>
                          <Button 
                            onClick={() => window.open(schedule.link, '_blank')}
                            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-lg flex-shrink-0 px-3 py-1.5 h-auto text-xs"
                          >
                            Join Now
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {filteredSchedules.length === 0 && (
                <div className="text-center py-20">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-[#555555] text-xl">কোন সময়সূচী পাওয়া যায়নি</p>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}