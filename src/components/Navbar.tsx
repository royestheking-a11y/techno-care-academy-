import { useState, useRef, useEffect } from "react";
import { Search, Menu, X, Phone, User, LogOut, UserCircle, Home, GraduationCap, Calendar, Book, Video, BookOpen, Lock } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import {
  getTeachers,
  getBooks,
  getCourses,
  getLiveClasses,
  getInstitutes,
  getSchedules,
  getNotes,
  getUserEnrollments
} from "../utils/localStorage";

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  sectionId: string;
  image?: string;
  link?: string;
  courseId?: number; // For restricted content
  requiresAuth?: boolean;
}

interface NavbarProps {
  searchData?: SearchItem[]; // Kept for prop compatibility, but ignored in favor of global search
  onNavigateToDashboard?: () => void;
  onOpenLogin?: () => void;
  onOpenSignup?: () => void;
}

export function Navbar({ onNavigateToDashboard, onOpenLogin, onOpenSignup }: NavbarProps) {
  const [showCallDialog, setShowCallDialog] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [globalSearchData, setGlobalSearchData] = useState<SearchItem[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout, isAuthenticated, isLoading, isVerified } = useAuth();

  // Load user enrollments for access control
  useEffect(() => {
    if (isAuthenticated && user) {
      getUserEnrollments(user.id).then(userEnrollments => {
        const confirmedEnrollments = userEnrollments
          .filter(e => e.status === "confirmed")
          .map(e => Number(e.courseId));
        setEnrolledCourses(confirmedEnrollments);
      });
    } else {
      setEnrolledCourses([]);
    }
  }, [user, isAuthenticated]);

  // Helper to check if content is locked
  const isLocked = (item: SearchItem): boolean => {
    if (!item.courseId) return false; // Public content (teachers, books, institutes)
    if (!isAuthenticated) return true; // Must be logged in
    if (isVerified) return false; // Verified users have full access
    return !enrolledCourses.includes(item.courseId); // Check enrollment
  };

  // refreshSearchIndex: Builds the master index from all data sources
  const refreshSearchIndex = async () => {
    try {
      const items: SearchItem[] = [];

      // 1. Teachers
      const teachers = await getTeachers();
      teachers.forEach(t => {
        items.push({
          id: `teacher-${t.id}`,
          title: t.name,
          subtitle: t.subject,
          type: "Teacher",
          sectionId: "teachers",
          image: t.image,
          link: "#teachers"
        });
      });

      // 2. Books
      const books = await getBooks();
      books.forEach(b => {
        items.push({
          id: `book-${b.id}`,
          title: b.title,
          subtitle: b.author,
          type: "Book",
          sectionId: "books",
          image: b.image,
          link: "#books"
        });
      });

      // 3. Courses
      const courses = await getCourses();
      courses.forEach(c => {
        items.push({
          id: `course-${c.id}`,
          title: c.title,
          subtitle: c.duration,
          type: "Course",
          sectionId: "courses",
          image: c.image,
          link: "#courses"
        });
      });

      // 4. Institutes
      const institutes = await getInstitutes();
      institutes.forEach(i => {
        items.push({
          id: `inst-${i.id}`,
          title: i.name,
          subtitle: i.location,
          type: "Institute",
          sectionId: "institutes",
          image: i.image,
          link: "#institutes"
        });
      });

      // 5. Live Classes (RESTRICTED)
      const liveClasses = await getLiveClasses();
      liveClasses.forEach(lc => {
        items.push({
          id: `live-${lc.id}`,
          title: lc.title,
          subtitle: lc.instructor,
          type: "Live Class",
          sectionId: "live-classes",
          image: lc.thumbnail,
          link: "#live-classes",
          courseId: (lc as any).courseId || 999, // Default courseId for type safety
          requiresAuth: true
        });
      });

      // 6. Notes (RESTRICTED)
      const notes = await getNotes();
      notes.forEach(n => {
        items.push({
          id: `note-${n.id}`,
          title: n.title,
          subtitle: n.description,
          type: "Note",
          sectionId: "notes",
          image: n.thumbnail,
          link: "#notes",
          courseId: n.courseId, // Access control
          requiresAuth: true
        });
      });

      // 7. Schedules (RESTRICTED)
      const schedules = await getSchedules();
      schedules.forEach(s => {
        items.push({
          id: `schedule-${s.id}`,
          title: `${s.subject} Class`,
          subtitle: `${s.day} at ${s.time}`,
          type: "Schedule",
          sectionId: "schedules",
          link: "#schedules",
          courseId: (s as any).courseId || 999, // Default courseId for type safety
          requiresAuth: true
        });
      });

      setGlobalSearchData(items);
    } catch (e) {
      console.error("Error building search index", e);
    }
  };

  // Build index on mount and update on storage changes
  useEffect(() => {
    refreshSearchIndex();

    const handleStorageChange = () => {
      refreshSearchIndex();
    };

    window.addEventListener('storage', handleStorageChange);
    // Listen to all custom update events
    window.addEventListener('teachers-update', handleStorageChange);
    window.addEventListener('books-update', handleStorageChange);
    window.addEventListener('courses-update', handleStorageChange); // Assuming standard naming

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('teachers-update', handleStorageChange);
      window.removeEventListener('books-update', handleStorageChange);
      window.removeEventListener('courses-update', handleStorageChange);
    };
  }, []);

  // Filter logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = globalSearchData.filter((item) => {
      const matchTitle = (item.title || "").toLowerCase().includes(query);
      const matchSubtitle = (item.subtitle || "").toLowerCase().includes(query);
      const matchType = (item.type || "").toLowerCase().includes(query);
      return matchTitle || matchSubtitle || matchType;
    });

    setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
    setShowSearchResults(true);
  }, [searchQuery, globalSearchData]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchItemClick = (item: SearchItem) => {
    // Check if content is locked
    if (isLocked(item)) {
      if (!isAuthenticated) {
        toast.error("লগইন প্রয়োজন", {
          description: "এই কন্টেন্ট অ্যাক্সেস করতে প্রথমে লগইন করুন"
        });
      } else {
        toast.error("কোর্সে এনরোল করুন", {
          description: "এই কন্টেন্ট অ্যাক্সেস করতে প্রথমে কোর্সে এনরোল করুন এবং অ্যাডমিন থেকে নিশ্চিতকরণ পান"
        });
      }
      setSearchQuery("");
      setShowSearchResults(false);
      return;
    }

    // Navigate via hash
    window.location.hash = item.sectionId;

    // Also try to scroll if on same page
    const element = document.getElementById(item.sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }

    setSearchQuery("");
    setShowSearchResults(false);
    setShowMobileMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchResults.length > 0) {
      handleSearchItemClick(searchResults[0]);
    } else if (e.key === "Escape") {
      setShowSearchResults(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  // Helper to render type-specific icons/images
  const renderItemIcon = (item: SearchItem) => {
    if (item.image) {
      return (
        <img src={item.image} alt={item.title} className="w-10 h-10 rounded-md object-cover border border-gray-100" />
      );
    }

    // Fallback icons
    switch (item.type) {
      case 'Teacher': return <UserCircle className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Book': return <Book className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Course': return <BookOpen className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Institute': return <GraduationCap className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Live Class': return <Video className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Schedule': return <Calendar className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      case 'Note': return <BookOpen className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
      default: return <Search className="w-10 h-10 text-[#285046] p-2 bg-[#E6FFFA] rounded-md" />;
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#285046] shadow-lg">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* Logo */}
            <div className="flex-shrink-0 cursor-pointer">
              <a href="/">
                <img
                  src="/TCA Logo.svg"
                  alt="Techno Care Academy"
                  className="h-4 sm:h-5 md:h-7 w-auto hover:opacity-90 transition-opacity"
                />
              </a>
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden md:block flex-1 max-w-2xl relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search teachers, books, courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery && setShowSearchResults(true)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 pr-8 sm:pr-10 md:pr-24 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white focus:border-white focus:bg-white/20 transition-all text-xs sm:text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-8 sm:right-9 md:right-12 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors hidden sm:block"
                  >
                    <X className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                )}
                <Search className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 text-white w-4 h-4 md:w-5 md:h-5 pointer-events-none" />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-2xl overflow-hidden z-50 max-h-60 sm:max-h-80 md:max-h-96 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="py-1 sm:py-2">
                      {searchResults.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSearchItemClick(item)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 hover:bg-[#F7FAFC] transition-colors text-left flex items-center gap-3 group border-b last:border-0"
                        >
                          {/* Item Icon/Image */}
                          <div className="flex-shrink-0">
                            {renderItemIcon(item)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-[#1A202C] font-semibold group-hover:text-[#285046] transition-colors text-sm truncate">
                                {item.title}
                              </p>
                              <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border">
                                {item.type}
                              </span>
                              {isLocked(item) && (
                                <Lock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-[#555555] truncate mt-0.5">
                              {item.subtitle || `View details in ${item.type}`}
                            </p>
                            {isLocked(item) && (
                              <p className="text-[10px] text-amber-600 mt-1">
                                🔒 {!isAuthenticated ? "Login required" : "Enrollment required"}
                              </p>
                            )}
                          </div>
                          <Search className="w-3 h-3 sm:w-4 sm:h-4 text-[#285046] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 sm:px-4 py-6 sm:py-8 text-center text-[#555555]">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">No results found</p>
                      <p className="text-xs mt-1 text-gray-500">
                        We couldn't find anything matching "{searchQuery}"
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                aria-label="Toggle menu"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* User Profile or Login/Signup */}
              <div className="hidden md:flex items-center gap-2">
                {isLoading ? (
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse"></div>
                ) : isAuthenticated && user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-3 py-2 transition-all"
                    >
                      <Avatar className="w-8 h-8 ring-2 ring-white/50">
                        <AvatarImage src={user.profilePicture || ""} />
                        <AvatarFallback className="bg-[#FFB703] text-white">
                          {user.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:inline text-sm">{user.name}</span>
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden">
                        <div className="p-3 border-b bg-[#F7FAFC]">
                          <p className="text-sm text-[#1A202C]">{user.name}</p>
                          <p className="text-xs text-[#555555]">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onNavigateToDashboard?.();
                          }}
                          className="w-full px-4 py-2.5 hover:bg-[#F7FAFC] transition-colors text-left flex items-center gap-2 text-sm"
                        >
                          <UserCircle className="w-4 h-4 text-[#285046]" />
                          ড্যাশবোর্ড
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 hover:bg-[#F7FAFC] transition-colors text-left flex items-center gap-2 text-sm border-t"
                        >
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span className="text-red-500">লগ আউট</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={onOpenLogin}
                      variant="outline"
                      className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white border-white/30 rounded-lg px-3 py-2 text-xs sm:text-sm"
                    >
                      লগইন
                    </Button>
                    <Button
                      onClick={onOpenSignup}
                      className="flex-shrink-0 bg-[#FFB703] hover:bg-[#FFB703]/90 text-white rounded-lg px-3 py-2 text-xs sm:text-sm shadow-lg"
                    >
                      সাইন আপ
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setShowMobileMenu(false)}
          />

          {/* Drawer Panel */}
          <div
            ref={mobileMenuRef}
            className="md:hidden fixed inset-y-0 right-0 z-50 w-[85vw] max-w-[320px] bg-[#285046] shadow-2xl overflow-y-auto transition-transform duration-300 ease-in-out border-l border-white/10"
          >
            <div className="flex flex-col h-full">
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="text-white font-semibold text-lg">Menu</span>
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 space-y-6 flex-1">
                {/* Search Bar in Mobile Menu */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-4 py-3 pr-10 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-10 top-1/2 -translate-y-1/2 text-white/80"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 pointer-events-none" />

                  {/* Search Results Dropdown for Mobile */}
                  {showSearchResults && searchQuery && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => handleSearchItemClick(item)}
                              className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left flex items-center gap-3 border-b last:border-0 border-gray-100"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-gray-900 font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 truncate">{item.subtitle || item.type}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">No results</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Grid Links */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'courses', icon: BookOpen, label: 'কোর্স' },
                    { id: 'teachers', icon: User, label: 'শিক্ষক' },
                    { id: 'schedules', icon: Calendar, label: 'সময়সূচী' },
                    { id: 'live-classes', icon: Video, label: 'লাইভ' },
                    { id: 'books', icon: Book, label: 'বই' },
                    { id: 'notes', icon: BookOpen, label: 'নোটস' },
                    { id: 'institutes', icon: GraduationCap, label: 'ইনস্টিটিউট' },
                    { id: '', icon: Home, label: 'হোম' },
                  ].map((link) => (
                    <button
                      key={link.id}
                      onClick={() => {
                        setShowMobileMenu(false);
                        window.location.hash = link.id;
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white gap-2"
                    >
                      <link.icon className="w-5 h-5 opacity-80" />
                      <span className="text-xs font-medium">{link.label}</span>
                    </button>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  {isAuthenticated && user ? (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
                        <Avatar className="w-10 h-10 ring-2 ring-white/30">
                          <AvatarImage src={user.profilePicture || ""} />
                          <AvatarFallback className="bg-[#FFB703] text-white">
                            {user.name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium text-white truncate">{user.name}</p>
                          <p className="text-xs text-white/70 truncate">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          onNavigateToDashboard?.();
                        }}
                        className="w-full py-3 bg-white text-[#285046] rounded-xl font-medium shadow-sm active:scale-95 transition-transform"
                      >
                        ড্যাশবোর্ড
                      </button>
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          handleLogout();
                        }}
                        className="w-full py-3 bg-transparent border border-white/30 text-white rounded-xl font-medium active:scale-95 transition-transform hover:bg-white/5"
                      >
                        লগ আউট
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <Button
                        onClick={() => {
                          setShowMobileMenu(false);
                          if (onOpenLogin) onOpenLogin();
                        }}
                        className="w-full bg-white text-[#285046] hover:bg-white/90 py-6 rounded-xl font-semibold shadow-md"
                      >
                        লগইন
                      </Button>
                      <Button
                        onClick={() => {
                          setShowMobileMenu(false);
                          if (onOpenSignup) onOpenSignup();
                        }}
                        className="w-full bg-[#FFB703] text-black hover:bg-[#FFB703]/90 py-6 rounded-xl font-semibold shadow-md"
                      >
                        সাইন আপ
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Call Dialog */}
      <Dialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <DialogContent className="rounded-2xl max-w-[90vw] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">যোগাযোগ করুন</DialogTitle>
            <DialogDescription className="text-sm">
              আমাদের সাথে যোগাযোগ করতে নিচের নম্বরগুলি ব্যবহার করুন
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#F7FAFC] rounded-xl">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#285046] flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">কল করুন</p>
                <p className="text-base sm:text-lg text-[#1A202C]">+880 1712-345678</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-[#F7FAFC] rounded-xl">
              <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-[#285046] flex-shrink-0" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">অফিস লাইন</p>
                <p className="text-base sm:text-lg text-[#1A202C]">+880 2-9876543</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}