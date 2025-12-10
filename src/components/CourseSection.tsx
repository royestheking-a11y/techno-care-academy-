import { Play, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { AllCoursesDialog } from "./AllCoursesDialog";
import { CourseEnrollmentDialog } from "./CourseEnrollmentDialog";
import { coursesAPI } from "../utils/api";
const sscCourseImg = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800";
const mathBookImg = "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800";
const polytechnicImg = "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800";

export function CourseSection() {
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await coursesAPI.getAll();
      if (response.success && response.data.length > 0) {
        // Take first 4 courses for homepage display
        setCourses(response.data.slice(0, 4));
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.warn("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setLoading(false);
    }

  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[#F7FAFC]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#285046]" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">সকল কোর্স সমূহ</h2>
          <p className="text-[#555555] text-lg">তোমার পছন্দের কোর্স বেছে নাও</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
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
                <div className="p-6">
                  <h3 className="text-xl text-[#1A202C] mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-[#555555] mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[#555555]">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <Button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEnrollment(true);
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl flex-shrink-0"
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => window.location.hash = "courses"}
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all"
          >
            সব কোর্স দেখুন
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      <AllCoursesDialog open={showAllCourses} onOpenChange={setShowAllCourses} />
      <CourseEnrollmentDialog
        open={showEnrollment}
        onOpenChange={setShowEnrollment}
        course={selectedCourse}
      />
    </section>
  );
}