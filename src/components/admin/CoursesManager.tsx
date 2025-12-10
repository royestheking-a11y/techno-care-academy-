import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
  Users,
  Clock,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";

import {
  Course,
  getCourses,
  saveCourse,
  updateCourse,
  deleteCourse,
} from "../../utils/localStorage";

export function CoursesManager() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    image: "",
    enrolled: "0",
    category: "",
    price: "",
  });

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [courses, searchQuery, filterCategory]);

  const loadCourses = async () => {
    const data = await getCourses();
    setCourses(data);
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

  const handleAdd = async () => {
    const newCourse: Course = {
      id: Date.now(),
      ...formData,
    };

    await saveCourse(newCourse);
    setCourses([...courses, newCourse]);
    setShowAddModal(false);
    resetForm();
    toast.success("কোর্স যোগ করা হয়েছে");
  };

  const handleEdit = async () => {
    if (!selectedCourse) return;

    await updateCourse(selectedCourse.id, formData);

    // Update local state to reflect changes immediately
    const updatedCourses = courses.map((course) =>
      course.id === selectedCourse.id ? { ...course, ...formData } : course
    );
    setCourses(updatedCourses);

    setShowEditModal(false);
    setSelectedCourse(null);
    resetForm();
    toast.success("কোর্স তথ্য আপডেট করা হয়েছে");
  };

  const handleDelete = async () => {
    if (!selectedCourse) return;

    await deleteCourse(selectedCourse.id);

    // Update local state
    const updatedCourses = courses.filter(
      (course) => course.id !== selectedCourse.id
    );
    setCourses(updatedCourses);

    setShowDeleteModal(false);
    setSelectedCourse(null);
    toast.success("কোর্স মুছে ফেলা হয়েছে");
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      image: "",
      enrolled: "0",
      category: "",
      price: "",
    });
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      duration: course.duration,
      image: course.image,
      enrolled: course.enrolled,
      category: course.category,
      price: course.price,
    });
    setShowEditModal(true);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      class9: "bg-blue-100 text-blue-700 border-blue-200",
      class10: "bg-green-100 text-green-700 border-green-200",
      polytechnic: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-[#285046]" />
            কোর্স ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">সকল কোর্স দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন কোর্স যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট কোর্স</p>
              <p className="text-3xl text-[#1A202C]">{courses.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট শিক্ষার্থী</p>
              <p className="text-3xl text-[#1A202C]">
                {courses.reduce(
                  (sum, c) =>
                    sum +
                    parseInt((c.enrolled || "0").toString().replace("+", ""), 10),
                  0
                )}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Class 9</p>
              <p className="text-3xl text-[#1A202C]">
                {courses.filter((c) => c.category === "class9").length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Class 10</p>
              <p className="text-3xl text-[#1A202C]">
                {courses.filter((c) => c.category === "class10").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
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

          <div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-2 focus:border-[#285046]">
                <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব ক্যাটাগরি</SelectItem>
                <SelectItem value="class9">Class 9</SelectItem>
                <SelectItem value="class10">Class 10</SelectItem>
                <SelectItem value="polytechnic">Polytechnic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {filteredCourses.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-[#1A202C] mb-2">কোনো কোর্স পাওয়া যায়নি</h3>
          <p className="text-[#555555]">নতুন কোর্স যোগ করুন</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden transition-all duration-300 border-2 hover:border-[#285046] hover:shadow-lg"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {course.image ? (
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <GraduationCap className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={`${getCategoryBadge(course.category)} border`}>
                    {course.category === "class9"
                      ? "Class 9"
                      : course.category === "class10"
                        ? "Class 10"
                        : "Polytechnic"}
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                  {course.enrolled}+ শিক্ষার্থী
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h4 className="text-[#1A202C] line-clamp-2">{course.title}</h4>
                  <p className="text-sm text-[#555555] mt-1 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Clock className="w-4 h-4 text-[#285046]" />
                    <span>{course.duration}</span>
                  </div>
                  {course.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl text-[#285046]">৳{course.price}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={() => openEditModal(course)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    সম্পাদনা
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDeleteModal(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={showAddModal || showEditModal}
        onOpenChange={showAddModal ? setShowAddModal : setShowEditModal}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" aria-describedby="course-form-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#285046]" />
              {showEditModal ? "কোর্স এডিট করুন" : "নতুন কোর্স যোগ করুন"}
            </DialogTitle>
            <DialogDescription id="course-form-description">
              কোর্সের বিস্তারিত তথ্য প্রদান করুন
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>কোর্সের নাম *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="কোর্সের নাম লিখুন"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <Label>বিবরণ *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="কোর্সের বিবরণ লিখুন"
                className="border-2 min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>সময়কাল *</Label>
                <Input
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  placeholder="যেমন: ১২ মাস"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>মূল্য *</Label>
                <Input
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  placeholder="৳ মূল্য"
                  className="border-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ক্যাটাগরি *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class9">Class 9</SelectItem>
                  <SelectItem value="class10">Class 10</SelectItem>
                  <SelectItem value="polytechnic">Polytechnic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="কোর্সের ছবি *"
              placeholder="কোর্সের ছবি আপলোড করুন"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
            >
              বাতিল
            </Button>
            <Button
              onClick={showAddModal ? handleAdd : handleEdit}
              disabled={
                !formData.title ||
                !formData.description ||
                !formData.duration ||
                !formData.category ||
                !formData.image
              }
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
            >
              {showAddModal ? (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  যোগ করুন
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  আপডেট করুন
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              নিশ্চিত করুন
            </DialogTitle>
            <DialogDescription>
              আপনি কি নিশ্চিত যে এই কোর্সটি মুছে ফেলতে চান?
            </DialogDescription>
          </DialogHeader>
          <p className="text-[#555555]">
            এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
          {selectedCourse && (
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-900">{selectedCourse.title}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}