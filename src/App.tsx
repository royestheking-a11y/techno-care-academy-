import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { FloatingChat } from "./components/FloatingChat";
import { HeroCarousel } from "./components/HeroCarousel";
import { QuickTabs } from "./components/QuickTabs";
import { CourseSection } from "./components/CourseSection";
import { NotesSection } from "./components/NotesSection";
import { ClassSchedule } from "./components/ClassSchedule";
import { LiveClassSection } from "./components/LiveClassSection";
import { TeacherSection } from "./components/TeacherSection";
import { BooksSection } from "./components/BooksSection";
import { StatsSection } from "./components/StatsSection";
import { ServicesSection } from "./components/ServicesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { PolytechnicSection } from "./components/PolytechnicSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { Toaster } from "./components/ui/sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeApp } from "./utils/localStorage";
import { initializeMockData } from "./utils/mockData";
import { SplashScreen } from "./components/SplashScreen";
import { Loader2 } from "lucide-react";

// Lazy Load Pages to reduce initial bundle size
const AdminPanel = lazy(() => import("./components/admin/AdminPanel").then(module => ({ default: module.AdminPanel })));
const UserDashboard = lazy(() => import("./components/UserDashboard").then(module => ({ default: module.UserDashboard })));
const LoginPage = lazy(() => import("./components/auth/LoginPage").then(module => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import("./components/auth/SignupPage").then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import("./components/auth/ForgotPasswordPage").then(module => ({ default: module.ForgotPasswordPage })));
const TeachersPage = lazy(() => import("./components/pages/TeachersPage").then(module => ({ default: module.TeachersPage })));
const BooksPage = lazy(() => import("./components/pages/BooksPage").then(module => ({ default: module.BooksPage })));
const NotesPage = lazy(() => import("./components/pages/NotesPage").then(module => ({ default: module.NotesPage })));
const InstitutesPage = lazy(() => import("./components/pages/InstitutesPage").then(module => ({ default: module.InstitutesPage })));
const CoursesPage = lazy(() => import("./components/pages/CoursesPage").then(module => ({ default: module.CoursesPage })));
const SchedulesPage = lazy(() => import("./components/pages/SchedulesPage").then(module => ({ default: module.SchedulesPage })));
const LiveClassesPage = lazy(() => import("./components/pages/LiveClassesPage").then(module => ({ default: module.LiveClassesPage })));
const FreeExamPage = lazy(() => import("./components/FreeExamPage").then(module => ({ default: module.FreeExamPage })));

type PageRoute =
  | "home"
  | "login"
  | "signup"
  | "forgot-password"
  | "dashboard"
  | "admin"
  | "teachers"
  | "books"
  | "notes"
  | "institutes"
  | "courses"
  | "schedules"
  | "live-classes"
  | "exams";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>("home");
  const [showSplash, setShowSplash] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Initialize app and preload data during splash
  useEffect(() => {
    const preloadData = async () => {
      // Initialize app
      await initializeApp();
      await initializeMockData();

      // Preload critical data during splash screen
      try {
        const localStorage = await import("./utils/localStorage");

        // Fetch ALL critical data
        // 1. CRITICAL DATA (Blocks Splash Screen)
        // Only fetch what is immediately visible "Above the Fold"
        await Promise.all([
          localStorage.getSlides(),   // Hero Carousel
          localStorage.getCourses(),  // First section
          localStorage.getNotes(),    // Second section
        ]);

        // Mark critical data as loaded - DISMISS SPLASH SCREEN NOW
        setIsDataLoaded(true);

        // 2. BACKGROUND DATA (Non-Blocking)
        // Fetch the rest while user is viewing the Hero/Courses
        // This prevents the "1 minute wait" for deep footer content
        Promise.all([
          localStorage.getTeachers(),
          localStorage.getBooks(),
          localStorage.getLiveClasses(),
          localStorage.getSchedules(),
          localStorage.getInstitutes(),
          localStorage.getReviews(),
          localStorage.getStudents(),
        ]).catch(err => console.warn("Background data load error", err));

      } catch (error) {
        console.warn("Data preloading error:", error);
        // Even on error, we should eventually let the user in
        setIsDataLoaded(true);
      }
    };

    preloadData();
  }, []);

  // Check URL on mount and handle routing
  useEffect(() => {
    const checkRoute = () => {
      const hash = window.location.hash.slice(1); // Remove the #
      const path = window.location.pathname.slice(1); // Remove the /

      const route = hash || path || "home";

      if (route === "admin") {
        setCurrentPage("admin");
      } else if (route === "login") {
        setCurrentPage("login");
      } else if (route === "signup") {
        setCurrentPage("signup");
      } else if (route === "forgot-password") {
        setCurrentPage("forgot-password");
      } else if (route === "dashboard") {
        setCurrentPage("dashboard");
      } else if (route === "teachers") {
        setCurrentPage("teachers");
      } else if (route === "books") {
        setCurrentPage("books");
      } else if (route === "notes") {
        setCurrentPage("notes");
      } else if (route === "institutes") {
        setCurrentPage("institutes");
      } else if (route === "courses") {
        setCurrentPage("courses");
      } else if (route === "schedules") {
        setCurrentPage("schedules");
      } else if (route === "live-classes") {
        setCurrentPage("live-classes");
      } else if (route === "exams") {
        setCurrentPage("exams");
      } else {
        setCurrentPage("home");
      }
    };

    checkRoute();

    // Listen for hash/route changes
    window.addEventListener("hashchange", checkRoute);
    window.addEventListener("popstate", checkRoute);

    return () => {
      window.removeEventListener("hashchange", checkRoute);
      window.removeEventListener("popstate", checkRoute);
    };
  }, []);

  const navigateTo = (page: PageRoute) => {
    setCurrentPage(page);
    window.location.hash = page === "home" ? "" : page;
  };

  const handleTabClick = (tabId: string) => {
    // If not on home page, navigate to home first
    if (currentPage !== "home") {
      navigateTo("home");
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.getElementById(tabId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      // Already on home, just scroll
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Search data for all sections
  const searchData = useMemo(() => {
    return [
      // Courses
      { id: "course-1", title: "SSC পরীক্ষা প্রস্তুতি - সম্পূর্ণ কোর্স", type: "Course", sectionId: "courses" },
      { id: "course-2", title: "পলিটেকনিক ভর্তি প্রস্তুতি", type: "Course", sectionId: "courses" },
      { id: "course-3", title: "গণিত বিশেষ কোর্স", type: "Course", sectionId: "courses" },
      { id: "course-4", title: "বিজ্ঞান সমন্বিত কোর্স", type: "Course", sectionId: "courses" },
      { id: "course-5", title: "Class 9 Course", type: "Course", sectionId: "courses" },
      { id: "course-6", title: "Class 10 Course", type: "Course", sectionId: "courses" },

      // Teachers
      { id: "teacher-1", title: "মো. করিম উদ্দিন - পদার্থ বিজ্ঞান", type: "Teacher", sectionId: "teachers" },
      { id: "teacher-2", title: "ফাতেমা খাতুন - রসায়ন", type: "Teacher", sectionId: "teachers" },
      { id: "teacher-3", title: "রহিম আলী - গণিত", type: "Teacher", sectionId: "teachers" },
      { id: "teacher-4", title: "সালমা বেগম - ইংরেজি", type: "Teacher", sectionId: "teachers" },
      { id: "teacher-5", title: "শাকিল আহমেদ - জীববিজ্ঞান", type: "Teacher", sectionId: "teachers" },
      { id: "teacher-6", title: "নাজমা আক্তার - বাংলা", type: "Teacher", sectionId: "teachers" },

      // Schedule
      { id: "schedule-1", title: "রবিবার - পদার্থ বিজ্ঞান", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-2", title: "সোমবার - রসায়ন", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-3", title: "মঙ্গলবার - গণিত", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-4", title: "বুধবার - ইংরেজি", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-5", title: "বৃহস্পতিবার - জীববিজ্ঞান", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-6", title: "Physics Class Schedule", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-7", title: "Chemistry Class Schedule", type: "Class Schedule", sectionId: "schedule" },
      { id: "schedule-8", title: "Math Class Schedule", type: "Class Schedule", sectionId: "schedule" },

      // Live Classes
      { id: "live-1", title: "পদার্থ বিজ্ঞান - প্রথম অধ্যায় (Live)", type: "Live Class", sectionId: "live" },
      { id: "live-2", title: "জীববিজ্ঞান - কোষ বিভাজন (Live)", type: "Live Class", sectionId: "live" },
      { id: "live-3", title: "ইংরেজি গ্রামার (Live)", type: "Live Class", sectionId: "live" },
      { id: "live-4", title: "গণিত - জ্যামিতি (Live)", type: "Live Class", sectionId: "live" },
      { id: "live-5", title: "Live Physics Class", type: "Live Class", sectionId: "live" },
      { id: "live-6", title: "Live Chemistry Class", type: "Live Class", sectionId: "live" },
      { id: "live-7", title: "Live Math Class", type: "Live Class", sectionId: "live" },

      // Books
      { id: "book-1", title: "নবম-দশম শ্রেণির গণিত", type: "Book", sectionId: "books" },
      { id: "book-2", title: "পদার্থ বিজ্ঞান হ্যান্ডবুক", type: "Book", sectionId: "books" },
      { id: "book-3", title: "রসায়ন সম্পূর্ণ গাইড", type: "Book", sectionId: "books" },
      { id: "book-4", title: "ইংরেজি গ্রামার এন্ড কম্পোজিশন", type: "Book", sectionId: "books" },
      { id: "book-5", title: "জীববিজ্ঞান প্রশ্নব্যাংক", type: "Book", sectionId: "books" },
      { id: "book-6", title: "বাংলা ব্যাকরণ ও নির্মিতি", type: "Book", sectionId: "books" },
      { id: "book-7", title: "Class 9 Mathematics Book", type: "Book", sectionId: "books" },
      { id: "book-8", title: "Class 10 Physics Book", type: "Book", sectionId: "books" },
      { id: "book-9", title: "SSC Preparation Guide", type: "Book", sectionId: "books" },

      // Polytechnic Institutes
      { id: "institute-1", title: "Dhaka Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-2", title: "Rajshahi Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-3", title: "Khulna Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-4", title: "Chattogram Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-5", title: "Barisal Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-6", title: "Bogura Polytechnic Institute", type: "Institute", sectionId: "institutes" },
      { id: "institute-7", title: "Polytechnic Admission", type: "Institute", sectionId: "institutes" },
      { id: "institute-8", title: "Engineering Diploma", type: "Institute", sectionId: "institutes" },

      // Notes
      { id: "note-1", title: "SSC পদার্থ বিজ্ঞান - প্রথম অধ্যায়", type: "Note", sectionId: "notes" },
      { id: "note-2", title: "SSC গণিত - বীজগণিত", type: "Note", sectionId: "notes" },
      { id: "note-3", title: "রসায়ন - জৈব যৌগ চিত্র", type: "Note", sectionId: "notes" },
      { id: "note-4", title: "জীববিজ্ঞান - কোষ বিভাজন প্রেজেন্টেশন", type: "Note", sectionId: "notes" },
      { id: "note-5", title: "পলিটেকনিক ম্যাথ ফর্মুলা শীট", type: "Note", sectionId: "notes" },
      { id: "note-6", title: "Study Notes", type: "Note", sectionId: "notes" },
      { id: "note-7", title: "স্টাডি ম্যাটেরিয়াল", type: "Note", sectionId: "notes" },
    ];
  }, []);

  const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#285046]" />
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  );

  // Render based on current page
  if (currentPage === "login") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <LoginPage
            onNavigateToSignup={() => navigateTo("signup")}
            onNavigateToHome={() => navigateTo("home")}
            onNavigateToForgotPassword={() => navigateTo("forgot-password")}
          />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "signup") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <SignupPage onNavigateToLogin={() => navigateTo("login")} onNavigateToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "forgot-password") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <ForgotPasswordPage onNavigateToLogin={() => navigateTo("login")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "admin") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <AdminPanel />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "dashboard") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <UserDashboard onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "teachers") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <TeachersPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "books") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <BooksPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "notes") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <NotesPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "institutes") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <InstitutesPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "courses") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <CoursesPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "schedules") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <SchedulesPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "live-classes") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <LiveClassesPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  if (currentPage === "exams") {
    return (
      <AuthProvider>
        <Toaster position="top-right" />
        <Suspense fallback={<PageLoader />}>
          <FreeExamPage onBackToHome={() => navigateTo("home")} />
        </Suspense>
      </AuthProvider>
    );
  }

  // Home page
  return (
    <AuthProvider>
      {/* Splash Screen - blocks content until complete */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
          minDuration={2500}
          isDataLoaded={isDataLoaded}
        />
      )}

      {/* Main content - only visible after splash completes */}
      {!showSplash && (
        <div className="min-h-screen bg-white">
          <Toaster position="top-right" />

          {/* Navigation */}
          <Navbar
            searchData={searchData}
            onNavigateToDashboard={() => navigateTo("dashboard")}
            onOpenLogin={() => navigateTo("login")}
            onOpenSignup={() => navigateTo("signup")}
          />

          {/* Floating Chat Button */}
          <FloatingChat />

          {/* Hero Section */}
          <HeroCarousel />

          {/* Quick Tabs Menu */}
          <QuickTabs onTabClick={handleTabClick} />

          {/* Courses Section */}
          <div id="courses">
            <CourseSection />
          </div>

          {/* Notes Section - Moved here after Courses */}
          <div id="notes">
            <NotesSection />
          </div>

          {/* Class Schedule Section */}
          <div id="schedule">
            <ClassSchedule />
          </div>

          {/* Live Class Section */}
          <div id="live">
            <LiveClassSection />
          </div>

          {/* Teachers Section */}
          <div id="teachers">
            <TeacherSection />
          </div>

          {/* Books Section */}
          <div id="books">
            <BooksSection />
          </div>

          {/* Stats Section */}
          <StatsSection />

          {/* Services Section */}
          <ServicesSection />

          {/* Reviews Section - Public Testimonials */}
          <TestimonialsSection />

          {/* Polytechnic Institutes Section */}
          <div id="institutes">
            <PolytechnicSection />
          </div>

          {/* Contact Section */}
          <ContactSection />

          {/* Footer */}
          <Footer />
        </div>
      )}
    </AuthProvider>
  );
}