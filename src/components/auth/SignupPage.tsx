import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, UserPlus, Mail, Lock, User, Eye, EyeOff, Phone, Shield, ArrowRight, RefreshCw } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { generateOTP, sendRegistrationOTP, initEmailJS } from "../../utils/email";
import { OTPInput } from "../ui/otp-input";
import { GoogleLoginButton } from "./GoogleLoginButton";
import { getUserByEmail } from "../../utils/localStorage";

// Initialize EmailJS
initEmailJS();

interface SignupPageProps {
  onNavigateToLogin: () => void;
  onNavigateToHome: () => void;
}

export function SignupPage({ onNavigateToLogin, onNavigateToHome }: SignupPageProps) {
  const { signup, googleLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [otpExpiry, setOtpExpiry] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup Details Submitted", formData);

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    // Check existing user
    const existingUser = await getUserByEmail(formData.email);
    console.log("Existing user check:", existingUser);
    if (existingUser) {
      toast.error("এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে");
      return;
    }

    setIsSubmitting(true);
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const sent = await sendRegistrationOTP({
      email: formData.email,
      name: formData.name,
      otp: otp
    });

    console.log("OTP Send Result:", sent);

    if (sent) {
      setGeneratedOTP(otp);
      setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 mins
      setStep('otp');
      setTimer(60);
      toast.success("আপনার ইমেইলে ওটিপি পাঠানো হয়েছে");
    } else {
      toast.error("OTP পাঠাতে সমস্যা হয়েছে। ইমেইল ঠিক আছে কিনা দেখুন।");
    }
    setIsSubmitting(false);
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setIsResending(true);

    const otp = generateOTP();
    const sent = await sendRegistrationOTP({
      email: formData.email,
      name: formData.name,
      otp: otp
    });

    if (sent) {
      setGeneratedOTP(otp);
      setOtpExpiry(Date.now() + 5 * 60 * 1000);
      setTimer(60);
      toast.success("নতুন ওটিপি পাঠানো হয়েছে");
    } else {
      toast.error("OTP আবার পাঠাতে সমস্যা হয়েছে");
    }
    setIsResending(false);
  };

  const handleVerifyOTP = async (userEnteredOtp: string) => {
    if (Date.now() > otpExpiry) {
      toast.error("OTP এর মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      return;
    }

    if (userEnteredOtp === generatedOTP) {
      try {
        const result = await signup(formData.name, formData.email, formData.phone, formData.password);

        if (result.success) {
          toast.success("রেজিস্ট্রেশন সফল হয়েছে!");
          setTimeout(() => {
            window.location.hash = "dashboard";
          }, 300);
        } else {
          toast.error(result.message || "সমস্যা হয়েছে");
          setStep('details'); // Go back if failed for some reason
        }
      } catch (error) {
        console.error("Signup error:", error);
        toast.error("রেজিস্ট্রেশন করতে সমস্যা হয়েছে");
      }
    } else {
      toast.error("ভুল OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1A3A32] to-[#285046] flex items-center justify-center p-4 py-8 relative overflow-y-auto overflow-x-hidden">
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

        {/* Floating light particles (keeping them consistent) */}
        <div className="absolute top-24 left-24 w-2 h-2 bg-[#FFB703] rounded-full animate-ping opacity-60"></div>
        <div className="absolute top-1/3 right-40 w-1.5 h-1.5 bg-white/50 rounded-full animate-ping opacity-40" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-[#FFB703]/70 rounded-full animate-ping opacity-50" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute bottom-40 right-1/4 w-1.5 h-1.5 bg-white/40 rounded-full animate-ping opacity-30" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Back to Home Button */}
      <Button
        onClick={onNavigateToHome}
        variant="ghost"
        className="fixed top-6 left-6 border border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-lg z-20 transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        হোমপেজে ফিরুন
      </Button>

      {/* Main Signup Card Container */}
      <div className="w-full max-w-lg relative z-10 my-4">
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#285046]/30 via-[#FFB703]/20 to-[#285046]/30 rounded-[2rem] blur-2xl opacity-75"></div>

        {/* Main glassmorphic card */}
        <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 transition-all duration-500">

          {step === 'details' ? (
            <>
              {/* Header Section */}
              <div className="text-center mb-6">
                {/* Icon with glow */}
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703] via-[#FF8C00] to-[#FFB703] rounded-3xl blur-2xl opacity-40"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#285046] via-[#1e4038] to-[#285046] rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
                    <UserPlus className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>

                <h1 className="text-4xl md:text-5xl text-white mb-2 tracking-tight drop-shadow-lg">
                  রেজিস্ট্রেশন
                </h1>
                <p className="text-white/60 text-base">
                  নতুন অ্যাকাউন্ট তৈরি করুন
                </p>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-white/80 text-sm pl-1">
                    পূর্ণ নাম
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="আপনার পুরো নাম লিখুন"
                      className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 shadow-lg"
                      required
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-white/80 text-sm pl-1">
                    ইমেইল
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="আপনার ইমেইল লিখুন"
                      className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 shadow-lg"
                      required
                    />
                  </div>
                </div>

                {/* Phone Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-white/80 text-sm pl-1">
                    ফোন নাম্বার <span className="text-white/40">(ঐচ্ছিক)</span>
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="০১৭XXXXXXXX"
                      className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 shadow-lg"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-white/80 text-sm pl-1">
                    পাসওয়ার্ড
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="কমপক্ষে ৬ অক্ষর"
                      className="relative pl-11 pr-11 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 shadow-lg"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-all duration-200 z-10"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-white/80 text-sm pl-1">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#285046]/20 to-[#FFB703]/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-[#FFB703] transition-all duration-300 z-10" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl transition-all duration-300 shadow-lg"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="relative w-full bg-gradient-to-r from-[#FFB703] via-[#FFA500] to-[#FFB703] hover:from-[#FFA500] hover:via-[#FFB703] hover:to-[#FFA500] text-white py-6 rounded-2xl shadow-xl shadow-[#FFB703]/20 hover:shadow-2xl hover:shadow-[#FFB703]/30 transition-all duration-300 border-0 overflow-hidden group"
                    style={{ backgroundSize: '200% 100%' }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <span>পরবর্তী ধাপ</span>
                      <ArrowRight className="w-5 h-5" />
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
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-6 bg-transparent text-white/40 text-sm backdrop-blur-sm">অথবা</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-white/60 text-sm">
                  ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className="text-[#FFB703] hover:text-[#FFA500] transition-colors duration-200 underline decoration-2 underline-offset-4 decoration-[#FFB703]/50"
                  >
                    লগইন করুন
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* OTP Verification Step */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703] via-[#FF8C00] to-[#FFB703] rounded-full blur-2xl opacity-40"></div>
                  <div className="relative w-20 h-20 bg-gradient-to-br from-[#285046] via-[#1e4038] to-[#285046] rounded-full flex items-center justify-center shadow-2xl border border-white/10">
                    <Shield className="w-10 h-10 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h2 className="text-3xl text-white mb-2 font-semibold">যাচাইকরণ</h2>
                <p className="text-white/60 text-sm max-w-xs mx-auto">
                  আপনার ইমেইলে ({formData.email}) একটি ৬ সংখ্যার কোড পাঠানো হয়েছে।
                </p>
              </div>

              <div className="space-y-8">
                <OTPInput
                  length={6}
                  onComplete={handleVerifyOTP}
                />

                <div className="text-center space-y-4">
                  <div className="text-white/40 text-sm">
                    কোড পাননি?
                  </div>
                  {timer > 0 ? (
                    <div className="text-white/60 text-sm font-medium">
                      অপেক্ষা করুন ({timer}s)
                    </div>
                  ) : (
                    <Button
                      onClick={handleResendOTP}
                      disabled={isResending}
                      variant="ghost"
                      className="text-[#FFB703] hover:text-[#FFA500] hover:bg-white/5"
                    >
                      {isResending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                      পুনরায় পাঠান
                    </Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep('details')}
                    variant="outline"
                    className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
                  >
                    ফিরে যান
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-white/40 text-xs border-t border-white/5 pt-4">
            <Shield className="w-3.5 h-3.5" />
            <span>সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড</span>
          </div>
        </div>
      </div>
    </div>
  );
}