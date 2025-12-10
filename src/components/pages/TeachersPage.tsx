import { useState, useEffect } from "react";
import { ArrowLeft, Search, Star, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { TeacherProfileView } from "../TeacherProfileView";
import { getTeachers, Teacher } from "../../utils/localStorage";

interface TeachersPageProps {
  onBackToHome: () => void;
}

export function TeachersPage({ onBackToHome }: TeachersPageProps) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showProfileView, setShowProfileView] = useState(false);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    filterTeachersData();
  }, [teachers, searchQuery, filterSubject, filterCategory]);

  const loadTeachers = async () => {
    // Force refresh from localStorage
    const localTeachers = await getTeachers();
    setTeachers(localTeachers);
  };

  // Add event listener for real-time updates
  useEffect(() => {
    const handleStorageChange = () => {
      loadTeachers();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('teachers-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teachers-update', handleStorageChange);
    };
  }, []);

  const filterTeachersData = () => {
    let filtered = [...teachers];

    const query = searchQuery.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(
        (teacher) =>
          (teacher.name || "").toLowerCase().includes(query) ||
          (teacher.subject || "").toLowerCase().includes(query) ||
          (teacher.qualification || "").toLowerCase().includes(query)
      );
    }

    if (filterSubject !== "all") {
      filtered = filtered.filter((teacher) => teacher.subject === filterSubject);
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((teacher) => teacher.category === filterCategory);
    }

    setFilteredTeachers(filtered);
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
          <h1 className="text-4xl mb-2">আমাদের শিক্ষকবৃন্দ</h1>
          <p className="text-white/90">দক্ষ ও অভিজ্ঞ শিক্ষকদের সাথে পরিচিত হন</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="p-6 mb-8 shadow-lg border-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="শিক্ষক খুঁজুন (নাম, বিষয় বা যোগ্যতা)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 focus:border-[#285046]"
              />
            </div>

            <Select value={filterSubject} onValueChange={setFilterSubject}>
              <SelectTrigger className="border-2 focus:border-[#285046]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="বিষয় নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">সব বিষয়</SelectItem>
                <SelectItem value="পদার্থ বিজ্ঞান">পদার্থ বিজ্ঞান</SelectItem>
                <SelectItem value="রসায়ন">রসায়ন</SelectItem>
                <SelectItem value="গণিত">গণিত</SelectItem>
                <SelectItem value="ইংরেজি">ইংরেজি</SelectItem>
                <SelectItem value="জীববিজ্ঞান">জীববিজ্ঞান</SelectItem>
                <SelectItem value="বাংলা">বাংলা</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="border-2 focus:border-[#285046]">
                <Filter className="w-4 h-4 mr-2" />
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
        </Card>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTeachers.map((teacher) => (
            <Card
              key={teacher.id}
              className="p-6 rounded-2xl border-2 hover:border-[#285046] hover:shadow-2xl transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4 ring-4 ring-[#F7FAFC] group-hover:ring-[#2F6057] transition-all">
                  <AvatarImage
                    src={teacher.image}
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
                  <span className="text-sm text-[#1A202C]">
                    {teacher.rating || "5.0"}
                  </span>
                </div>

                {teacher.category && (
                  <Badge className="mb-3 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0">
                    {teacher.category}
                  </Badge>
                )}

                <div className="w-full space-y-2 bg-[#F7FAFC] rounded-xl p-4 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#555555]">অভিজ্ঞতা</span>
                    <span className="text-[#1A202C]">{teacher.experience}</span>
                  </div>
                  {teacher.students && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#555555]">শিক্ষার্থী</span>
                      <span className="text-[#1A202C]">{teacher.students}</span>
                    </div>
                  )}
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
          ))}
        </div>

        {filteredTeachers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-[#555555]">কোনো শিক্ষক পাওয়া যায়নি</p>
          </div>
        )}
      </div>

      <TeacherProfileView
        teacher={selectedTeacher}
        open={showProfileView}
        onOpenChange={setShowProfileView}
      />
    </div>
  );
}
