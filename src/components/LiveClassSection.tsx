import { Video, ExternalLink, ArrowRight, CheckCircle2, ShieldCheck, AlertCircle, Lock } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { AllLiveClassesDialog } from "./AllLiveClassesDialog";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { getUserEnrollments } from "../utils/localStorage";
import { liveClassesAPI } from "../utils/api";

export function LiveClassSection() {
  const { user, isAuthenticated, isVerified } = useAuth();
  const [showAllLiveClasses, setShowAllLiveClasses] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);

  // Load user enrollments
  useEffect(() => {
    if (isAuthenticated && user) {
      // Import these from localStorage utility dynamically
      getUserEnrollments(user.id).then(userEnrollments => {
        const confirmedEnrollments = userEnrollments
          .filter((e) => e.status === "confirmed")
          .map((e) => Number(e.courseId));
        setEnrolledCourses(confirmedEnrollments);
      });
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const response = await liveClassesAPI.getAll();
    if (response.success) {
      // Only show active classes
      const activeClasses = response.data.filter((c: any) => c.isActive);
      setLiveClasses(activeClasses.slice(0, 4)); // Show top 4
    }
  };

  const hasAccess = (courseId: number): boolean => {
    if (!isAuthenticated) return false;
    if (isVerified) return true; // Global access for verified users
    return enrolledCourses.includes(courseId);
  };

  const handleJoinClass = (liveClass: any) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!hasAccess(liveClass.courseId)) {
      toast.error("এই ক্লাসে যুক্ত হতে কোর্সটি এনরোল করতে হবে", {
        description: "প্রথমে কোর্সে এনরোল করুন এবং অ্যাডমিন থেকে নিশ্চিতকরণ পান"
      });
      return;
    }

    // Also check generic verification as safety net
    // if (!isVerified) ... (covered by hasAccess usually, but good to keep in mind)

    window.open(liveClass.meetingLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#F7FAFC] to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-3xl md:text-4xl text-[#1A202C]">লাইভ ক্লাস</h2>
            <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 bg-white rounded-full animate-ping" />
              LIVE
            </span>
          </div>
          <p className="text-[#555555] text-lg">এখনই যুক্ত হও লাইভ ক্লাসে</p>
        </div>

        {/* Security Badge - Matching NotesSection */}
        {isAuthenticated ? (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-900">আপনি লগইন করা আছেন</p>
                <p className="text-xs text-green-700">এনরোল করা কোর্সের লাইভ ক্লাসে যুক্ত হতে পারবেন</p>
              </div>
              <Badge className="bg-green-600 text-white border-0">
                <ShieldCheck className="w-3 h-3 mr-1" />
                নিরাপদ
              </Badge>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-amber-900">লাইভ ক্লাসে যুক্ত হতে লগইন করুন</p>
                <p className="text-xs text-amber-700">শুধুমাত্র এনরোল করা শিক্ষার্থীরা ক্লাস করতে পারবেন</p>
              </div>
              <Button
                onClick={() => setShowLoginPrompt(true)}
                size="sm"
                className="bg-[#285046] hover:bg-[#2F6057] text-white"
              >
                লগইন করুন
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {liveClasses.map((liveClass, index) => {
            const locked = !hasAccess(liveClass.courseId);

            return (
              <motion.div
                key={liveClass.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group relative">
                  {/* Live Indicator */}
                  <div className="absolute top-4 right-4 z-10 bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    LIVE
                  </div>

                  {/* Background with gradient */}
                  <div className="relative h-40 bg-gradient-to-br from-[#285046] via-[#2F6057] to-[#285046] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Video className="w-16 h-16 text-white/80" />
                    <div className="absolute inset-0 bg-black/20" />

                    {/* Lock Overlay */}
                    {locked && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                        <div className="text-center text-white space-y-2">
                          <Lock className="w-8 h-8 mx-auto" />
                          <p className="text-xs font-medium">লক করা</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg text-[#1A202C] mb-2 line-clamp-2">
                      {liveClass.subject}
                    </h3>
                    <p className="text-sm text-[#555555] mb-3">{liveClass.teacher}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-[#555555]">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {liveClass.viewers} watching
                      </div>
                    </div>

                    <Button
                      className={`w-full ${locked ? "bg-gray-400 hover:bg-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"} text-white rounded-xl`}
                      onClick={() => handleJoinClass(liveClass)}
                    >
                      {locked ? (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Locked
                        </>
                      ) : (
                        <>
                          Join Live
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>

                    {locked && isAuthenticated && (
                      <p className="text-xs text-amber-600 text-center pt-2">
                        🔒 বাটনটি আনলক করতে কোর্স এনরোল করুন
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => window.location.hash = "live-classes"}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all"
          >
            সকল লাইভ ক্লাস
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <AllLiveClassesDialog open={showAllLiveClasses} onOpenChange={setShowAllLiveClasses} />

      {/* Login Prompt Dialog - Same as NotesSection */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#285046]" />
              লগইন প্রয়োজন
            </DialogTitle>
            <DialogDescription>
              ক্লাস অ্যাক্সেস করতে আপনার একাউন্টে লগইন করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-[#F7FAFC] rounded-xl space-y-3">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#285046] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A202C]">নিরাপদ এবং সুরক্ষিত</p>
                  <p className="text-xs text-[#555555]">আপনার তথ্য সম্পূর্ণ নিরাপদ থাকবে</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#285046] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#1A202C]">এক্সক্লুসিভ অ্যাক্সেস</p>
                  <p className="text-xs text-[#555555]">শুধুমাত্র এনরোল করা শিক্ষার্থীদের জন্য</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                setShowLoginPrompt(false);
                localStorage.setItem("loginRedirect", "live-classes");
                window.location.hash = "login";
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
            >
              লগইন করুন
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}