import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import {
  Video,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Users,
  Play,
  Share2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { ImageUpload } from "./ImageUpload";
import {
  getLiveClasses,
  saveLiveClass,
  updateLiveClass,
  deleteLiveClass,
  LiveClass
} from "../../utils/localStorage";

export function LiveClassesManager() {
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<LiveClass | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    subject: "",
    category: "class9",
    date: "",
    time: "",
    duration: "45 min",
    meetingLink: "",
    thumbnail: "",
    maxStudents: "100", // Input as string, convert to number
    isActive: true,
  });

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      setLoading(true);
      const data = await getLiveClasses();
      setClasses(data);
    } catch (error) {
      console.error("Error loading live classes:", error);
      toast.error("লাইভ ক্লাস লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    try {
      if (!formData.title || !formData.date || !formData.time || !formData.meetingLink) {
        toast.error("আবশ্যক তথ্য পূরণ করুন");
        return;
      }

      await saveLiveClass({
        ...formData,
        id: Date.now().toString(),
        maxStudents: parseInt(formData.maxStudents) || 100,
        enrolledStudents: 0,
        createdAt: new Date().toISOString(),
        category: formData.category as "class9" | "class10" | "polytechnic"
      });

      toast.success("লাইভ ক্লাস নির্ধারিত হয়েছে");
      setShowAddModal(false);
      resetForm();
      loadClasses();
    } catch (error) {
      console.error("Error creating live class:", error);
      toast.error("ক্লাস তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const handleEdit = async () => {
    if (!selectedClass) return;

    try {
      await updateLiveClass(selectedClass.id, {
        ...formData,
        maxStudents: parseInt(formData.maxStudents) || 100,
        category: formData.category as "class9" | "class10" | "polytechnic"
      });

      toast.success("লাইভ ক্লাস আপডেট করা হয়েছে");
      setShowEditModal(false);
      setSelectedClass(null);
      resetForm();
      loadClasses();
    } catch (error) {
      console.error("Error updating live class:", error);
      toast.error("ক্লাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleDelete = async () => {
    if (!selectedClass) return;

    try {
      await deleteLiveClass(selectedClass.id);
      toast.success("লাইভ ক্লাস বাতিল করা হয়েছে");
      setShowDeleteModal(false);
      setSelectedClass(null);
      loadClasses();
    } catch (error) {
      console.error("Error deleting live class:", error);
      toast.error("ক্লাস মুছতে সমস্যা হয়েছে");
    }
  };

  const handleStatusToggle = async (cls: LiveClass) => {
    try {
      await updateLiveClass(cls.id, { isActive: !cls.isActive });
      toast.success("ক্লাসের স্ট্যাটাস পরিবর্তন করা হয়েছে");
      loadClasses();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: "",
      subject: "",
      category: "class9",
      date: "",
      time: "",
      duration: "45 min",
      meetingLink: "",
      thumbnail: "",
      maxStudents: "100",
      isActive: true,
    });
  };

  const openEditModal = (cls: LiveClass) => {
    setSelectedClass(cls);
    setFormData({
      title: cls.title,
      description: cls.description,
      instructor: cls.instructor,
      subject: cls.subject,
      category: cls.category,
      date: cls.date,
      time: cls.time,
      duration: cls.duration,
      meetingLink: cls.meetingLink,
      thumbnail: cls.thumbnail || "",
      maxStudents: cls.maxStudents.toString(),
      isActive: cls.isActive,
    });
    setShowEditModal(true);
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("bn-BD", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex bg-gray-50 items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <Video className="w-8 h-8 text-[#285046]" />
            লাইভ ক্লাস ব্যবস্থাপনা
          </h2>
          <p className="text-[#555555] mt-1">
            শিডিউল ক্লাস নিয়ন্ত্রণ এবং মনিটরিং
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন ক্লাস শিডিউল
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট ক্লাস</p>
              <p className="text-3xl text-[#1A202C]">{classes.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">আজকের ক্লাস</p>
              <p className="text-3xl text-[#1A202C]">
                {classes.filter(c => {
                  const today = new Date().toISOString().split('T')[0];
                  return c.date === today;
                }).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">সক্রিয় ক্লাস</p>
              <p className="text-3xl text-[#1A202C]">
                {classes.filter(c => c.isActive).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {classes.length === 0 ? (
          <Card className="p-12 text-center">
            <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl text-[#1A202C] mb-2">কোনো লাইভ ক্লাস নেই</h3>
            <p className="text-[#555555]">নতুন ক্লাস শিডিউল করুন</p>
          </Card>
        ) : (
          classes.map((cls) => (
            <Card
              key={cls.id}
              className={`overflow-hidden transition-all duration-300 border-2 ${cls.isActive ? "border-green-100" : "border-red-100 opacity-75"
                }`}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto bg-gray-100 relative">
                  {cls.thumbnail ? (
                    <img
                      src={cls.thumbnail}
                      alt={cls.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <Video className="w-12 h-12" />
                    </div>
                  )}
                  {cls.isActive && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-red-500 animate-pulse text-white border-0">
                        LIVE
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 p-2 text-white text-xs text-center backdrop-blur-sm">
                    {formatDisplayDate(cls.date)} • {cls.time}
                  </div>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {cls.category === "class9" ? "নবম শ্রেণী" : cls.category === "class10" ? "দশম শ্রেণী" : "পলিটেকনিক"} ({cls.subject})
                        </Badge>
                        <h3 className="text-xl font-bold text-[#1A202C]">
                          {cls.title}
                        </h3>
                        <p className="text-[#285046] font-medium mt-1">
                          প্রশিক্ষক: {cls.instructor}
                        </p>
                      </div>
                    </div>

                    <p className="text-[#555555] text-sm line-clamp-2 mb-4">
                      {cls.description}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-[#285046]" />
                        {cls.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-[#285046]" />
                        {cls.enrolledStudents} / {cls.maxStudents} স্লট
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t gap-4">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`active-${cls.id}`} className="text-sm cursor-pointer">
                        ক্লাস স্ট্যাটাস
                      </Label>
                      <Switch
                        id={`active-${cls.id}`}
                        checked={cls.isActive}
                        onCheckedChange={() => handleStatusToggle(cls)}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-[#285046]"
                        onClick={() => window.open(cls.meetingLink, '_blank')}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        জয়েন
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => null} // Copy link or share
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-8 bg-gray-200 mx-2"></div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(cls)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedClass(cls);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog
        open={showAddModal || showEditModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddModal(false);
            setShowEditModal(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {showAddModal ? (
                <>
                  <Plus className="w-5 h-5 text-[#285046]" />
                  নতুন লাইভ ক্লাস
                </>
              ) : (
                <>
                  <Edit2 className="w-5 h-5 text-[#285046]" />
                  ক্লাস সম্পাদনা
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>ক্লাসের শিরোনাম *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: পদার্থ বিজ্ঞান - অধ্যায় ৫"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>বিষয় *</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="যেমন: Physics"
                  />
                </div>
                <div className="space-y-2">
                  <Label>প্রশিক্ষক</Label>
                  <Input
                    value={formData.instructor}
                    onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                    placeholder="শিক্ষকের নাম"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>বিভাগ</Label>
                <select
                  className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="class9">নবম শ্রেণী</option>
                  <option value="class10">দশম শ্রেণী</option>
                  <option value="polytechnic">পলিটেকনিক</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>বিবরণ</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ক্লাস সম্পর্কে বিস্তারিত..."
                  className="h-32"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>তারিখ *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>সময় *</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label>সময়কাল</Label>
                  <Input
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="45 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label>সর্বোচ্চ ছাত্র</Label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>মিটিং লিংক *</Label>
                <Input
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  placeholder="Zoom / Google Meet Link"
                />
              </div>

              <ImageUpload
                value={formData.thumbnail}
                onChange={(url) => setFormData({ ...formData, thumbnail: url })}
                label="থাম্বনেইল"
                placeholder="ক্লাসের বা শিক্ষকের ছবি"
              />

              <div className="flex items-center gap-2 pt-2">
                <Switch
                  id="modal-active"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="modal-active">ক্লাসটি কি সক্রিয়?</Label>
              </div>
            </div>
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
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
              disabled={!formData.title || !formData.date || !formData.meetingLink}
            >
              {showAddModal ? "শিডিউল করুন" : "আপডেট করুন"}
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
            আপনি কি নিশ্চিত যে এই লাইভ ক্লাসটি বাতিল/মুছে ফেলতে চান?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              বাতিল
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              মুছে ফেলুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}