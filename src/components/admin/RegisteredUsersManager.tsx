import { useState, useEffect } from "react";
import { Eye, Search, Loader2, Mail, Phone, Calendar, BookOpen, User as UserIcon, Edit, CheckCircle, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { toast } from "sonner";
import {
  getUsers,
  updateUser,
  deleteUser,
  saveUser,
  User as UserType,
  getCourses,
  saveEnrollment,
  Course,
  getEnrollments,
  Enrollment
} from "../../utils/localStorage";
import { Label } from "../ui/label";

export function RegisteredUsersManager() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Edit State
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    courseId: "" // Optional course selection
  });

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editForm, setEditForm] = useState<Partial<UserType>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allUsers, allCourses, allEnrollments] = await Promise.all([
        getUsers(),
        getCourses(),
        getEnrollments()
      ]);
      setUsers(allUsers.filter(user => user.role !== 'admin'));
      setCourses(allCourses);
      setEnrollments(allEnrollments);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("তথ্য লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const getUserEnrollmentsList = (userId: string) => {
    return enrollments.filter(e => String(e.userId) === String(userId));
  };

  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const handleCreateUser = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      toast.error("নাম, ইমেইল এবং পাসওয়ার্ড আবশ্যক");
      return;
    }

    try {
      const newUser: UserType = {
        id: `user-${Date.now()}`,
        name: createForm.name,
        email: createForm.email,
        phone: createForm.phone,
        password: createForm.password,
        role: 'user',
        createdAt: new Date().toISOString(),
        isVerified: true, // Auto-verify manually created users
        isDisabled: false
      };

      await saveUser(newUser);

      // Handle Auto-Enrollment
      if (createForm.courseId) {
        const selectedCourse = courses.find(c => String(c.id) === createForm.courseId);
        if (selectedCourse) {
          await saveEnrollment({
            id: `enroll-${Date.now()}`,
            userId: newUser.id,
            courseId: selectedCourse.id,
            courseName: selectedCourse.title,
            courseTitle: selectedCourse.title,
            studentName: newUser.name,
            studentEmail: newUser.email,
            studentPhone: newUser.phone,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            coursePrice: selectedCourse.price,
            courseDuration: selectedCourse.duration
          });
          toast.success("কোর্স এনরোলমেন্ট সফল হয়েছে!");
        }
      }

      toast.success("নতুন অ্যাকাউন্ট তৈরি করা হয়েছে");
      setShowCreateDialog(false);
      setCreateForm({ name: "", email: "", phone: "", password: "", courseId: "" });
      loadData();
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("অ্যাকাউন্ট তৈরি করতে সমস্যা হয়েছে");
    }
  };

  const handleEditClick = (user: UserType) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
    });
    setShowEditDialog(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, editForm);
      toast.success("তথ্য আপডেট করা হয়েছে");
      setShowEditDialog(false);

      // Update local state without full reload
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...editForm } : u));
      if (selectedUser) {
        setSelectedUser({ ...selectedUser, ...editForm });
      }
    } catch (error) {
      toast.error("আপডেট করতে সমস্যা হয়েছে");
    }
  };

  const handleVerifyUser = async (user: UserType) => {
    try {
      const newStatus = !user.isVerified;
      await updateUser(user.id, { isVerified: newStatus });
      toast.success(newStatus ? "ব্যবহারকারী ভেরিফাই করা হয়েছে" : "ভেরিফিকেশন বাতিল করা হয়েছে");

      setUsers(users.map(u => u.id === user.id ? { ...u, isVerified: newStatus } : u));
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, isVerified: newStatus });
      }
    } catch (error) {
      toast.error("অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে");
    }
  };

  const handleDisableUser = async (user: UserType) => {
    try {
      const newStatus = !user.isDisabled;
      await updateUser(user.id, { isDisabled: newStatus });
      toast.success(newStatus ? "ব্যবহারকারী নিষ্ক্রিয় করা হয়েছে" : "ব্যবহারকারী সক্রিয় করা হয়েছে");

      setUsers(users.map(u => u.id === user.id ? { ...u, isDisabled: newStatus } : u));
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, isDisabled: newStatus });
      }
    } catch (error) {
      toast.error("অ্যাকশন সম্পন্ন করতে সমস্যা হয়েছে");
    }
  };

  const handleDeleteUser = (userId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteId(userId);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      setLoading(true);
      const success = await deleteUser(deleteId);

      if (success) {
        setUsers(currentUsers => currentUsers.filter(u => String(u.id).trim() !== String(deleteId).trim()));
        setShowDetailsDialog(false);
        setSelectedUser(null);
        setDeleteId(null);
        toast.success("ব্যবহারকারী ডিলিট করা হয়েছে");
      } else {
        toast.error("ডিলিট করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.phone && u.phone.includes(searchTerm))
  );

  if (loading && users.length === 0) {
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
          <p className="text-[#555555]">সকল শিক্ষার্থীর তথ্য ব্যবস্থাপনা করুন</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:shadow-lg text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            অ্যাকাউন্ট তৈরি করুন
          </Button>
          <div className="px-4 py-2 bg-[#285046] text-white rounded-lg">
            মোট: {users.length} জন
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="নাম, ইমেইল বা ফোন দিয়ে খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => {
          const userEnrollments = getUserEnrollmentsList(user.id);
          const confirmedEnrollments = userEnrollments.filter((e) => e.status === 'confirmed');

          return (
            <Card key={user.id} className={`p-6 border-none shadow-lg hover:shadow-xl transition-all ${user.isDisabled ? 'opacity-75 bg-gray-50' : ''}`}>
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="w-16 h-16 ring-4 ring-[#285046]">
                  <AvatarImage src={user.profilePicture} alt={user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg text-[#1A202C] mb-1 truncate font-semibold">{user.name}</h3>
                    {user.isDisabled && <Badge variant="destructive" className="text-xs">নিষ্ক্রিয়</Badge>}
                  </div>
                  <p className="text-sm text-[#555555] truncate">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {user.phone && (
                  <div className="flex items-center gap-2 text-sm text-[#555555]">
                    <Phone className="w-4 h-4 text-[#285046]" />
                    <span>{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-[#555555]">
                  <Calendar className="w-4 h-4 text-[#285046]" />
                  <span>{new Date(user.createdAt).toLocaleDateString('bn-BD')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-[#285046]" />
                  <span className="text-[#285046]">
                    {confirmedEnrollments.length} টি কোর্স এনরোল
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {user.role === 'admin' ? (
                  <Badge className="bg-red-500 hover:bg-red-600">অ্যাডমিন</Badge>
                ) : (user.isVerified || confirmedEnrollments.length > 0) ? (
                  <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> যাচাইকৃত
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600 flex items-center gap-1">
                    অযাচাইকৃত
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleViewDetails(user)}
                  variant="outline"
                  size="sm"
                  className="w-full text-[#285046] border-[#285046] hover:bg-[#285046] hover:text-white"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  বিস্তারিত
                </Button>
                <Button
                  onClick={() => handleEditClick(user)}
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  এডিট
                </Button>
                {user.role !== 'admin' && (
                  <>
                    <Button
                      onClick={() => handleVerifyUser(user)}
                      variant="outline"
                      size="sm"
                      className={`w-full ${user.isVerified ? 'border-orange-500 text-orange-600 hover:bg-orange-50' : 'border-green-500 text-green-600 hover:bg-green-50'}`}
                    >
                      {user.isVerified ? 'আনভেরিফাই' : 'ভেরিফাই'}
                    </Button>
                    <Button
                      onClick={() => handleDisableUser(user)}
                      variant="outline"
                      size="sm"
                      className={`w-full ${user.isDisabled ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-gray-500 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {user.isDisabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </Button>
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteUser(user.id, e);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full col-span-2 border-red-500 text-red-600 hover:bg-red-50 mt-2"
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      ডিলিট করুন
                    </Button>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#555555] text-lg">কোন ব্যবহারকারী পাওয়া যায়নি</p>
        </div>
      )}

      {/* User Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ব্যবহারকারীর বিস্তারিত তথ্য</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} এর সম্পূর্ণ প্রোফাইল এবং এনরোলমেন্ট তথ্য
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 py-4">
              {/* User Profile Section */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-gradient-to-br from-[#285046]/10 to-[#2F6057]/10 rounded-xl relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600" onClick={() => { setShowDetailsDialog(false); handleEditClick(selectedUser); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  {selectedUser.role !== 'admin' && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteUser(selectedUser.id, e);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <Avatar className="w-24 h-24 ring-4 ring-[#285046]">
                  <AvatarImage src={selectedUser.profilePicture} alt={selectedUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#285046] to-[#2F6057] text-white text-2xl">
                    {selectedUser.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl text-[#1A202C] mb-2">{selectedUser.name}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Mail className="w-4 h-4 text-[#285046]" />
                      <span className="text-[#555555]">{selectedUser.email}</span>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-center justify-center md:justify-start gap-2">
                        <Phone className="w-4 h-4 text-[#285046]" />
                        <span className="text-[#555555]">{selectedUser.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <Calendar className="w-4 h-4 text-[#285046]" />
                      <span className="text-[#555555]">
                        যোগদানের তারিখ: {new Date(selectedUser.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <UserIcon className="w-4 h-4 text-[#285046]" />
                      <span className="text-[#555555]">
                        User ID: {selectedUser.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                    {selectedUser.role === 'admin' ? (
                      <Badge className="bg-red-500">অ্যাডমিন</Badge>
                    ) : (selectedUser.isVerified || getUserEnrollmentsList(selectedUser.id).filter(e => e.status === 'confirmed').length > 0) ? (
                      <Badge className="bg-green-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> যাচাইকৃত</Badge>
                    ) : (
                      <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                        অযাচাইকৃত
                      </Badge>
                    )}

                    {selectedUser.isDisabled && <Badge variant="destructive">নিষ্ক্রিয়</Badge>}
                  </div>

                  {selectedUser.role !== 'admin' && (
                    <div className="flex gap-3 mt-4 justify-center md:justify-start">
                      <Button
                        size="sm"
                        onClick={() => handleVerifyUser(selectedUser)}
                        variant={selectedUser.isVerified ? "outline" : "default"}
                        className={selectedUser.isVerified ? "border-orange-500 text-orange-600" : "bg-[#285046]"}
                      >
                        {selectedUser.isVerified ? "ভেরিফিকেশন বাতিল" : "ভেরিফাই করুন"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleDisableUser(selectedUser)}
                        variant="outline"
                        className={selectedUser.isDisabled ? "border-green-500 text-green-600" : "border-gray-500 text-gray-600"}
                      >
                        {selectedUser.isDisabled ? "সক্রিয় করুন" : "নিষ্ক্রিয় করুন"}
                      </Button>
                    </div>
                  )}

                </div>
              </div>

              {/* Enrollments Section */}
              <div>
                <h4 className="text-xl text-[#1A202C] mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#285046]" />
                  এনরোল করা কোর্স
                </h4>
                <div className="space-y-3">
                  {getUserEnrollmentsList(selectedUser.id).length > 0 ? (
                    getUserEnrollmentsList(selectedUser.id).map((enrollment, index) => (
                      <Card key={index} className="p-4 border-l-4" style={{
                        borderLeftColor: enrollment.status === 'confirmed' ? '#10B981' :
                          enrollment.status === 'pending' ? '#F59E0B' : '#EF4444'
                      }}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h5 className="text-lg text-[#1A202C] mb-2">
                              {enrollment.courseName || enrollment.courseTitle || 'কোর্সের নাম নেই'}
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#555555]">
                              <div>
                                <span className="text-[#285046]">নাম:</span> {enrollment.studentName}
                              </div>
                              <div>
                                <span className="text-[#285046]">টাইপ:</span> {enrollment.courseTitle ? 'অনলাইন' : 'N/A'}
                              </div>
                              <div>
                                <span className="text-[#285046]">সময়:</span> {enrollment.courseDuration || 'N/A'}
                              </div>
                              <div>
                                <span className="text-[#285046]">ফি:</span> ৳{enrollment.coursePrice || 'N/A'}
                              </div>
                              {enrollment.createdAt && (
                                <div className="md:col-span-2">
                                  <span className="text-[#285046]">এনরোল তারিখ:</span> {new Date(enrollment.createdAt).toLocaleDateString('bn-BD')}
                                </div>
                              )}
                            </div>
                          </div>
                          <Badge className={
                            enrollment.status === 'confirmed' ? 'bg-green-500' :
                              enrollment.status === 'pending' ? 'bg-yellow-500' :
                                'bg-red-500'
                          }>
                            {enrollment.status === 'confirmed' ? 'কনফার্মড' :
                              enrollment.status === 'pending' ? 'পেন্ডিং' :
                                'বাতিল'}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-8 text-center">
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-[#555555]">এই ব্যবহারকারী এখনো কোনো কোর্সে এনরোল করেননি</p>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>তথ্য হালনাগাদ</DialogTitle>
            <DialogDescription>
              ব্যবহারকারীর তথ্য পরিবর্তন করুন।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম</Label>
              <Input
                id="name"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">ফোন নম্বর</Label>
              <Input
                id="phone"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>বাতিল</Button>
            <Button onClick={handleUpdateUser} className="bg-[#285046] text-white hover:bg-[#2F6057]">
              সেভ করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>নতুন অ্যাকাউন্ট তৈরি করুন</DialogTitle>
            <DialogDescription>
              শিক্ষার্থীর জন্য নতুন অ্যাকাউন্ট তৈরি করুন। এটি স্বয়ংক্রিয়ভাবে ভেরিফাইড হবে।
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-name">নাম</Label>
              <Input
                id="create-name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                placeholder="শিক্ষার্থীর নাম"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-email">ইমেইল</Label>
              <Input
                id="create-email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-phone">ফোন নম্বর (ঐচ্ছিক)</Label>
              <Input
                id="create-phone"
                value={createForm.phone}
                onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                placeholder="017..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-password">পাসওয়ার্ড</Label>
              <Input
                id="create-password"
                type="text"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="গোপন পাসওয়ার্ড দিন"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-course">কোর্স এনরোলমেন্ট (ঐচ্ছিক)</Label>
              <select
                id="create-course"
                value={createForm.courseId}
                onChange={(e) => setCreateForm({ ...createForm, courseId: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">কোন কোর্স নেই</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title} ({course.price}৳)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>বাতিল</Button>
            <Button onClick={handleCreateUser} className="bg-[#285046] text-white hover:bg-[#2F6057]">
              অ্যাকাউন্ট তৈরি করুন
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>আপনি কি নিশ্চিত?</AlertDialogTitle>
            <AlertDialogDescription>
              এই অ্যাকশনটি ফিরিয়ে আনা যাবে না। ব্যবহারকারীর সমস্ত তথ্য স্থায়ীভাবে মুছে ফেলা হবে।
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>বাতিল</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              ডিলিট করুন
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
