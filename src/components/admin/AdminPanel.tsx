import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { AdminDashboard } from "./AdminDashboard";
import { StudentsManager } from "./StudentsManager";
import { RegisteredUsersManager } from "./RegisteredUsersManager";
import { CoursesManager } from "./CoursesManager";
import { TeachersManager } from "./TeachersManager";
import { BooksManager } from "./BooksManager";
import { EnrollmentsManager } from "./EnrollmentsManager";
import { OrdersManager } from "./OrdersManager";
import { SchedulesManager } from "./SchedulesManager";
import { MessagesManager } from "./MessagesManager";
import { NotesManager } from "./NotesManager";
import { CarouselManager } from "./CarouselManager";
import { ReviewsManager } from "./ReviewsManager";
import { LiveClassesManager } from "./LiveClassesManager";
import { InstitutesManager } from "./InstitutesManager";

import { AdminLogin } from "./AdminLogin";

export function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("adminLoggedIn");
      if (loggedIn === "true") {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = () => {
    try {
      localStorage.setItem("adminLoggedIn", "true");
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error setting admin auth:", error);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("adminLoggedIn");
      setIsAuthenticated(false);
      setCurrentPage("dashboard");
      // Navigate back to home
      window.location.hash = "";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#285046] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#555555]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  const renderPage = () => {
    try {
      switch (currentPage) {
        case "dashboard":
          return <AdminDashboard />;
        case "messages":
          return <MessagesManager />;
        case "students":
          return <StudentsManager />;
        case "registered-users":
          return <RegisteredUsersManager />;
        case "enrollments":
          return <EnrollmentsManager />;
        case "teachers":
          return <TeachersManager />;
        case "courses":
          return <CoursesManager />;
        case "books":
          return <BooksManager />;
        case "orders":
          return <OrdersManager />;
        case "schedule":
          return <SchedulesManager />;
        case "notes":
          return <NotesManager />;
        case "carousel":
          return <CarouselManager />;
        case "reviews":
          return <ReviewsManager />;
        case "liveclasses":
          return <LiveClassesManager />;
        case "institutes":
          return <InstitutesManager />;

        default:
          return <AdminDashboard />;
      }
    } catch (error) {
      console.error("Error rendering page:", error);
      return (
        <div className="text-center py-12">
          <h2 className="text-2xl text-red-600 mb-2">Error</h2>
          <p className="text-[#555555]">Something went wrong. Please try again.</p>
        </div>
      );
    }
  };

  return (
    <AdminLayout
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}