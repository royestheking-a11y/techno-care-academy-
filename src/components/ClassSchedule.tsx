import { useState, useEffect } from "react";
import { ExternalLink, Calendar, Loader2, ArrowRight, ShieldCheck, AlertCircle, Lock, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { schedulesAPI } from "../utils/api";
import { AllSchedulesDialog } from "./AllSchedulesDialog";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { getUserEnrollments } from "../utils/localStorage";

export function ClassSchedule() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllSchedules, setShowAllSchedules] = useState(false);
  const { user, isAuthenticated, isVerified } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Load user enrollments
  useEffect(() => {
    if (isAuthenticated && user) {
      // Use helper for consistent logic
      getUserEnrollments(user.id).then(userEnrollments => {
        const confirmedEnrollments = userEnrollments
          .filter((e) => e.status === "confirmed")
          .map((e) => Number(e.courseId));
        setEnrolledCourses(confirmedEnrollments);
      });
    }
  }, [user, isAuthenticated]);

  const hasAccess = (courseId: number): boolean => {
    if (!isAuthenticated) return false;
    if (isVerified) return true; // Global access for verified users
    return enrolledCourses.includes(courseId);
  };

  const handleJoinClass = (schedule: any) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (!hasAccess(schedule.courseId)) {
      toast.error("এই ক্লাসে যুক্ত হতে কোর্সটি এনরোল করতে হবে", {
        description: "প্রথমে কোর্সে এনরোল করুন এবং অ্যাডমিন থেকে নিশ্চিতকরণ পান"
      });
      return;
    }

    window.open(schedule.link, '_blank');
  };

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
            courseId: 1
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
            courseId: 2
          },
          // ... add generic courseIds to others
        ]);
      }
    } catch (error) {
      console.warn("Error fetching schedules:", error);
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#285046]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">ক্লাস শিডিউল</h2>
          <p className="text-[#555555] text-lg">সাপ্তাহিক ক্লাসের সময়সূচী</p>
        </div>

        {/* Security Badge - Matching LiveClassSection */}
        {isAuthenticated ? (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-green-900">আপনি লগইন করা আছেন</p>
                <p className="text-xs text-green-700">এনরোল করা ক্লাসে যুক্ত হতে পারবেন</p>
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
                <p className="text-sm text-amber-900">ক্লাস শিডিউল দেখতে লগইন করুন</p>
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

        <Card className="overflow-hidden rounded-2xl border-none shadow-lg">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white">
                <tr>
                  <th className="px-6 py-4 text-left">দিন</th>
                  <th className="px-6 py-4 text-left">বিষয়</th>
                  <th className="px-6 py-4 text-left">শিক্ষক</th>
                  <th className="px-6 py-4 text-left">সময়</th>
                  <th className="px-6 py-4 text-left">প্ল্যাটফর্ম</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((schedule, index) => {
                  const locked = !hasAccess(schedule.courseId);
                  return (
                    <motion.tr
                      key={schedule.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-[#F7FAFC] transition-colors"
                    >
                      <td className="px-6 py-4 text-[#1A202C]">{schedule.day}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[#1A202C]">{schedule.subject}</span>
                          {schedule.isLive && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#555555]">{schedule.teacher}</td>
                      <td className="px-6 py-4 text-[#555555]">{schedule.time}</td>
                      <td className="px-6 py-4">
                        <span className="bg-[#F7FAFC] text-[#285046] px-3 py-1 rounded-full text-sm">
                          {schedule.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button
                          size="sm"
                          onClick={() => handleJoinClass(schedule)}
                          className={`min-w-[120px] ${locked ? "bg-gray-100 text-gray-400 hover:bg-gray-200" : "bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"} rounded-lg`}
                        >
                          {locked ? (
                            <>
                              <Lock className="w-4 h-4 mr-2" />
                              Locked
                            </>
                          ) : (
                            <>
                              Join Now
                              <ExternalLink className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {schedules.map((schedule, index) => {
              const locked = !hasAccess(schedule.courseId);
              return (
                <motion.div
                  key={schedule.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-[#F7FAFC] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg text-[#1A202C]">{schedule.subject}</h3>
                        {schedule.isLive && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#555555]">{schedule.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-3 text-sm text-[#555555]">
                    <span>{schedule.day}</span>
                    <span>•</span>
                    <span>{schedule.time}</span>
                    <span>•</span>
                    <span className="bg-[#F7FAFC] text-[#285046] px-2 py-1 rounded-full text-xs">
                      {schedule.platform}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleJoinClass(schedule)}
                    className={`w-full ${locked ? "bg-gray-100 text-gray-400 hover:bg-gray-200" : "bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"} rounded-lg`}
                  >
                    {locked ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Locked
                      </>
                    ) : (
                      <>
                        Join Now
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                  {locked && isAuthenticated && (
                    <p className="text-xs text-amber-600 text-center pt-2 mt-2 border-t border-gray-50">
                      🔒 কোর্স এনরোল প্রয়োজন
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </Card>

        <div className="text-center mt-10">
          <Button
            onClick={() => window.location.hash = "schedules"}
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all"
          >
            সম্পূর্ণ সময়সূচী দেখুন
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <AllSchedulesDialog open={showAllSchedules} onOpenChange={setShowAllSchedules} />

      {/* Login Prompt Dialog */}
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
                localStorage.setItem("loginRedirect", "schedules");
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