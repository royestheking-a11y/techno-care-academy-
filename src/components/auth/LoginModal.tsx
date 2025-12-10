import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Mail, Lock, Loader2, Eye, EyeOff, LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignup: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ open, onOpenChange, onSwitchToSignup, onLoginSuccess }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, googleLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    setLoading(true);
    const result = await login(email, password, () => {
      // Redirect to dashboard on successful login
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      onOpenChange(false);
      setEmail("");
      setPassword("");
      setShowPassword(false);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] p-0 gap-0 border-0 overflow-hidden bg-white max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>লগইন করুন</DialogTitle>
          <DialogDescription id="login-description">
            আপনার একাউন্টে প্রবেশ করুন এবং শেখা শুরু করুন
          </DialogDescription>
        </DialogHeader>

        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-br from-[#285046] via-[#2F6057] to-[#285046] pt-8 pb-12 px-6 sm:px-8">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFB703] opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 text-center text-white space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-1.5">
              <ShieldCheck className="w-7 h-7 text-[#FFB703]" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">স্বাগতম!</h2>
            <p className="text-white/80 text-sm max-w-xs mx-auto">
              আপনার একাউন্টে প্রবেশ করুন এবং শেখা শুরু করুন
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="px-6 sm:px-8 py-6 -mt-6 relative z-20 bg-white rounded-t-3xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1A202C] text-sm">
                ইমেইল অ্যাড্রেস
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="pl-11 h-11 border-gray-200 focus:border-[#285046] focus:ring-2 focus:ring-[#285046]/20 rounded-xl transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#1A202C] text-sm">
                  পাসওয়ার্ড
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false);
                    // Use a timeout to allow the modal close animation to finish or start immediately
                    setTimeout(() => {
                      window.location.hash = "forgot-password";
                    }, 100);
                  }}
                  className="text-xs text-[#285046] hover:text-[#2F6057] hover:underline transition-colors"
                >
                  ভুলে গেছেন?
                </button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-11 pr-11 h-11 border-gray-200 focus:border-[#285046] focus:ring-2 focus:ring-[#285046]/20 rounded-xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#285046] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  অপেক্ষা করুন...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  লগইন করুন
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">অথবা</span>
              </div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center w-full mb-6">
              <GoogleLoginButton
                onSuccess={() => {
                  onOpenChange(false);
                  if (onLoginSuccess) onLoginSuccess();
                }}
              />
            </div>

            {/* Signup Link */}
            <div className="text-center">
              <p className="text-sm text-[#555555]">
                নতুন ব্যবহারকারী?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-[#285046] hover:text-[#2F6057] hover:underline transition-colors"
                >
                  একাউন্ট তৈরি করুন
                </button>
              </p>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}