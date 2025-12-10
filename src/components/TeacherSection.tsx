import { Star, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { AllTeachersDialog } from "./AllTeachersDialog";
import { TeacherProfileView } from "./TeacherProfileView";
import { getTeachers, Teacher } from "../utils/localStorage";
import { getOptimizedImageUrl, isCloudinaryUrl } from "../utils/cloudinary";
// LanguageContext removed
const teacher1 = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400";
const teacher2 = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400";
const teacher3 = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400";
const teacher4 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400";
const teacher5 = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400";
const teacher6 = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400";

export function TeacherSection() {
  // const { t } = useLanguage();
  const [showAllTeachers, setShowAllTeachers] = useState(false);
  const [showProfileView, setShowProfileView] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      // Retrieve from localStorage directly
      // In a real app we might still use an API, but for this requirement we use localStorage
      const localTeachers = await getTeachers();
      setTeachers(localTeachers.slice(0, 6));
    } catch (error) {
      console.warn("Error fetching teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      fetchTeachers();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('teachers-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teachers-update', handleStorageChange);
    };
  }, []);

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
          <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">আমাদের শিক্ষকবৃন্দ</h2>
          <p className="text-[#555555] text-lg">অভিজ্ঞ এবং নিবেদিতপ্রাণ শিক্ষকদের সাথে শিখুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group hover:border-2 hover:border-[#2F6057]">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 ring-4 ring-[#285046] mb-4">
                    <AvatarImage
                      src={isCloudinaryUrl(teacher.image)
                        ? getOptimizedImageUrl(teacher.image, { width: 200, height: 200, quality: 'auto', format: 'auto' })
                        : teacher.image}
                      alt={teacher.name}
                      className="rounded-full"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#285046] to-[#2F6057] text-white text-2xl">
                      {teacher.initial}
                    </AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl text-[#1A202C] mb-1">{teacher.name}</h3>
                  <p className="text-[#2F6057] mb-2">{teacher.subject}</p>

                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-4 h-4 fill-[#FFB703] text-[#FFB703]" />
                    <span className="text-sm text-[#1A202C]">{teacher.rating}</span>
                  </div>

                  <div className="w-full space-y-2 bg-[#F7FAFC] rounded-xl p-4 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#555555]">অভিজ্ঞতা</span>
                      <span className="text-[#1A202C]">{teacher.experience}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#555555]">শিক্ষার্থী</span>
                      <span className="text-[#1A202C]">{teacher.students}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedTeacher(teacher);
                      setShowProfileView(true);
                    }}
                    className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl"
                  >
                    প্রোফাইল দেখুন
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white px-8 py-6 rounded-full hover:shadow-xl transition-all text-lg"
            onClick={() => window.location.hash = "teachers"}
          >
            সকল শিক্ষক দেখুন
          </Button>
        </div>

        <AllTeachersDialog
          open={showAllTeachers}
          onOpenChange={setShowAllTeachers}
        />

        <TeacherProfileView
          teacher={selectedTeacher}
          open={showProfileView}
          onOpenChange={setShowProfileView}
        />
      </div>
    </section>
  );
}