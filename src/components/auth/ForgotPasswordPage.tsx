
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Shield, CheckCircle2, ArrowRight, RefreshCw, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { generateOTP, sendPasswordResetOTP, initEmailJS } from "../../utils/email";
import { OTPInput } from "../ui/otp-input";
import { getUserByEmail, updateUser } from "../../utils/localStorage";

// Initialize EmailJS
initEmailJS();

interface ForgotPasswordPageProps {
    onNavigateToLogin: () => void;
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
    const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
    const [email, setEmail] = useState("");
    const [generatedOTP, setGeneratedOTP] = useState("");
    const [otpExpiry, setOtpExpiry] = useState(0);
    const [isResending, setIsResending] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

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

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("অনুগ্রহ করে আপনার ইমেইল দিন");
            return;
        }

        setIsSubmitting(true);

        // Check if user exists
        const user = await getUserByEmail(email);
        if (!user) {
            // Security best practice: Don't reveal if user exists or not, but for this app we might be more direct
            // Or we can just pretend to send (but here we want to block invalid emails)
            toast.error("এই ইমেইল দিয়ে কোন একাউন্ট পাওয়া যায়নি");
            setIsSubmitting(false);
            return;
        }

        // Generate and Send OTP
        const otp = generateOTP();
        const sent = await sendPasswordResetOTP({
            email: email,
            name: user.name, // We know the name now
            otp: otp
        });

        if (sent) {
            setGeneratedOTP(otp);
            setOtpExpiry(Date.now() + 5 * 60 * 1000);
            setStep('otp');
            setTimer(60);
            toast.success("আপনার ইমেইলে একটি ওটিপি পাঠানো হয়েছে");
        } else {
            toast.error("OTP পাঠাতে সমস্যা হয়েছে।");
        }
        setIsSubmitting(false);
    };

    const handleResendOTP = async () => {
        if (timer > 0) return;
        setIsResending(true);

        // Check user again just to get details (though email check passed)
        const user = await getUserByEmail(email);
        if (!user) { setIsResending(false); return; }

        const otp = generateOTP();
        const sent = await sendPasswordResetOTP({
            email: email,
            name: user.name,
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
            toast.success("যাচাইকরণ সফল হয়েছে");
            setStep('password');
        } else {
            toast.error("ভুল OTP");
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("পাসওয়ার্ড মিলছে না");
            return;
        }

        const user = await getUserByEmail(email);
        if (user) {
            updateUser(user.id, { password: newPassword });
            toast.success("আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে");
            setTimeout(() => {
                onNavigateToLogin();
            }, 1500);
        } else {
            toast.error("কিছু একটা সমস্যা হয়েছে, আবার চেষ্টা করুন");
            setStep('email');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#1A3A32] to-[#285046] flex items-center justify-center p-4 py-8 relative overflow-y-auto overflow-x-hidden">
            {/* Premium Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large gradient orbs - re-using signup/login theme */}
                <div className="absolute -top-56 -right-56 w-[500px] h-[500px] bg-gradient-to-br from-[#FFB703]/25 via-[#FF8C00]/15 to-transparent rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-56 -left-56 w-[500px] h-[500px] bg-gradient-to-tr from-[#285046]/30 via-[#2F6057]/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            {/* Back Button */}
            <Button
                onClick={onNavigateToLogin}
                variant="ghost"
                className="fixed top-6 left-6 border border-white/15 text-white/90 hover:bg-white/10 hover:border-white/30 hover:text-white backdrop-blur-lg z-20 transition-all duration-300 shadow-lg"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                লগইনে ফিরুন
            </Button>

            {/* Main Card */}
            <div className="w-full max-w-lg relative z-10 my-4">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#285046]/30 via-[#FFB703]/20 to-[#285046]/30 rounded-[2rem] blur-2xl opacity-75"></div>

                <div className="relative bg-white/5 backdrop-blur-3xl rounded-[2rem] p-8 md:p-10 shadow-2xl border border-white/10 transition-all duration-500">

                    <div className="text-center mb-8">
                        <div className="relative inline-block mb-4">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FFB703] via-[#FF8C00] to-[#FFB703] rounded-3xl blur-2xl opacity-40"></div>
                            <div className="relative w-20 h-20 bg-gradient-to-br from-[#285046] via-[#1e4038] to-[#285046] rounded-3xl flex items-center justify-center shadow-2xl border border-white/10">
                                <KeyRound className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                        </div>

                        <h1 className="text-3xl md:text-4xl text-white mb-2 tracking-tight drop-shadow-lg">
                            {step === 'email' && "পাসওয়ার্ড রিসেট"}
                            {step === 'otp' && "যাচাইকরণ"}
                            {step === 'password' && "নতুন পাসওয়ার্ড"}
                        </h1>
                        <p className="text-white/60 text-sm max-w-xs mx-auto">
                            {step === 'email' && "আপনার অ্যাকাউন্টের ইমেইল দিন"}
                            {step === 'otp' && `আমরা ${email} এ একটি কোড পাঠিয়েছি`}
                            {step === 'password' && "আপনার অ্যাকাউন্টের জন্য নতুন পাসওয়ার্ড সেট করুন"}
                        </p>
                    </div>

                    {step === 'email' && (
                        <form onSubmit={handleEmailSubmit} className="space-y-6">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-white/80 text-sm pl-1">ইমেইল</Label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="আপনার ইমেইল লিখুন"
                                        className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 focus:bg-white/10 text-white placeholder:text-white/30 rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-gradient-to-r from-[#FFB703] via-[#FFA500] to-[#FFB703] text-white py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : "কোড পাঠান"}
                            </Button>
                        </form>
                    )}

                    {step === 'otp' && (
                        <div className="space-y-8">
                            <OTPInput length={6} onComplete={handleVerifyOTP} />
                            <div className="text-center space-y-4">
                                {timer > 0 ? (
                                    <div className="text-white/60 text-sm">অপেক্ষা করুন ({timer}s)</div>
                                ) : (
                                    <Button
                                        onClick={handleResendOTP}
                                        disabled={isResending}
                                        variant="ghost"
                                        className="text-[#FFB703] hover:text-[#FFA500]"
                                    >
                                        {isResending ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
                                        পুনরায় পাঠান
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'password' && (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-white/80 text-sm pl-1">নতুন পাসওয়ার্ড</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="কমপক্ষে ৬ অক্ষর"
                                        className="relative pl-11 pr-11 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 text-white rounded-xl"
                                        required
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 z-10">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-white/80 text-sm pl-1">পাসওয়ার্ড নিশ্চিত করুন</Label>
                                <div className="relative group">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 z-10" />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                                        className="relative pl-11 pr-4 py-5 text-sm bg-white/5 border-2 border-white/10 focus:border-[#FFB703]/50 text-white rounded-xl"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="pt-2">
                                <Button type="submit" className="w-full bg-gradient-to-r from-[#FFB703] via-[#FFA500] to-[#FFB703] text-white py-6 rounded-2xl shadow-xl">
                                    পাসওয়ার্ড পরিবর্তন করুন
                                </Button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}
