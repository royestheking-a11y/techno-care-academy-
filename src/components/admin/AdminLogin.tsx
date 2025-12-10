import { useState } from "react";
import { Lock, User, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple authentication (in production, use proper authentication)
    if (username === "technocare" && password === "technocare03") {
      localStorage.setItem("adminLoggedIn", "true");
      onLogin();
      toast.success("সফলভাবে লগইন হয়েছে!");
    } else {
      toast.error("ভুল ইউজারনেম বা পাসওয়ার্ড!");
    }
  };

  const handleBackToWebsite = () => {
    // Clear the hash to go back to main website
    window.location.hash = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#285046] via-[#2F6057] to-[#285046] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-none shadow-2xl relative">
        {/* Back to Website Button - Top Right */}
        <button
          onClick={handleBackToWebsite}
          className="absolute top-4 right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center group"
          aria-label="Back to website"
          title="ওয়েবসাইটে ফিরুন"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-[#285046] group-hover:rotate-90 transition-transform duration-300" />
        </button>

        <CardHeader className="space-y-1 text-center pb-8 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-[#1A202C]">
            Techno Care Academy
          </CardTitle>
          <p className="text-[#555555] text-sm sm:text-base">অ্যাডমিন প্যানেল লগইন</p>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">ইউজারনেম</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="ইউজারনেম লিখুন"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">পাসওয়ার্ড</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:shadow-lg text-base sm:text-lg py-5 sm:py-6"
            >
              লগইন করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
