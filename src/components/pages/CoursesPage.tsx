import { useState, useEffect } from "react";
import { ArrowLeft, Search, Play, Clock, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { CourseEnrollmentDialog } from "../CourseEnrollmentDialog";
import { coursesAPI } from "../../utils/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CoursesPageProps {
  onBackToHome: () => void;
}

export function CoursesPage({ onBackToHome }: CoursesPageProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showEnrollment, setShowEnrollment] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, filterCategory]);

  const loadCourses = async () => {
    const response = await coursesAPI.getAll();
    if (response.success) {
      setCourses(response.data);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((course) => course.category === filterCategory);
    }

    setFilteredCourses(filtered);
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
          <h1 className="text-4xl mb-2">সকল কোর্স সমূহ</h1>
          <p className="text-white/90">তোমার পছন্দের কোর্স বেছে নাও</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-lg border-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="কোর্স খুঁজুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 focus:border-[#285046]"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-2 focus:border-[#285046]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                <SelectItem value="Class 9">Class 9</SelectItem>
                <SelectItem value="Class 10">Class 10</SelectItem>
                <SelectItem value="Polytechnic">Polytechnic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden border-2 hover:border-[#285046] hover:shadow-2xl transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 group-hover:bg-[#FFB703] transition-colors">
                  <Play className="w-5 h-5 text-[#285046] group-hover:text-white" />
                </div>
                {course.enrolled && (
                  <div className="absolute bottom-4 left-4 bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                    {course.enrolled} শিক্ষার্থী
                  </div>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl text-[#1A202C] mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-[#555555] line-clamp-2">{course.description}</p>
                </div>

                {course.category && (
                  <Badge className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0">
                    {course.category}
                  </Badge>
                )}

                <div className="flex items-center gap-2 text-[#555555]">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{course.duration}</span>
                </div>

                {course.price && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl text-[#285046]">৳{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳{course.originalPrice}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowEnrollment(true);
                  }}
                  className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl"
                >
                  Enroll Now
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <Play className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-2xl text-[#555555]">কোনো কোর্স পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      <CourseEnrollmentDialog
        open={showEnrollment}
        onOpenChange={setShowEnrollment}
        course={selectedCourse}
      />
    </div>
  );
}
