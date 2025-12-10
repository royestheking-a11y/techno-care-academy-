import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface LoginPageProps {
  onNavigateToSignup: () => void;
  onNavigateToHome: () => void;
  onNavigateToForgotPassword: () => void;
}

export function LoginPage({ onNavigateToSignup, onNavigateToHome, onNavigateToForgotPassword }: LoginPageProps) {
  const { login, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace from inputs
    const email = formData.email.trim().toLowerCase();
    const password = formData.password.trim();

    if (!email || !password) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    // Regular user login only
    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success("লগইন সফল হয়েছে!");
        setTimeout(() => {
          window.location.hash = "dashboard";
        }, 300);
      } else {
        toast.error(result.message || "ইমেইল বা পাসওয়ার্ড ভুল");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("লগইন করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1A3A32] to-[#285046] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute -top-56 -right-56 w-[500px] h-[500px] bg-gradient-to-br from-[#FFB703]/25 via-[#FF8C00]/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-56 -left-56 w-[500px] h-[500px] bg-gradient-to-tr from-[#285046]/30 via-[#2F6057]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-gradient-to-r from-[#FFB703]/10 to-transparent rounded-full blur-3xl"></div>

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Floating light particles */}
        <div className="absolute top-24 left-24 w-2 h-2 bg-[#FFB703] rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-40 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#FFB703]/70 rounded-full animate-ping opacity-50" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back to Home Button */}
      <Button
        onClick={onNavigateToHome}
        variant="ghost"
        className="absolute top-6 left-6 border border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-lg z-20 transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        হোমপেজে ফিরুন
      </Button>

      {/* Main Login Card Container */}
      <div className="w-full max-w-lg relative z-10">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#285046]/30 via-[#FFB703]/20 to-[#285046]/30 rounded-[2rem] blur-2xl opacity-75"></div>

        {/* Main glassmorphic card */}
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2rem] p-10 md:p-12 shadow-2xl border border-white/10">
          {/* Header Section */}
          <div className="text-center mb-10">
            {/* Icon with glow */}
            <div className="relative inline-block mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703] via-[#FF8C00] to-[#FFB703] rounded-3xl blur-2xl opacity-40"></div>
              <div className="relative w-28 h-28 bg-gradient-to-br from-[#285046] via-[#1e4038] to-[#285046] rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
                <Shield className="w-14 h-14 text-white drop-shadow-lg" />
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl text-white mb-4 tracking-tight drop-shadow-lg">
              স্বাগতম!
            </h1>
            <p className="text-white/60 text-lg md:text-xl">
              লগইন করে শুরু করুন আপনার যাত্রা
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Input */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/80 text-base pl-1">
                ইমেইল
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                <Input
                  id="email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="আপনার ইমেইল লিখুন"
                  className="relative pl-14 pr-5 py-7 text-base bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-2xl transition-all duration-300 shadow-lg"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-white/80 text-base pl-1">
                পাসওয়ার্ড
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="আপনার পাসওয়ার্ড লিখুন"
                  className="relative pl-14 pr-14 py-7 text-base bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-2xl transition-all duration-300 shadow-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-all duration-200 z-10"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={onNavigateToForgotPassword}
                  className="text-white/60 hover:text-[#FFB703] text-sm transition-colors duration-200"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="relative w-full bg-gradient-to-r from-[#FFB703] via-[#FFA500] to-[#FFB703] hover:from-[#FFA500] hover:via-[#FFB703] hover:to-[#FFA500] text-white text-lg py-8 rounded-2xl shadow-xl shadow-[#FFB703]/20 hover:shadow-2xl hover:shadow-[#FFB703]/30 transition-all duration-300 border-0 overflow-hidden group"
                style={{ backgroundSize: '200% 100%' }}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  <Lock className="w-6 h-6" />
                  <span>লগইন করুন</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              </Button>
            </div>
          </form>

          {/* Google Login */}
          <div className="pt-2">
            <GoogleLoginButton
              className="bg-white/10 border-white/10 text-white hover:bg-white/20"
              onSuccess={() => {
                window.location.hash = "dashboard";
              }}
            />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-6 bg-transparent text-white/40 text-sm backdrop-blur-sm">অথবা</span>
            </div>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-white/60 text-base">
              নতুন অ্যাকাউন্ট তৈরি করতে চান?{" "}
              <button
                type="button"
                onClick={onNavigateToSignup}
                className="text-[#FFB703] hover:text-[#FFA500] transition-colors duration-200 underline decoration-2 underline-offset-4 decoration-[#FFB703]/50"
              >
                রেজিস্ট্রেশন করুন
              </button>
            </p>
          </div>

          {/* Security Badge */}
          <div className="mt-10 flex items-center justify-center gap-3 text-white/40 text-sm border-t border-white/5 pt-6">
            <Shield className="w-4 h-4" />
            <span>সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড</span>
          </div>
        </div>
      </div>
    </div>
  );
}