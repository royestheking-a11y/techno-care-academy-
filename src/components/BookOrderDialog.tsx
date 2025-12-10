import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Loader2, CheckCircle2, Package, Truck } from "lucide-react";
import { toast } from "sonner";
import { ordersAPI } from "../utils/api";

interface BookOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book: any;
}

import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function BookOrderDialog({ open, onOpenChange, book }: BookOrderDialogProps) {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [location, setLocation] = useState("barisal"); // 'barisal' or 'outside'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    if (open && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || ""
      }));
    }
  }, [open, user]);

  // Parse book price (remove ৳ symbol and convert to number)
  const getBookPrice = () => {
    if (typeof book?.price === 'string') {
      return parseInt(book.price.replace(/[^0-9]/g, '')) || 0;
    }
    return book?.price || 0;
  };

  const bookPrice = getBookPrice();
  const deliveryCharge = location === "barisal" ? 50 : 110;
  const totalPrice = bookPrice + deliveryCharge;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("সকল তথ্য পূরণ করুন!");
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("বই অর্ডার করতে দয়া করে লগইন করুন");
      return;
    }

    try {
      setLoading(true);
      const orderData = {
        id: Date.now().toString(),
        userId: user.id,
        bookId: book.id,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookPrice: bookPrice,
        quantity: 1,
        customerName: formData.name,
        customerEmail: user.email,
        customerPhone: formData.phone,
        address: formData.address,
        deliveryMethod: "Cash on Delivery",
        deliveryCharge: deliveryCharge,
        totalPrice: totalPrice,
        status: 'pending' as const,
        createdAt: new Date().toISOString(),
        deliveryLocation: location === "barisal" ? "Inside Barisal City" : "Outside Barisal City"
      };

      const response = await ordersAPI.create(orderData as any);

      if (response.success) {
        setSuccess(true);
        toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে!");

        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({ name: "", phone: "", address: "" });
          setLocation("barisal");
          setSuccess(false);
          onOpenChange(false);
        }, 3000);
      } else {
        toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("অর্ডার সম্পন্ন করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", phone: "", address: "" });
      setLocation("barisal");
      setSuccess(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#285046]">বই অর্ডার করুন</DialogTitle>
          <DialogDescription>
            {book?.title} অর্ডার করতে নিচের তথ্য পূরণ করুন
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-20 h-20 text-green-500" />
            <h3 className="text-2xl text-[#1A202C]">অর্ডার নিশ্চিত!</h3>
            <p className="text-center text-[#555555]">
              আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে। শীঘ্রই আমাদের পক্ষ থেকে যোগাযোগ করা হবে।
            </p>
            <div className="bg-[#F7FAFC] p-4 rounded-xl w-full">
              <p className="text-sm text-[#555555] text-center">
                অর্ডার নং: #{Date.now().toString().slice(-6)}
              </p>
              <p className="text-sm text-[#555555] text-center mt-2">
                ২-৩ কর্মদিবসের মধ্যে আপনার বই পৌঁছে যাবে।
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white p-4 rounded-xl">
              <h4 className="text-lg mb-1">{book?.title}</h4>
              <p className="text-sm opacity-90">লেখক: {book?.author}</p>
              <p className="text-lg mt-2">মূল্য: ৳{bookPrice}</p>
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
              <Label htmlFor="address">সম্পূর্ণ ঠিকানা *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="বাসা/ফ্ল্যাট নং, রোড নং, এলাকা, জেলা"
                rows={3}
                required
              />
            </div>

            <div className="space-y-3">
              <Label>ডেলিভারি লোকেশন *</Label>
              <RadioGroup value={location} onValueChange={setLocation}>
                <div className="flex items-center space-x-3 border-2 border-[#285046] rounded-xl p-4 cursor-pointer hover:bg-[#F7FAFC] transition-colors relative">
                  <RadioGroupItem value="barisal" id="barisal" />
                  <Label htmlFor="barisal" className="flex-1 cursor-pointer flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#285046]" />
                    <div>
                      <p className="text-[#1A202C]">বরিশাল সিটির মধ্যে</p>
                      <p className="text-sm text-[#555555]">ডেলিভারি চার্জ: ৳৫০</p>
                    </div>
                  </Label>
                  {location === "barisal" && <CheckCircle2 className="w-5 h-5 text-[#285046] absolute right-4 top-1/2 -translate-y-1/2" />}
                </div>
                <div className="flex items-center space-x-3 border-2 border-[#285046] rounded-xl p-4 cursor-pointer hover:bg-[#F7FAFC] transition-colors relative">
                  <RadioGroupItem value="outside" id="outside" />
                  <Label htmlFor="outside" className="flex-1 cursor-pointer flex items-center gap-3">
                    <Truck className="w-5 h-5 text-[#285046]" />
                    <div>
                      <p className="text-[#1A202C]">বরিশাল সিটির বাইরে</p>
                      <p className="text-sm text-[#555555]">ডেলিভারি চার্জ: ৳১১০</p>
                    </div>
                  </Label>
                  {location === "outside" && <CheckCircle2 className="w-5 h-5 text-[#285046] absolute right-4 top-1/2 -translate-y-1/2" />}
                </div>
              </RadioGroup>
              <p className="text-xs text-blue-600 font-medium px-1">* পেমেন্ট মেথড: ক্যাশ অন ডেলিভারি (Cash on Delivery)</p>
            </div>

            <div className="bg-[#F7FAFC] p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-[#555555]">বইয়ের মূল্য</span>
                <span className="text-[#1A202C]">৳{bookPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#555555]">ডেলিভারি চার্জ</span>
                <span className="text-[#1A202C]">৳{deliveryCharge}</span>
              </div>
              <div className="border-t-2 border-[#285046] pt-2 flex justify-between">
                <span className="text-lg text-[#285046]">সর্বমোট</span>
                <span className="text-lg text-[#285046]">৳{totalPrice}</span>
              </div>
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
                    প্রক্রিয়াকরণ...
                  </>
                ) : (
                  "অর্ডার নিশ্চিত করুন"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
