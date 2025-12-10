import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, Clock, ExternalLink, Video } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { schedulesAPI } from "../../utils/api";
import { toast } from "sonner";

interface SchedulesPageProps {
  onBackToHome: () => void;
}

export function SchedulesPage({ onBackToHome }: SchedulesPageProps) {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [groupedSchedules, setGroupedSchedules] = useState<any>({});

  useEffect(() => {
    loadSchedules();
  }, []);

  useEffect(() => {
    groupSchedulesByDay();
  }, [schedules]);

  const loadSchedules = async () => {
    const response = await schedulesAPI.getAll();
    if (response.success) {
      setSchedules(response.data);
    }
  };

  const groupSchedulesByDay = () => {
    const grouped = schedules.reduce((acc: any, schedule: any) => {
      const day = schedule.day || "অন্যান্য";
      if (!acc[day]) {
        acc[day] = [];
      }
      acc[day].push(schedule);
      return acc;
    }, {});
    setGroupedSchedules(grouped);
  };

  const handleJoinClass = (schedule: any) => {
    if (schedule.link) {
      window.open(schedule.link, "_blank");
      toast.success(`${schedule.subject} ক্লাসে যোগ দিচ্ছেন...`);
    } else {
      toast.error("ক্লাস লিংক পাওয়া যায়নি");
    }
  };

  const daysOrder = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#F7FAFC]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white py-8">
        <div className="container mx-auto px-4">
          <Button
            onClick={onBackToHome}
            variant="outline"
            className="mb-4 bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            হোমপেজ
          </Button>
          <h1 className="text-4xl mb-2">সম্পূর্ণ ক্লাস সময়সূচী</h1>
          <p className="text-white/90">সপ্তাহের সকল ক্লাসের রুটিন</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {daysOrder.map((day) => {
            const daySchedules = groupedSchedules[day];
            if (!daySchedules || daySchedules.length === 0) return null;

            return (
              <div key={day}>
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-[#285046]" />
                  <h2 className="text-2xl text-[#1A202C]">{day}</h2>
                  <Badge className="bg-[#285046] text-white border-0">
                    {daySchedules.length} টি ক্লাস
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {daySchedules.map((schedule: any) => (
                    <Card
                      key={schedule.id}
                      className="p-6 border-2 hover:border-[#285046] hover:shadow-xl transition-all"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg text-[#1A202C] mb-1">
                              {schedule.subject}
                            </h3>
                            <p className="text-sm text-[#555555]">{schedule.teacher}</p>
                          </div>
                          {schedule.isLive && (
                            <Badge className="bg-red-500 text-white border-0 animate-pulse">
                              LIVE
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[#555555]">
                          <Clock className="w-4 h-4 text-[#285046]" />
                          <span className="text-sm">{schedule.time}</span>
                        </div>

                        {schedule.platform && (
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-[#285046]" />
                            <span className="text-sm text-[#555555]">{schedule.platform}</span>
                          </div>
                        )}

                        <Button
                          onClick={() => handleJoinClass(schedule)}
                          className={`w-full ${
                            schedule.isLive
                              ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                              : "bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]"
                          } text-white rounded-xl`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          {schedule.isLive ? "এখনই যোগ দিন" : "ক্লাস লিংক"}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {Object.keys(groupedSchedules).length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো সময়সূচী পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
