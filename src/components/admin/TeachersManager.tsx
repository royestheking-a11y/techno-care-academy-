import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  UserCircle,
  Plus,
  Edit2,
  Trash2,
  Search,
  GraduationCap,
  Award,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload, compressImage } from "./ImageUpload";
import {
  getTeachers,
  saveTeacher,
  updateTeacher,
  deleteTeacher,
  Teacher
} from "../../utils/localStorage";

export function TeachersManager() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    qualification: "",
    experience: "",
    students: "",
    image: "",
    category: "",
  });

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachers();
  }, [teachers, searchQuery, filterCategory]);

  const loadTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data);
    } catch (error) {
      console.error("Failed to load teachers", error);
    }
  };

  const filterTeachers = () => {
    let filtered = [...teachers];

    if (searchQuery) {
      filtered = filtered.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          teacher.qualification.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((teacher) => teacher.category === filterCategory);
    }

    setFilteredTeachers(filtered);
  };

  const handleAdd = async () => {
    try {
      const nameParts = formData.name.split(' ');
      const initial = nameParts.length > 1
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : nameParts[0].substring(0, 2).toUpperCase();

      // Basic Compression Check
      let finalImage = formData.image;
      if (finalImage && finalImage.length > 500000) { // Check if > ~375KB
        try {
          finalImage = await compressImage(finalImage);
        } catch (compError) {
          console.error("Auto-compression failed", compError);
        }
      }

      const newTeacher: Teacher = {
        id: Date.now(),
        ...formData,
        image: finalImage,
        rating: 5.0, // Default for new
        students: formData.students || "0+",
        initial: initial
      };

      await saveTeacher(newTeacher);

      setTeachers([...teachers, newTeacher]);
      setShowAddModal(false);
      resetForm();
      toast.success("শিক্ষক যোগ করা হয়েছে");
    } catch (error) {
      console.error("Error adding teacher:", error);
      toast.error(`শিক্ষক যোগ করা যায়নি`);
    }
  };

  const handleEdit = async () => {
    try {
      if (!selectedTeacher) return;

      // Basic Compression Check
      let finalImage = formData.image;
      if (finalImage && finalImage.length > 500000) {
        try {
          finalImage = await compressImage(finalImage);
        } catch (compError) {
          console.error("Auto-compression failed", compError);
        }
      }

      const updateData = { ...formData, image: finalImage };

      await updateTeacher(selectedTeacher.id, updateData);

      // Update local state
      setTeachers(teachers.map(t => t.id === selectedTeacher.id ? { ...t, ...updateData } : t));

      setShowEditModal(false);
      setSelectedTeacher(null);
      resetForm();
      toast.success("শিক্ষক তথ্য আপডেট করা হয়েছে");
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error(`তথ্য আপডেট করা যায়নি`);
    }
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    try {
      await deleteTeacher(selectedTeacher.id);
      setTeachers(teachers.filter(t => t.id !== selectedTeacher.id));
      setShowDeleteModal(false);
      setSelectedTeacher(null);
      toast.success("শিক্ষক মুছে ফেলা হয়েছে");
    } catch (error) {
      console.error("Error deleting teacher:", error);
      toast.error("শিক্ষক মুছে ফেলা যায়নি");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subject: "",
      qualification: "",
      experience: "",
      students: "",
      image: "",
      category: "",
    });
  };

  const openEditModal = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      subject: teacher.subject,
      qualification: teacher.qualification,
      experience: teacher.experience,
      students: teacher.students || "",
      image: teacher.image,
      category: teacher.category,
    });
    setShowEditModal(true);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      math: "bg-blue-100 text-blue-700 border-blue-200",
      science: "bg-green-100 text-green-700 border-green-200",
      english: "bg-purple-100 text-purple-700 border-purple-200",
      bengali: "bg-pink-100 text-pink-700 border-pink-200",
      ict: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[category] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <UserCircle className="w-8 h-8 text-[#285046]" />
            শিক্ষক ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">সকল শিক্ষকদের তথ্য দেখুন এবং পরিচালনা করুন</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন শিক্ষক যোগ করুন
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট শিক্ষক</p>
              <p className="text-3xl text-[#1A202C]">{teachers.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">বিভাগ</p>
              <p className="text-3xl text-[#1A202C]">
                {new Set(teachers.map((t) => t.category)).size}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">বিশেষজ্ঞ</p>
              <p className="text-3xl text-[#1A202C]">
                {teachers.filter((t) => parseInt(t.experience) >= 10).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">নতুন</p>
              <p className="text-3xl text-[#1A202C]">
                {teachers.filter((t) => parseInt(t.experience) < 5).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="শিক্ষক খুঁজুন..."
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
                <SelectItem value="math">গণিত</SelectItem>
                <SelectItem value="science">বিজ্ঞান</SelectItem>
                <SelectItem value="english">ইংরেজি</SelectItem>
                <SelectItem value="bengali">বাংলা</SelectItem>
                <SelectItem value="ict">ICT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Teachers Grid */}
      {filteredTeachers.length === 0 ? (
        <Card className="p-12 text-center">
          <UserCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl text-[#1A202C] mb-2">কোনো শিক্ষক পাওয়া যায়নি</h3>
          <p className="text-[#555555]">নতুন শিক্ষক যোগ করুন</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="overflow-hidden transition-all duration-300 border-2 hover:border-[#285046] hover:shadow-lg"
            >
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {teacher.image ? (
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserCircle className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={`${getCategoryBadge(teacher.category)} border`}>
                    {teacher.category}
                  </Badge>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h4 className="text-[#1A202C]">{teacher.name}</h4>
                  <p className="text-sm text-[#555555] mt-1">{teacher.subject}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#555555]">
                    <Award className="w-4 h-4 text-[#285046]" />
                    <span>{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#555555]">
                    <GraduationCap className="w-4 h-4 text-[#285046]" />
                    <span>{teacher.experience} অভিজ্ঞতা</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    onClick={() => openEditModal(teacher)}
                    size="sm"
                    variant="outline"
                    className="flex-1 border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    সম্পাদনা
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTeacher(teacher);
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

      {/* Add/Edit Modal */}
      <Dialog open={showAddModal || showEditModal} onOpenChange={showAddModal ? setShowAddModal : setShowEditModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showAddModal ? <Plus className="w-5 h-5 text-[#285046]" /> : <Edit2 className="w-5 h-5 text-[#285046]" />}
              {showAddModal ? "নতুন শিক্ষক যোগ করুন" : "শিক্ষক সম্পাদনা করুন"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>শিক্ষকের নাম *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="নাম লিখুন"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>বিষয় *</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="বিষয়ের নাম"
                  className="border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>যোগ্যতা *</Label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="যেমন: M.Sc in Mathematics"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>অভিজ্ঞতা *</Label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="যেমন: ১৫+ বছর"
                  className="border-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>শিক্ষার্থী সংখ্যা</Label>
                <Input
                  value={formData.students}
                  onChange={(e) => setFormData({ ...formData, students: e.target.value })}
                  placeholder="যেমন: 450+"
                  className="border-2"
                />
              </div>

              <div className="space-y-2">
                <Label>ক্যাটাগরি *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="border-2">
                    <SelectValue placeholder="ক্যাটাগরি নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">গণিত</SelectItem>
                    <SelectItem value="science">বিজ্ঞান</SelectItem>
                    <SelectItem value="english">ইংরেজি</SelectItem>
                    <SelectItem value="bengali">বাংলা</SelectItem>
                    <SelectItem value="ict">ICT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ImageUpload
              value={formData.image}
              onChange={(url) => setFormData({ ...formData, image: url })}
              label="শিক্ষকের ছবি *"
              placeholder="শিক্ষকের ছবি আপলোড করুন"
              aspectRatio={1}
              maxSize={10}
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
                !formData.name ||
                !formData.subject ||
                !formData.qualification ||
                !formData.experience ||
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

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              নিশ্চিত করুন
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#555555]">
            আপনি কি নিশ্চিত যে এই শিক্ষককে মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।
          </p>
          {selectedTeacher && (
            <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
              <p className="text-sm text-red-900">{selectedTeacher.name}</p>
              <p className="text-xs text-red-700 mt-1">{selectedTeacher.subject}</p>
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
