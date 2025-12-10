import { BookOpen, Users, Calendar, Video, ShoppingBag, Building, FileText, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../contexts/AuthContext";
import { hasConfirmedEnrollment } from "../utils/enrollment";
import { toast } from "sonner";

export function QuickTabs({ onTabClick }: { onTabClick: (tab: string) => void }) {
  const { user, isVerified } = useAuth();

  const tabs = [
    { icon: BookOpen, label: "Courses", id: "courses", locked: false },
    { icon: Users, label: "Teachers", id: "teachers", locked: false },
    { icon: Calendar, label: "Schedule", id: "schedule", locked: false },
    { icon: Video, label: "Live Class", id: "live", locked: false },
    { icon: ShoppingBag, label: "Books", id: "books", locked: false },
    { icon: FileText, label: "Notes", id: "notes", locked: false },
    { icon: Building, label: "Institutes", id: "institutes", locked: false },
  ];

  const handleTabClick = (tab: typeof tabs[0]) => {
    if (tab.locked) {
      toast.error("এই সেকশন দেখতে আপনাকে কোর্সে এনরোল করতে হবে", {
        description: "কোর্স এনরোল করুন এবং পেমেন্ট কনফার্ম করুন"
      });
      return;
    }
    onTabClick(tab.id);
  };

  return (
    <div className="py-6 sm:py-8 md:py-12 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Scrollable container with custom scrollbar */}
        <div
          className="flex overflow-x-auto gap-3 sm:gap-4 md:gap-6 pb-4 scrollbar-thin scrollbar-thumb-[#285046] scrollbar-track-gray-100 md:justify-center"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'thin',
          }}
        >
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex flex-col items-center gap-2 min-w-[70px] sm:min-w-[80px] md:min-w-[100px] p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#F7FAFC] to-white hover:from-[#285046] hover:to-[#2F6057] transition-all group shadow-sm hover:shadow-lg"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-[#285046] group-hover:bg-white flex items-center justify-center transition-colors">
                <tab.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white group-hover:text-[#285046] transition-colors" />
                {tab.locked && <Lock className="absolute w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-red-500" />}
              </div>
              <span className="text-[10px] sm:text-xs md:text-sm text-[#1A202C] group-hover:text-white transition-colors text-center leading-tight">
                {tab.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}