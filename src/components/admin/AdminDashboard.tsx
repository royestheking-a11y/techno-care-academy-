import { useState, useEffect } from "react";
import {
  Users, GraduationCap, BookOpen, Star, Calendar, UserCircle,
  TrendingUp, Loader2, Package, ShoppingCart, CheckCircle, Clock,
  Video, FileText, Image, School, Activity, BarChart3
} from "lucide-react";
import { Card } from "../ui/card";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalCourses: 0,
    totalBooks: 0,
    totalReviews: 0,
    totalSchedules: 0,
    totalEnrollments: 0,
    pendingEnrollments: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completeOrders: 0,
    totalLiveClasses: 0,
    totalNotes: 0,
    totalInstitutes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        students,
        teachers,
        courses,
        books,
        reviews,
        schedules,
        enrollments,
        orders,
        liveClasses,
        notes,
        institutes
      ] = await Promise.all([
        import("../../utils/localStorage").then(m => m.getUsers()),
        import("../../utils/localStorage").then(m => m.getTeachers()),
        import("../../utils/localStorage").then(m => m.getCourses()),
        import("../../utils/localStorage").then(m => m.getBooks()),
        import("../../utils/localStorage").then(m => m.getReviews()),
        import("../../utils/localStorage").then(m => m.getSchedules()),
        import("../../utils/localStorage").then(m => m.getEnrollments()),
        import("../../utils/localStorage").then(m => m.getOrders()),
        import("../../utils/localStorage").then(m => m.getLiveClasses()),
        import("../../utils/localStorage").then(m => m.getNotes()),
        import("../../utils/localStorage").then(m => m.getInstitutes()),
      ]);

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalBooks: books.length,
        totalReviews: reviews.length,
        totalSchedules: schedules.length,
        totalEnrollments: enrollments.length,
        pendingEnrollments: enrollments.filter((e: any) => e.status === "pending").length,
        totalOrders: orders.length,
        pendingOrders: orders.filter((o: any) => o.status === "pending").length,
        completeOrders: orders.filter((o: any) => o.status === "complete").length,
        totalLiveClasses: liveClasses.length,
        totalNotes: notes.length,
        totalInstitutes: institutes.length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 animate-spin text-[#285046]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-[#1A202C] flex items-center gap-3">
            <Activity className="w-8 h-8 text-[#285046]" />
            ড্যাশবোর্ড ওভারভিউ
          </h2>
          <p className="text-[#555555] mt-1">Techno Care Academy অ্যাডমিন প্যানেলে স্বাগতম</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white rounded-xl shadow-lg">
          <p className="text-xs opacity-90">আজকের তারিখ</p>
          <p className="text-sm">{new Date().toLocaleDateString('bn-BD')}</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট শিক্ষার্থী</p>
              <p className="text-3xl text-[#1A202C]">{stats.totalStudents}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl">
              <UserCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট শিক্ষক</p>
              <p className="text-3xl text-[#1A202C]">{stats.totalTeachers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট কোর্স</p>
              <p className="text-3xl text-[#1A202C]">{stats.totalCourses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">মোট বই</p>
              <p className="text-3xl text-[#1A202C]">{stats.totalBooks}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">রিভিউ</p>
              <p className="text-2xl text-[#1A202C]">{stats.totalReviews}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">শিডিউল</p>
              <p className="text-2xl text-[#1A202C]">{stats.totalSchedules}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">লাইভ ক্লাস</p>
              <p className="text-2xl text-[#1A202C]">{stats.totalLiveClasses}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">নোট</p>
              <p className="text-2xl text-[#1A202C]">{stats.totalNotes}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl">
              <School className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-gray-600">ইনস্টিটিউট</p>
              <p className="text-2xl text-[#1A202C]">{stats.totalInstitutes}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enrollment & Orders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-2 border-gray-200 hover:border-[#285046] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#285046]/10 rounded-lg">
              <GraduationCap className="w-5 h-5 text-[#285046]" />
            </div>
            <h3 className="text-lg text-[#1A202C]">কোর্স এনরোলমেন্ট</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#285046] to-[#2F6057] text-white rounded-xl shadow-md">
              <div>
                <p className="text-sm opacity-90">মোট এনরোলমেন্ট</p>
                <p className="text-3xl">{stats.totalEnrollments}</p>
              </div>
              <Package className="w-10 h-10 opacity-80" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
                <p className="text-2xl text-yellow-700">{stats.pendingEnrollments}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700">Confirmed</p>
                </div>
                <p className="text-2xl text-green-700">{stats.totalEnrollments - stats.pendingEnrollments}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-2 border-gray-200 hover:border-[#FFB703] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#FFB703]/10 rounded-lg">
              <ShoppingCart className="w-5 h-5 text-[#FFB703]" />
            </div>
            <h3 className="text-lg text-[#1A202C]">বই অর্ডার</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#FFB703] to-[#FB8500] text-white rounded-xl shadow-md">
              <div>
                <p className="text-sm opacity-90">মোট অর্ডার</p>
                <p className="text-3xl">{stats.totalOrders}</p>
              </div>
              <BookOpen className="w-10 h-10 opacity-80" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <p className="text-xs text-yellow-700">Pending</p>
                </div>
                <p className="text-2xl text-yellow-700">{stats.pendingOrders}</p>
              </div>

              <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <p className="text-xs text-green-700">Complete</p>
                </div>
                <p className="text-2xl text-green-700">{stats.completeOrders}</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg text-[#1A202C]">সিস্টেম পারফরম্যান্স</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#555555]">সাফল্যের হার</p>
              <span className="text-sm text-green-600">98%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-600 w-[98%] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#555555]">কোর্স সম্পন্নতা</p>
              <span className="text-sm text-blue-600">85%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-[85%] rounded-full"></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#555555]">শিক্ষার্থী সন্তুষ্টি</p>
              <span className="text-sm text-yellow-600">95%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 w-[95%] rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-6 border-2 border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg text-[#1A202C]">সিস্টেম স্ট্যাটাস</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1A202C]">সিস্টেম সক্রিয়</p>
              <p className="text-xs text-[#555555]">প্রশাসনিক প্যানেল চালু</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1A202C]">ডাটাবেস সংযুক্ত</p>
              <p className="text-xs text-[#555555]">সকল তথ্য সংরক্ষিত</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border-2 border-purple-200">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[#1A202C]">সার্ভিস চালু</p>
              <p className="text-xs text-[#555555]">সব ফিচার প্রস্তুত</p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
