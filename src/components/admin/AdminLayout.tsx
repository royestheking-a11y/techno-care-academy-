import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Star,
  Calendar,
  Image as ImageIcon,
  UserCircle,
  LogOut,
  Menu,
  X,
  ClipboardList,
  ShoppingBag,
  Mail,
  FileText,
  Video,
  Building2,
  Home
} from "lucide-react";
import { Button } from "../ui/button";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, currentPage, onPageChange, onLogout }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const menuItems = [
    { id: "dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
    { id: "registered-users", label: "শিক্ষার্থী ব্যবস্থাপনা", icon: UserCircle },
    { id: "enrollments", label: "কোর্স ভর্তি", icon: ClipboardList },
    { id: "teachers", label: "শিক্ষক", icon: GraduationCap },
    { id: "courses", label: "কোর্স", icon: BookOpen },
    { id: "books", label: "বই", icon: BookOpen },
    { id: "orders", label: "বই অর্ডার", icon: ShoppingBag },
    { id: "schedule", label: "ক্লাস শিডিউল", icon: Calendar },
    { id: "liveclasses", label: "লাইভ ক্লাস", icon: Video },

    { id: "notes", label: "নোট ব্যবস্থাপনা", icon: FileText },
    { id: "carousel", label: "হিরো ক্যারোসেল", icon: ImageIcon },
    { id: "reviews", label: "রিভিউ ব্যবস্থাপনা", icon: Star },
    { id: "messages", label: "প্রাপ্ত তথ্য", icon: Mail },
    { id: "institutes", label: "ইনস্টিটিউট সমূহ", icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-[#285046] hover:bg-gray-100 p-2 rounded-lg"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-xl md:text-2xl text-[#285046]">Techno Care Academy - অ্যাডমিন প্যানেল</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="text-[#285046] border-[#285046] hover:bg-[#285046] hover:text-white"
              >
                <Home className="w-4 h-4 mr-2" />
                হোম
              </Button>
            </a>
            <Button
              onClick={onLogout}
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              লগ আউট
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-[57px] left-0 h-[calc(100vh-57px)] bg-white border-r border-gray-200 transition-transform duration-300 z-40 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
            } w-64 overflow-y-auto`}
        >
          <div className="py-6">
            <nav className="space-y-2 px-3">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id
                      ? "bg-gradient-to-r from-[#285046] to-[#2F6057] text-white"
                      : "text-[#555555] hover:bg-gray-100"
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}