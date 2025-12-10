import { Facebook, Youtube, Instagram, Mail, Phone, Shield, Lock } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "sonner";

export function Footer() {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: "",
    password: "",
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const ADMIN_USERNAME = "technocare";
    const ADMIN_PASSWORD = "technocare03";

    if (adminCredentials.username === ADMIN_USERNAME && adminCredentials.password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      toast.success("অ্যাডমিন লগইন সফল হয়েছে!");
      setShowAdminDialog(false);
      setAdminCredentials({ username: "", password: "" });
      setTimeout(() => {
        window.location.hash = "admin";
      }, 500);
    } else {
      toast.error("ভুল ইউজারনেম বা পাসওয়ার্ড");
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-slate-950 via-[#1A3A32] to-[#285046] text-white py-12 md:py-16 overflow-hidden">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-[#FFB703]/20 via-[#FF8C00]/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-[#285046]/30 via-[#2F6057]/15 to-transparent rounded-full blur-3xl"></div>

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-10 md:mb-12">
            {/* About Section with Glow */}
            <div className="text-center sm:text-left">
              <img
                src="/TCA Logo.svg"
                alt="Techno Care Academy"
                className="h-10 md:h-12 w-auto mb-4"
              />
              <p className="text-white/70 text-sm leading-relaxed">
                ক্লাস ৯-১০ এবং পলিটেকনিক শিক্ষার্থীদের জন্য বাংলাদেশের অন্যতম শ্রেষ্ঠ শিক্ষা প্রতিষ্ঠান।
              </p>
            </div>

            {/* Quick Links with Hover Effects */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg md:text-xl mb-4 text-white/90">Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="#"
                    className="text-white/70 hover:text-[#FFB703] transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#FFB703] group-hover:w-4 transition-all duration-300"></span>
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#courses"
                    className="text-white/70 hover:text-[#FFB703] transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#FFB703] group-hover:w-4 transition-all duration-300"></span>
                    Courses
                  </a>
                </li>
                <li>
                  <a
                    href="#teachers"
                    className="text-white/70 hover:text-[#FFB703] transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#FFB703] group-hover:w-4 transition-all duration-300"></span>
                    Teachers
                  </a>
                </li>
                <li>
                  <a
                    href="#notes"
                    className="text-white/70 hover:text-[#FFB703] transition-all duration-300 inline-flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-[#FFB703] group-hover:w-4 transition-all duration-300"></span>
                    Notes
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact with Icons */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg md:text-xl mb-4 text-white/90">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3 text-white/70 justify-center sm:justify-start group hover:text-white/90 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FFB703]/20 transition-all">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>+880 1629-648302</span>
                </li>
                <li className="flex items-center gap-3 text-white/70 justify-center sm:justify-start group hover:text-white/90 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#FFB703]/20 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm">technocareacademy.edu@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Social Media with Premium Buttons */}
            <div className="text-center sm:text-left">
              <h3 className="text-lg md:text-xl mb-4 text-white/90">Follow Us</h3>
              <div className="flex gap-3 justify-center sm:justify-start mb-6">
                <a
                  href="#"
                  className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#FFB703]/30 hover:to-[#FF8C00]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10 hover:border-[#FFB703]/50 group overflow-hidden"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 relative z-10 group-hover:text-[#FFB703] transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703]/0 to-[#FFB703]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a
                  href="#"
                  className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#FFB703]/30 hover:to-[#FF8C00]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10 hover:border-[#FFB703]/50 group overflow-hidden"
                  aria-label="Youtube"
                >
                  <Youtube className="w-5 h-5 relative z-10 group-hover:text-[#FFB703] transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703]/0 to-[#FFB703]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
                <a
                  href="#"
                  className="relative w-11 h-11 rounded-xl bg-white/5 hover:bg-gradient-to-br hover:from-[#FFB703]/30 hover:to-[#FF8C00]/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-white/10 hover:border-[#FFB703]/50 group overflow-hidden"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 relative z-10 group-hover:text-[#FFB703] transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703]/0 to-[#FFB703]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </a>
              </div>

              {/* Admin Access Button - Premium Style */}
              <button
                onClick={() => setShowAdminDialog(true)}
                className="relative group w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FFB703]/50 text-white/60 hover:text-[#FFB703] text-sm transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFB703]/0 via-[#FFB703]/10 to-[#FFB703]/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>

          {/* Divider with Glow */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-32 h-0.5 bg-gradient-to-r from-transparent via-[#FFB703]/50 to-transparent blur-sm"></div>
          </div>

          {/* Copyright with Security Badge */}
          <div className="text-center space-y-4">
            <p className="text-white/60 text-xs md:text-sm px-4">
              Copyright © {new Date().getFullYear()} Techno Care Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Admin Login Dialog */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent
          className="sm:max-w-[400px] bg-gradient-to-br from-slate-900 to-[#1A3A32] border-white/10 text-white p-0 gap-0 overflow-hidden"
          aria-describedby="admin-login-description"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>অ্যাডমিন লগইন</DialogTitle>
            <DialogDescription id="admin-login-description">
              অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার ক্রেডেনশিয়াল দিন
            </DialogDescription>
          </DialogHeader>

          {/* Premium Header */}
          <div className="relative bg-gradient-to-br from-[#285046] via-[#2F6057] to-[#285046] pt-8 pb-10 px-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFB703] opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full blur-xl"></div>

            <div className="relative z-10 text-center text-white space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl mb-2">
                <Shield className="w-8 h-8 text-[#FFB703]" />
              </div>
              <h2 className="text-2xl">অ্যাডমিন লগইন</h2>
              <p className="text-white/70 text-sm">
                অ্যাডমিন প্যানেলে প্রবেশ করুন
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="admin-username" className="text-white/80">
                ইউজারনেম
              </Label>
              <Input
                id="admin-username"
                type="text"
                value={adminCredentials.username}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, username: e.target.value })}
                placeholder="ইউজারনেম লিখুন"
                className="bg-white/5 border-white/10 focus:border-[#FFB703]/50 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-white/80">
                পাসওয়ার্ড
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={adminCredentials.password}
                onChange={(e) => setAdminCredentials({ ...adminCredentials, password: e.target.value })}
                placeholder="পাসওয়ার্ড লিখুন"
                className="bg-white/5 border-white/10 focus:border-[#FFB703]/50 text-white placeholder:text-white/30"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowAdminDialog(false);
                  setAdminCredentials({ username: "", password: "" });
                }}
                className="flex-1 bg-white/5 border-white/10 hover:bg-white/10 text-white"
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FFB703] to-[#FFA500] hover:from-[#FFA500] hover:to-[#FFB703] text-white border-0"
              >
                <Lock className="w-4 h-4 mr-2" />
                লগইন
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}