import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  FileText,
  ShoppingBag,
  Calendar,
  Edit2,
  Save,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  GraduationCap,
  Home,
  Camera,
  Upload,
  Download,
  Eye,
  Trash2,
  BookmarkCheck,
  Sparkles,
  Award,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { ReviewsSection } from "./ReviewsSection";
import { useAuth } from "../contexts/AuthContext";
import {
  getUserEnrollments,
  getUserOrders,
  getUserSavedNotes,
  removeSavedNote,
  type Enrollment,
  type Order,
  type SavedNote,
} from "../utils/localStorage";
import { toast } from "sonner";
import { motion } from "motion/react";

interface UserDashboardProps {
  onBackToHome: () => void;
}

export function UserDashboard({ onBackToHome }: UserDashboardProps) {
  const { user, isAuthenticated, updateProfile, isVerified } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");
  const [editedPhone, setEditedPhone] = useState(user?.phone || "");
  const [editedBio, setEditedBio] = useState(user?.bio || "");
  const [previewImage, setPreviewImage] = useState<string>(user?.profilePicture || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (isAuthenticated && user) {
        // Load user's enrollments
        const userEnrollments = await getUserEnrollments(user.id);
        setEnrollments(userEnrollments);

        // Load user's orders
        const userOrders = await getUserOrders(user.id);
        setOrders(userOrders);

        // Load user's saved notes
        const userSavedNotes = await getUserSavedNotes(user.id);
        setSavedNotes(userSavedNotes);
      }
    };
    loadUserData();
  }, [user, isAuthenticated]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("ফাইল সাইজ ৫MB এর বেশি হতে পারবে না");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast.error("শুধুমাত্র ছবি আপলোড করা যাবে");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        updateProfile({ profilePicture: result });
        toast.success("প্রোফাইল ছবি আপডেট হয়েছে");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!user) return;

    updateProfile({
      name: editedName,
      phone: editedPhone,
      bio: editedBio,
    });

    toast.success("প্রোফাইল আপডেট হয়েছে");
    setIsEditing(false);
  };

  const handleRemoveSavedNote = async (noteId: string) => {
    await removeSavedNote(noteId);
    setSavedNotes(savedNotes.filter(n => n.id !== noteId));
    toast.success("নোট মুছে ফেলা হয়েছে");
  };

  const handleDownloadNote = (note: SavedNote) => {
    toast.success("ডাউনলোড শুরু হয়েছে", {
      description: note.noteTitle
    });
    console.log("Downloading:", note.fileUrl);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0"><CheckCircle2 className="w-3 h-3 mr-1" />নিশ্চিত</Badge>;
      case "pending":
        return <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0"><Clock className="w-3 h-3 mr-1" />অপেক্ষমান</Badge>;
      case "cancelled":
      case "rejected":
        return <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0"><AlertCircle className="w-3 h-3 mr-1" />বাতিল</Badge>;
      default:
        return <Badge className="bg-gray-500 text-white">{status}</Badge>;
    }
  };

  const getFileTypeBadge = (fileType: string) => {
    const colors = {
      pdf: "bg-red-100 text-red-700 border-red-200",
      image: "bg-blue-100 text-blue-700 border-blue-200",
      pptx: "bg-orange-100 text-orange-700 border-orange-200"
    };
    return colors[fileType as keyof typeof colors] || "bg-gray-100 text-gray-700";
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-8 text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-[#285046] mx-auto mb-4" />
            <h2 className="text-2xl text-[#1A202C] mb-2">লগইন প্রয়োজন</h2>
            <p className="text-[#555555] mb-4">ড্যাশবোর্ড দেখতে লগইন করুন</p>
            <Button onClick={onBackToHome} className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]">
              হোমে ফিরে যান
            </Button>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FAFC] via-white to-[#F7FAFC]">
      {/* Premium Header with Gradient */}
      <div className="relative bg-gradient-to-r from-[#285046] via-[#2F6057] to-[#285046] text-white py-8 sm:py-12 shadow-2xl overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={onBackToHome}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-sm"
            >
              <Home className="w-4 h-4 mr-2" />
              হোম
            </Button>
            {isVerified && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 px-4 py-1.5">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                ভেরিফাইড শিক্ষার্থী
              </Badge>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Picture with Upload */}
            <div className="relative group">
              <Avatar className="w-28 h-28 ring-4 ring-white/50 shadow-2xl">
                <AvatarImage src={previewImage || user.profilePicture || ""} />
                <AvatarFallback className="bg-gradient-to-br from-[#FFB703] to-yellow-500 text-white text-3xl">
                  {user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-3xl mb-2 flex items-center justify-center sm:justify-start gap-2">
                {user.name}
                <CheckCircle2 className={`w-6 h-6 ${isVerified ? "text-green-500" : "text-[#FFB703]"}`} />
              </h2>
              <p className="text-white/90 mb-1 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
              <p className="text-white/90 flex items-center justify-center sm:justify-start gap-2">
                <Phone className="w-4 h-4" />
                {user.phone}
              </p>
              {user.bio && (
                <p className="text-white/80 text-sm mt-2 max-w-md">{user.bio}</p>
              )}
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center border border-white/20">
                <Award className="w-6 h-6 mx-auto mb-1 text-[#FFB703]" />
                <p className="text-xs sm:text-sm opacity-90">মোট কোর্স</p>
                <p className="text-2xl sm:text-3xl">{enrollments.filter(e => e.status === "confirmed").length}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3 sm:py-4 text-center border border-white/20">
                <BookmarkCheck className="w-6 h-6 mx-auto mb-1 text-[#FFB703]" />
                <p className="text-xs sm:text-sm opacity-90">সেভ নোট</p>
                <p className="text-2xl sm:text-3xl">{savedNotes.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">নিশ্চিত এনরোলমেন্ট</p>
                  <p className="text-3xl text-[#1A202C]">{enrollments.filter(e => e.status === "confirmed").length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-2xl">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">অপেক্ষমান</p>
                  <p className="text-3xl text-[#1A202C]">{enrollments.filter(e => e.status === "pending").length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">মোট অর্ডার</p>
                  <p className="text-3xl text-[#1A202C]">{orders.length}</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">অগ্রগতি</p>
                  <p className="text-3xl text-[#1A202C]">
                    {enrollments.length > 0 ? Math.round((enrollments.filter(e => e.status === "confirmed").length / enrollments.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="enrollments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto h-auto p-1 bg-gradient-to-r from-[#285046]/10 to-[#2F6057]/10 backdrop-blur-sm">
            <TabsTrigger value="enrollments" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#285046] data-[state=active]:to-[#2F6057] data-[state=active]:text-white py-3">
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">আমার কোর্স</span>
              <span className="sm:hidden">কোর্স</span>
            </TabsTrigger>
            <TabsTrigger value="notes" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#285046] data-[state=active]:to-[#2F6057] data-[state=active]:text-white py-3">
              <BookmarkCheck className="w-4 h-4" />
              <span className="hidden sm:inline">সেভড নোট</span>
              <span className="sm:hidden">নোট</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#285046] data-[state=active]:to-[#2F6057] data-[state=active]:text-white py-3">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">অর্ডার</span>
              <span className="sm:hidden">অর্ডার</span>
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#285046] data-[state=active]:to-[#2F6057] data-[state=active]:text-white py-3">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">রিভিউ</span>
              <span className="sm:hidden">রিভিউ</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#285046] data-[state=active]:to-[#2F6057] data-[state=active]:text-white py-3">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">প্রোফাইল</span>
              <span className="sm:hidden">প্রোফাইল</span>
            </TabsTrigger>
          </TabsList>

          {/* Enrollments Tab */}
          <TabsContent value="enrollments" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl text-[#1A202C] flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[#285046]" />
                আমার কোর্স সমূহ
              </h3>
            </div>
            {enrollments.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-2 border-dashed">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-[#1A202C] mb-2">কোনো কোর্স নেই</h3>
                <p className="text-[#555555] mb-4">আপনি এখনও কোনো কোর্সে ভর্তি হননি</p>
                <Button onClick={onBackToHome} className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]">
                  কোর্স দেখুন
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enrollments.map((enrollment) => (
                  <motion.div
                    key={enrollment.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-[#285046]/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg text-[#1A202C] mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#285046]" />
                            {enrollment.courseName || enrollment.courseTitle}
                          </h4>
                          <div className="space-y-2 text-sm text-[#555555]">
                            <p className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              সময়কাল: {enrollment.courseDuration || "N/A"}
                            </p>
                            <p className="flex items-center gap-2 text-[#285046] font-semibold">
                              <ShoppingBag className="w-4 h-4" />
                              কোর্স ফি: {enrollment.coursePrice ? `৳${enrollment.coursePrice}` : "N/A"}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(enrollment.status)}
                      </div>
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#555555]">
                          <Calendar className="w-4 h-4" />
                          <span>আবেদন: {new Date(enrollment.createdAt).toLocaleDateString('bn-BD')}</span>
                        </div>
                        {enrollment.status === "pending" && (
                          <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                            <Clock className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-yellow-800">
                              আপনার আবেদন পর্যালোচনা করা হচ্ছে। শীঘ্রই অ্যাডমিন নিশ্চিত করবে।
                            </p>
                          </div>
                        )}
                        {enrollment.status === "confirmed" && (
                          <div className="space-y-3">
                            <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-green-800">
                                আপনার কোর্স একটিভ! এখন সকল ক্লাস অ্যাক্সেস করতে পারবেন।
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full text-[#285046] border-[#285046]"
                                onClick={() => {
                                  onBackToHome();
                                  setTimeout(() => window.location.href = "#live-classes", 100);
                                }}
                              >
                                লাইভ ক্লাস
                              </Button>
                              <Button
                                size="sm"
                                className="w-full bg-[#285046] hover:bg-[#2F6057]"
                                onClick={() => {
                                  onBackToHome();
                                  setTimeout(() => window.location.href = "#notes", 100);
                                }}
                              >
                                নোটস
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Notes Tab */}
          <TabsContent value="notes" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl text-[#1A202C] flex items-center gap-2">
                <BookmarkCheck className="w-6 h-6 text-[#285046]" />
                সেভড নোট সমূহ
              </h3>
              <Badge className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white border-0">
                {savedNotes.length} টি নোট
              </Badge>
            </div>
            {savedNotes.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-2 border-dashed">
                <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-[#1A202C] mb-2">কোনো সেভড নোট নেই</h3>
                <p className="text-[#555555] mb-4">আপনি এখনও কোনো নোট সেভ করেননি</p>
                <Button onClick={onBackToHome} className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]">
                  নোট দেখুন
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-[#285046]/30">
                      {/* Thumbnail */}
                      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                        {note.thumbnail ? (
                          <img
                            src={note.thumbnail}
                            alt={note.noteTitle}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <Badge className={`${getFileTypeBadge(note.fileType)} border uppercase text-xs`}>
                            {note.fileType}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div className="space-y-1">
                          <h4 className="text-[#1A202C] line-clamp-2 group-hover:text-[#285046] transition-colors">
                            {note.noteTitle}
                          </h4>
                          <p className="text-sm text-[#555555] line-clamp-2">
                            {note.noteDescription}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-[#555555]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>সেভ করা: {new Date(note.savedAt).toLocaleDateString('bn-BD')}</span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleDownloadNote(note)}
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
                          >
                            <Download className="w-4 h-4 mr-1" />
                            ডাউনলোড
                          </Button>
                          <Button
                            onClick={() => handleRemoveSavedNote(note.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl text-[#1A202C] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#285046]" />
                আমার বই অর্ডার
              </h3>
            </div>
            {orders.length === 0 ? (
              <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-white border-2 border-dashed">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl text-[#1A202C] mb-2">কোনো অর্ডার নেই</h3>
                <p className="text-[#555555] mb-4">আপনি এখনও কোনো বই অর্ডার করেননি</p>
                <Button onClick={onBackToHome} className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]">
                  বই দেখুন
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 hover:border-[#285046]/30">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg text-[#1A202C] mb-3 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#285046]" />
                            {order.bookTitle}
                          </h4>
                          <div className="space-y-2 text-sm text-[#555555]">
                            <p>লেখক: {order.bookAuthor}</p>
                            <p>পরিমাণ: {order.quantity} টি</p>
                            <p className="text-lg text-[#285046]">মোট: ৳{order.totalPrice}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="border-t pt-4 space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#555555]">
                          <Calendar className="w-4 h-4" />
                          <span>অর্ডার: {new Date(order.createdAt).toLocaleDateString('bn-BD')}</span>
                        </div>
                        <div className="p-3 bg-gradient-to-r from-[#F7FAFC] to-gray-100 rounded-xl space-y-1 border border-gray-200">
                          <p className="text-xs text-[#555555]">ডেলিভারি ঠিকানা:</p>
                          <p className="text-sm text-[#1A202C]">{order.address}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-4">
            <ReviewsSection />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <Card className="overflow-hidden border-2 border-gray-100">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    প্রোফাইল তথ্য
                  </h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      সম্পাদনা
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        সংরক্ষণ
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedName(user.name);
                          setEditedPhone(user.phone);
                          setEditedBio(user.bio || "");
                        }}
                        variant="outline"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                      >
                        <X className="w-4 h-4 mr-2" />
                        বাতিল
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Profile Picture Section */}
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-dashed border-gray-200">
                  <Avatar className="w-20 h-20 ring-4 ring-[#285046]/20">
                    <AvatarImage src={previewImage || user.profilePicture || ""} />
                    <AvatarFallback className="bg-gradient-to-br from-[#285046] to-[#2F6057] text-white text-2xl">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="text-[#1A202C] mb-1">প্রোফাইল ছবি</h4>
                    <p className="text-sm text-[#555555] mb-2">JPG, PNG (সর্বোচ্চ ৫MB)</p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046]"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      ছবি আপলোড করুন
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2 text-[#1A202C]">
                      <User className="w-4 h-4 text-[#285046]" />
                      নাম
                    </Label>
                    <Input
                      id="name"
                      value={isEditing ? editedName : user.name}
                      onChange={(e) => setEditedName(e.target.value)}
                      disabled={!isEditing}
                      className="bg-white disabled:bg-gray-50 border-2 focus:border-[#285046]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2 text-[#1A202C]">
                      <Mail className="w-4 h-4 text-[#285046]" />
                      ইমেইল
                    </Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-gray-50 border-2"
                    />
                    <p className="text-xs text-[#555555] flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      ইমেইল পরিবর্তন করা যাবে না
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2 text-[#1A202C]">
                      <Phone className="w-4 h-4 text-[#285046]" />
                      ফোন নম্বর
                    </Label>
                    <Input
                      id="phone"
                      value={isEditing ? editedPhone : user.phone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      disabled={!isEditing}
                      className="bg-white disabled:bg-gray-50 border-2 focus:border-[#285046]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="flex items-center gap-2 text-[#1A202C]">
                      <FileText className="w-4 h-4 text-[#285046]" />
                      বায়ো
                    </Label>
                    <Textarea
                      id="bio"
                      value={isEditing ? editedBio : (user.bio || "")}
                      onChange={(e) => setEditedBio(e.target.value)}
                      disabled={!isEditing}
                      placeholder="আপনার সম্পর্কে কিছু লিখুন..."
                      className="bg-white disabled:bg-gray-50 border-2 focus:border-[#285046] min-h-[100px]"
                    />
                  </div>
                </div>

                {/* Account Info */}
                <div className="border-t pt-6 mt-6">
                  <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 mb-1">একাউন্ট তথ্য</p>
                      <p className="text-xs text-blue-700">
                        একাউন্ট তৈরি: {new Date(user.createdAt).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        একাউন্ট টাইপ: {user.role === 'admin' ? 'অ্যাডমিন' : 'শিক্ষার্থী'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}