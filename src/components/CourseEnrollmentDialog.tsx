import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { enrollmentsAPI } from "../utils/api";

interface CourseEnrollmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: any;
}

import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function CourseEnrollmentDialog({ open, onOpenChange, course }: CourseEnrollmentDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    class: "",
    address: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.class || !formData.address) {
      toast.error("সকল তথ্য পূরণ করুন!");
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("ভর্তি হতে দয়া করে লগইন করুন");
      return;
    }

    try {
      setLoading(true);
      const enrollmentData = {
        id: Date.now().toString(),
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        courseDuration: course.duration,
        coursePrice: course.price || "N/A",
        studentName: formData.name,
        studentEmail: user.email,
        studentPhone: formData.phone,
        class: formData.class,
        address: formData.address,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      const response = await enrollmentsAPI.create(enrollmentData as any);

      if (response.success) {
        setSuccess(true);
        toast.success("ভর্তির আবেদন সফলভাবে জমা হয়েছে!");

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: "", phone: "", class: "", address: "" });
          setSuccess(false);
          onOpenChange(false);
        }, 3000);
      } else {
        toast.error("আবেদন জমা দিতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error submitting enrollment:", error);
      toast.error("আবেদন জমা দিতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", phone: "", class: "", address: "" });
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#285046]">কোর্সে ভর্তি হন</DialogTitle>
          <DialogDescription>
            {course?.title} কোর্সে ভর্তির জন্য নিচের তথ্য পূরণ করুন
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
            <h3 className="text-2xl text-[#1A202C]">ভর্তি সম্পন্ন!</h3>
            <p className="text-center text-[#555555]">
              আপনার ভর্তির আবেদন সফলভাবে জমা হয়েছে। শীঘ্রই আমাদের পক্ষ থেকে যোগাযোগ করা হবে।
            </p>
            <div className="bg-[#F7FAFC] p-4 rounded-xl w-full">
              <p className="text-sm text-[#555555] text-center">
                অনুগ্রহ করে আপনার ফোন চালু রাখুন। আমরা শীঘ্রই নিশ্চিতকরণ বার্তা এবং ক্লাসের সময়সূচী জানাব।
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white p-4 rounded-xl">
              <h4 className="text-lg mb-1">{course?.title}</h4>
              <p className="text-sm opacity-90">সময়কাল: {course?.duration}</p>
              {course?.price && <p className="text-sm opacity-90">মূল্য: {course.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">আপনার নাম *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="যেমন: মোহাম্মদ রহিম"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">মোবাইল নম্বর *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="যেমন: 01712345678"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">বর্তমান শ্রেণি *</Label>
              <Input
                id="class"
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                placeholder="যেমন: নবম শ্রেণি"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">ঠিকানা *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="আপনার সম্পূর্ণ ঠিকানা লিখুন"
                rows={3}
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loading}
              >
                বাতিল
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    জমা হচ্ছে...
                  </>
                ) : (
                  "ভর্তি নিশ্চিত করুন"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
