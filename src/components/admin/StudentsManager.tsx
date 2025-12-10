import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../ui/dialog";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { studentsAPI } from "../../utils/api";

interface Student {
  id: number;
  name: string;
  result: string;
  achievement: string;
  year: string;
  initial: string;
  image: string;
}

export function StudentsManager() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    result: "",
    achievement: "",
    year: "",
    initial: "",
    image: ""
  });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      if (response.success) {
        setStudents(response.data);
      } else {
        toast.error("Failed to fetch students");
      }
    } catch (error) {
      console.error("Error loading students:", error);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultStudents = async () => {
    try {
      const defaultStudents: Omit<Student, "id">[] = [
        {
          name: "সাকিব আল হাসান",
          result: "GPA 5.00",
          achievement: "পলিটেকনিক ভর্তি পরীক্ষায় ১ম স্থান",
          year: "২০২৪",
          initial: "SA",
          image: "https://images.unsplash.com/photo-1606660956148-5291deb68185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2VzcyUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzYxODA5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          name: "তাসনিম জাহান",
          result: "GPA 5.00",
          achievement: "SSC পরীক্ষায় সকল বিষয়ে A+",
          year: "২০২৪",
          initial: "TJ",
          image: "https://images.unsplash.com/photo-1606660956148-5291deb68185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2VzcyUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzYxODA5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          name: "রাফি ইসলাম",
          result: "GPA 5.00",
          achievement: "গণিত অলিম্পিয়াডে স্বর্ণপদক",
          year: "২০২৪",
          initial: "RI",
          image: "https://images.unsplash.com/photo-1606660956148-5291deb68185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2VzcyUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzYxODA5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        {
          name: "নাফিসা খান",
          result: "GPA 5.00",
          achievement: "বিজ্ঞান মেলায় ১ম পুরস্কার",
          year: "২০২৩",
          initial: "NK",
          image: "https://images.unsplash.com/photo-1606660956148-5291deb68185?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwc3VjY2VzcyUyMGdyYWR1YXRpb258ZW58MXx8fHwxNzYxODA5NzAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
      ];
      
      for (const student of defaultStudents) {
        await studentsAPI.create(student);
      }
      loadStudents();
    } catch (error) {
      console.error("Error initializing students:", error);
    }
  };

  const handleAdd = () => {
    setEditingStudent(null);
    setFormData({
      name: "",
      result: "",
      achievement: "",
      year: "",
      initial: "",
      image: ""
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      result: student.result,
      achievement: student.achievement,
      year: student.year,
      initial: student.initial,
      image: student.image
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("আপনি কি নিশ্চিত এই শিক্ষার্থীকে মুছে ফেলতে চান?")) {
      try {
        const response = await studentsAPI.delete(id);
        if (response.success) {
          toast.success("শিক্ষার্থী সফলভাবে মুছে ফেলা হয়েছে!");
          loadStudents();
        } else {
          toast.error(response.error || "Failed to delete student");
        }
      } catch (error) {
        console.error("Error deleting student:", error);
        toast.error("Failed to delete student");
      }
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.result || !formData.achievement || !formData.year || !formData.initial) {
      toast.error("সকল ফিল্ড পূরণ করুন!");
      return;
    }

    try {
      if (editingStudent) {
        const response = await studentsAPI.update(editingStudent.id, formData);
        if (response.success) {
          toast.success("শিক্ষার্থীর তথ্য আপডেট হয়েছে!");
          setIsDialogOpen(false);
          loadStudents();
        } else {
          toast.error(response.error || "Failed to update student");
        }
      } else {
        const response = await studentsAPI.create(formData);
        if (response.success) {
          toast.success("নতুন শিক্ষার্থী যুক্ত হয়েছে!");
          setIsDialogOpen(false);
          loadStudents();
        } else {
          toast.error(response.error || "Failed to create student");
        }
      }
    } catch (error) {
      console.error("Error saving student:", error);
      toast.error("Failed to save student");
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.achievement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl text-[#1A202C] mb-2">শিক্ষার্থী ব্যবস্থাপনা</h2>
          <p className="text-[#555555]">সফল শিক্ষার্থীদের তথ্য যুক্ত, সম্পাদনা এবং মুছে ফেলুন</p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          নতুন শিক্ষার্থী যুক্ত করুন
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="শিক্ষার্থী খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="p-6 border-none shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16 ring-4 ring-[#285046]">
                <AvatarImage src={student.image} alt={student.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
                  {student.initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg text-[#1A202C] mb-1">{student.name}</h3>
                <p className="text-[#285046]">{student.result}</p>
              </div>
              <div className="bg-[#285046] text-white px-3 py-1 rounded-full text-sm">
                {student.year}
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] rounded-xl p-3 mb-4">
              <p className="text-white text-sm text-center">{student.achievement}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(student)}
                variant="outline"
                size="sm"
                className="flex-1 text-[#285046] border-[#285046]"
              >
                <Edit className="w-4 h-4 mr-1" />
                সম্পাদনা
              </Button>
              <Button
                onClick={() => handleDelete(student.id)}
                variant="outline"
                size="sm"
                className="flex-1 text-red-600 border-red-600"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                মুছুন
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#555555] text-lg">কোন শিক্ষার্থী পাওয়া যায়নি</p>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStudent ? "শিক্ষার্থীর তথ্য সম্পাদনা করুন" : "নতুন শিক্ষার্থী যুক্ত করুন"}
            </DialogTitle>
            <DialogDescription>
              {editingStudent ? "শিক্ষার্থীর তথ্য আপডেট করুন" : "নতুন শিক্ষার্থীর তথ্য পূরণ করুন"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>নাম *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="শিক্ষার্থীর নাম"
              />
            </div>
            <div>
              <Label>ফলাফল *</Label>
              <Input
                value={formData.result}
                onChange={(e) => setFormData({ ...formData, result: e.target.value })}
                placeholder="উদাহরণ: GPA 5.00"
              />
            </div>
            <div>
              <Label>অর্জন *</Label>
              <Input
                value={formData.achievement}
                onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                placeholder="উদাহরণ: পলিটেকনিক ভর্তি পরীক্ষায় ১ম স্থান"
              />
            </div>
            <div>
              <Label>বছর *</Label>
              <Input
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="উদাহরণ: ২০২৪"
              />
            </div>
            <div>
              <Label>ইনিশিয়াল *</Label>
              <Input
                value={formData.initial}
                onChange={(e) => setFormData({ ...formData, initial: e.target.value })}
                placeholder="উদাহরণ: SA"
                maxLength={3}
              />
            </div>
            <div>
              <Label>ছবির URL</Label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="ছবির লিংক যুক্ত করুন"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              বাতিল
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-[#285046] to-[#2F6057]"
            >
              সংরক্ষণ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}