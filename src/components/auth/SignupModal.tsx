import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Mail, Lock, User, Phone, Loader2, Eye, EyeOff, UserPlus, Sparkles, RefreshCw, KeyRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "sonner";
import { generateOTP, sendRegistrationOTP } from "../../utils/email";
import { OTPInput } from "../ui/otp-input";
import { GoogleLoginButton } from "./GoogleLoginButton";

interface SignupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  onSignupSuccess?: () => void;
}

export function SignupModal({ open, onOpenChange, onSwitchToLogin, onSignupSuccess }: SignupModalProps) {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP State
  const [generatedOTP, setGeneratedOTP] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup, googleLogin } = useAuth();

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

    if (!name || !email || !phone || !password || !confirmPassword) {
      toast.error("সকল তথ্য পূরণ করুন");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না");
      return;
    }

    if (password.length < 6) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
      return;
    }

    // Send OTP
    setLoading(true);
    const otp = generateOTP();
    const sent = await sendRegistrationOTP({
      email,
      name,
      otp
    });

    setLoading(false);

    if (sent) {
      setGeneratedOTP(otp);
      setStep('otp');
      setTimer(60); // 1 minute cooldown
      toast.success("আপনার ইমেইলে একটি ভেরিফিকেশন কোড পাঠানো হয়েছে");
    } else {
      toast.error("OTP পাঠাতে সমস্যা হয়েছে। ইমেইলটি সঠিক কিনা চেক করুন।");
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    setIsResending(true);

    const otp = generateOTP();
    const sent = await sendRegistrationOTP({
      email,
      name,
      otp
    });

    if (sent) {
      setGeneratedOTP(otp);
      setTimer(60);
      toast.success("নতুন কোড পাঠানো হয়েছে");
    } else {
      toast.error("কোড পাঠাতে সমস্যা হয়েছে");
    }
    setIsResending(false);
  };

  const handleOTPSubmit = async (userEnteredOtp: string) => {
    if (userEnteredOtp === generatedOTP) {
      // Proceed with signup
      setLoading(true);
      const result = await signup(name, email, phone, password, () => {
        if (onSignupSuccess) {
          onSignupSuccess();
        }
      });
      setLoading(false);

      if (result.success) {
        toast.success("অ্যাকাউন্ট সফলভাবে ভেরিফাই এবং তৈরি হয়েছে!");
        onOpenChange(false);
        // Reset state
        setName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setStep('details');
        setGeneratedOTP("");
      } else {
        toast.error(result.message);
      }
    } else {
      toast.error("ভুল কোড। আবার চেষ্টা করুন।");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[420px] p-0 gap-0 border-0 overflow-hidden bg-white max-h-[90vh] flex flex-col"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>একাউন্ট তৈরি করুন</DialogTitle>
          <DialogDescription id="signup-description">
            Techno Care Academy-তে যোগ দিন এবং নিজের শিক্ষা যাত্রা শুরু করুন
          </DialogDescription>
        </DialogHeader>

        {/* Header Section with Gradient */}
        <div className="relative bg-gradient-to-br from-[#285046] via-[#2F6057] to-[#285046] pt-6 pb-10 px-6 sm:px-8 shrink-0">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-[#FFB703] opacity-10 rounded-full blur-2xl"></div>

          <div className="relative z-10 text-center text-white space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl mb-1">
              {step === 'details' ? (
                <Sparkles className="w-6 h-6 text-[#FFB703]" />
              ) : (
                <KeyRound className="w-6 h-6 text-[#FFB703]" />
              )}
            </div>
            <h2 className="text-xl sm:text-2xl">
              {step === 'details' ? "শুরু করুন আজই!" : "ইমেইল ভেরিফিকেশন"}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm max-w-sm mx-auto">
              {step === 'details'
                ? "হাজার হাজার শিক্ষার্থীর সাথে যুক্ত হয়ে শিক্ষা যাত্রা শুরু করুন"
                : `আমরা ${email} এ একটি ৬ ডিজিটের কোড পাঠিয়েছি`}
            </p>
          </div>
        </div>

        {/* Form Section - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-6 sm:px-8 py-6 pb-20 -mt-6 relative z-20 bg-white rounded-t-3xl min-h-full">

            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-3.5">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1A202C] text-sm">
                    পূর্ণ নাম
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="আপনার পূর্ণ নাম লিখুন"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={loading}
                      className="pl-11 h-11 border-gray-200 focus:border-[#285046] focus:ring-2 focus:ring-[#285046]/20 rounded-xl transition-all"
                    />
                  </div>
                </div>

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

                {/* Phone Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1A202C] text-sm">
                    মোবাইল নম্বর
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={loading}
                      className="pl-11 h-11 border-gray-200 focus:border-[#285046] focus:ring-2 focus:ring-[#285046]/20 rounded-xl transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#1A202C] text-sm">
                    পাসওয়ার্ড
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="কমপক্ষে ৬ অক্ষর"
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#1A202C] text-sm">
                    পাসওয়ার্ড নিশ্চিত করুন
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#285046] transition-colors pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={loading}
                      className="pl-11 pr-11 h-11 border-gray-200 focus:border-[#285046] focus:ring-2 focus:ring-[#285046]/20 rounded-xl transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#285046] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="text-xs text-gray-500 space-y-1 px-1">
                  <p className={password.length >= 6 ? "text-green-600" : ""}>
                    • কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড ব্যবহার করুন
                  </p>
                  <p className={password && confirmPassword && password === confirmPassword ? "text-green-600" : ""}>
                    • উভয় পাসওয়ার্ড মিলতে হবে
                  </p>
                </div>

                {/* Signup Button */}
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
                      <UserPlus className="w-5 h-5 mr-2" />
                      একাউন্ট তৈরি করুন (OTP)
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
                      if (onSignupSuccess) onSignupSuccess();
                    }}
                  />
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ইতিমধ্যে একাউন্ট আছে?{" "}
                    <button
                      type="button"
                      onClick={() => {
                        onOpenChange(false);
                        setTimeout(() => onSwitchToLogin(), 100);
                      }}
                      className="text-[#285046] hover:text-[#2F6057] hover:underline transition-colors"
                    >
                      লগইন করুন
                    </button>
                  </p>
                </div>

                {/* Benefits Info */}
                <div className="rounded-xl bg-gradient-to-br from-[#F7FAFC] to-[#E8F4F1] p-4 border border-[#285046]/10 mt-6">
                  <p className="text-xs text-gray-600 mb-3">একাউন্ট তৈরি করে পাবেন:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#285046] mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">প্রিমিয়াম কোর্স</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#285046] mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">লাইভ ক্লাস</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#285046] mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">স্টাডি নোটস</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#285046] mt-1.5 flex-shrink-0"></div>
                      <p className="text-xs text-gray-700">এক্সপার্ট সাপোর্ট</p>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6 pt-2">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">
                    নিরাপত্তার স্বার্থে আপনার ইমেইল ভেরিফাই করা জরুরি।
                  </p>
                </div>

                <OTPInput
                  length={6}
                  onComplete={handleOTPSubmit}
                  inputClassName="bg-white border-gray-200 text-gray-800 focus:border-[#285046] focus:bg-white focus:text-[#285046] focus:shadow-[#285046]/10 placeholder-gray-300"
                />

                <div className="text-center space-y-4 pt-4">
                  {loading && <p className="text-sm text-[#285046]">যাচাই করা হচ্ছে...</p>}

                  {timer > 0 ? (
                    <div className="text-gray-500 text-sm">নতুন কোড রিকোয়েস্ট করতে পারবেন ({timer}s)</div>
                  ) : (
                    <Button
                      onClick={handleResendOTP}
                      disabled={isResending}
                      variant="ghost"
                      className="text-[#285046] hover:text-[#2F6057]"
                    >
                      {isResending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                      পুনরায় কোড পাঠান
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => setStep('details')}
                  className="w-full mt-4"
                >
                  তথ্য পরিবর্তন করুন
                </Button>
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}