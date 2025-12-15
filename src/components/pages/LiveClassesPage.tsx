import { useState, useEffect } from "react";
import { ArrowLeft, Video, Users, Clock, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { toast } from "sonner";
import { getLiveClasses } from "../../utils/localStorage";

interface LiveClassesPageProps {
  onBackToHome: () => void;
}

export function LiveClassesPage({ onBackToHome }: LiveClassesPageProps) {
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLiveClasses();
  }, []);

  const loadLiveClasses = async () => {
    try {
      setLoading(true);
      const all = await getLiveClasses();
      setLiveClasses(all.filter((c: any) => c.isActive));
      setUpcomingClasses(all.filter((c: any) => !c.isActive));
    } catch (error) {
      console.error("Error loading live classes:", error);
      toast.error("লাইভ ক্লাস লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = (liveClass: any) => {
    if (liveClass.link) {
      window.open(liveClass.link, "_blank");
      toast.success(`${liveClass.title} ক্লাসে যোগ দিচ্ছেন...`);
    } else {
      toast.error("ক্লাস লিংক পাওয়া যায়নি");
    }
  };

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
          <h1 className="text-4xl mb-2">সকল লাইভ ক্লাস</h1>
          <p className="text-white/90">চলমান এবং আগামী লাইভ ক্লাস সমূহ</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Live Now Section */}
        {liveClasses.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <h2 className="text-2xl text-[#1A202C]">এখন লাইভ</h2>
              <Badge className="bg-red-500 text-white border-0 animate-pulse">
                {liveClasses.length} টি ক্লাস
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.map((liveClass) => (
                <Card
                  key={liveClass.id}
                  className="overflow-hidden border-2 border-red-300 hover:border-red-500 hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-red-50 to-red-100">
                    {liveClass.thumbnail ? (
                      <ImageWithFallback
                        src={liveClass.thumbnail}
                        alt={liveClass.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-16 h-16 text-red-300" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm animate-pulse flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full" />
                      LIVE
                    </div>
                    {liveClass.viewers && (
                      <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {liveClass.viewers}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg text-[#1A202C] mb-2 line-clamp-2">
                        {liveClass.title}
                      </h3>
                      <p className="text-sm text-[#555555]">{liveClass.teacher}</p>
                    </div>

                    {liveClass.subject && (
                      <Badge className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0">
                        {liveClass.subject}
                      </Badge>
                    )}

                    <Button
                      onClick={() => handleJoinClass(liveClass)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      এখনই যোগ দিন
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Classes Section */}
        {upcomingClasses.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-[#285046]" />
              <h2 className="text-2xl text-[#1A202C]">আসছে শীঘ্রই</h2>
              <Badge className="bg-[#285046] text-white border-0">
                {upcomingClasses.length} টি ক্লাস
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingClasses.map((liveClass) => (
                <Card
                  key={liveClass.id}
                  className="overflow-hidden border-2 hover:border-[#285046] hover:shadow-2xl transition-all group"
                >
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    {liveClass.thumbnail ? (
                      <ImageWithFallback
                        src={liveClass.thumbnail}
                        alt={liveClass.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Video className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                    {liveClass.startTime && (
                      <div className="absolute top-4 right-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {liveClass.startTime}
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg text-[#1A202C] mb-2 line-clamp-2">
                        {liveClass.title}
                      </h3>
                      <p className="text-sm text-[#555555]">{liveClass.teacher}</p>
                    </div>

                    {liveClass.subject && (
                      <Badge className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0">
                        {liveClass.subject}
                      </Badge>
                    )}

                    <Button
                      onClick={() => handleJoinClass(liveClass)}
                      disabled={!liveClass.link}
                      className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl disabled:opacity-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      বিস্তারিত দেখুন
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {liveClasses.length === 0 && upcomingClasses.length === 0 && (
          <div className="text-center py-20">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো লাইভ ক্লাস পাওয়া যায়নি</p>
          </div>
        )}
      </div>
    </div>
  );
}
