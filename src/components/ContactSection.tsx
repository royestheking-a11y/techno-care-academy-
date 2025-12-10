import { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { toast } from "sonner";
import { messagesAPI } from "../utils/api";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("সকল তথ্য পূরণ করুন!");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await messagesAPI.create(formData);

      if (response.success) {
        toast.success("মেসেজ সফলভাবে পাঠানো হয়েছে!");
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে!");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("মেসেজ পাঠাতে সমস্যা হয়েছে!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-10 md:py-12 lg:py-16 bg-[#F7FAFC]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1A202C] mb-2 sm:mb-3">যোগাযোগ করুন</h2>
          <p className="text-[#555555] text-base sm:text-lg">আমরা সবসময় আপনার সেবায় প্রস্তুত</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl border-none shadow-lg">
              <h3 className="text-xl sm:text-2xl text-[#1A202C] mb-4 sm:mb-6">মেসেজ পাঠান</h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="আপনার নাম"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#285046] text-sm sm:text-base"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="ইমেইল"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#285046] text-sm sm:text-base"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="মোবাইল নম্বর"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#285046] text-sm sm:text-base"
                  required
                />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="আপনার মেসেজ"
                  rows={5}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#285046] resize-none text-sm sm:text-base"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white rounded-xl py-5 sm:py-6 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  {isSubmitting ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠান"}
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Contact Details */}
            <Card className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border-none shadow-lg">
              <h3 className="text-xl sm:text-2xl text-[#1A202C] mb-4 sm:mb-6">যোগাযোগের তথ্য</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg text-[#1A202C] mb-1">ঠিকানা</h4>
                    <p className="text-sm sm:text-base text-[#555555]">
                      Techno Care Academy, M9X7+GQP, Barishal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                    <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg text-[#1A202C] mb-1">ফোন</h4>
                    <p className="text-sm sm:text-base text-[#555555]">+880 1629-648302</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#285046] to-[#2F6057] flex items-center justify-center">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg text-[#1A202C] mb-1">ইমেইল</h4>
                    <p className="text-xs sm:text-sm md:text-base text-[#555555] break-all">technocareacademy.edu@gmail.com</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map */}
            <Card className="overflow-hidden rounded-xl sm:rounded-2xl border-none shadow-lg">
              <div className="relative h-48 sm:h-56 md:h-64 bg-gray-200">
                <iframe
                  src="https://www.google.com/maps?q=M9X7%2BGQP,+Barishal&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                />
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="text-center mt-8 sm:mt-10 md:mt-12">
          <p className="text-xl sm:text-2xl md:text-3xl text-[#285046] px-4">
            তোমার সাফল্যই আমাদের গর্ব!
          </p>
        </div>
      </div>
    </section>
  );
}
