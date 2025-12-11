import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { MessageCircle, Phone, Mail, Clock, CheckCircle, Users, Headphones, MessageSquare } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface QAServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QAServiceDialog({ open, onOpenChange }: QAServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: ""
  });

  const features = [
    {
      icon: Clock,
      title: "২৪/৭ সাপোর্ট",
      description: "দিন-রাত যেকোনো সময় আপনার প্রশ্নের উত্তর পাবেন"
    },
    {
      icon: Users,
      title: "অভিজ্ঞ টিম",
      description: "বিষয়ভিত্তিক বিশেষজ্ঞদের কাছ থেকে সমাধান"
    },
    {
      icon: MessageSquare,
      title: "দ্রুত রেসপন্স",
      description: "১৫ মিনিটের মধ্যে প্রাথমিক সাড়া"
    },
    {
      icon: Headphones,
      title: "মাল্টি চ্যানেল",
      description: "ফোন, ইমেইল, চ্যাট - সব মাধ্যমে সাপোর্ট"
    }
  ];

  const qaTypes = [
    {
      title: "পড়াশোনা সংক্রান্ত",
      items: [
        "বিষয়ভিত্তিক প্রশ্নের সমাধান",
        "হোমওয়ার্ক হেল্প",
        "পরীক্ষার প্রস্তুতি সাপোর্ট",
        "কনসেপ্ট ক্লিয়ার করা"
      ]
    },
    {
      title: "টেকনিক্যাল সাপোর্ট",
      items: [
        "অ্যাপ/ওয়েবসাইট সমস্যা",
        "লাইভ ক্লাস এক্সেস",
        "ভিডিও রেকর্ডিং",
        "পেমেন্ট সংক্রান্ত"
      ]
    },
    {
      title: "কোর্স সংক্রান্ত",
      items: [
        "ভর্তি প্রক্রিয়া",
        "ক্লাস সময়সূচী",
        "সার্টিফিকেট",
        "কোর্স সিলেকশন"
      ]
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "ফোন করুন",
      value: "+880 1629-648302",
      action: "tel:+8801629648302",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Mail,
      title: "ইমেইল পাঠান",
      value: "technocareacademy.edu@gmail.com",
      action: "mailto:technocareacademy.edu@gmail.com",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MessageCircle,
      title: "লাইভ চ্যাট",
      value: "এখনই চ্যাট শুরু করুন",
      action: "#",
      color: "from-purple-500 to-pink-500"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage
    const messages = JSON.parse(localStorage.getItem("messages") || "[]");
    messages.push({
      id: Date.now(),
      ...formData,
      date: new Date().toISOString(),
      status: "pending"
    });
    localStorage.setItem("messages", JSON.stringify(messages));

    toast.success("আপনার বার্তা পাঠানো হয়েছে! শীঘ্রই আমরা যোগাযোগ করব।");

    // Reset form
    setFormData({
      name: "",
      phone: "",
      email: "",
      subject: "",
      message: ""
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl flex items-center gap-3">
            <MessageCircle className="w-8 h-8 md:w-10 md:h-10 text-[#285046]" />
            সার্বক্ষণিক Q&A সেবা
          </DialogTitle>
          <DialogDescription>
            যেকোনো সমস্যার সমাধান পাবে ২৪/৭ সাপোর্ট টিম থেকে
          </DialogDescription>
        </DialogHeader>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-2 hover:border-[#285046]">
              <div className="p-3 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-xl w-fit mb-3">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg text-[#1A202C] mb-2">{feature.title}</h4>
              <p className="text-sm text-[#555555]">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Q&A Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {qaTypes.map((type, index) => (
            <Card key={index} className="p-6 border-2">
              <h3 className="text-xl text-[#1A202C] mb-4">{type.title}</h3>
              <ul className="space-y-3">
                {type.items.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-[#555555]">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {contactMethods.map((method, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${method.color}`} />
              <div className="p-6 text-center">
                <div className={`p-4 bg-gradient-to-br ${method.color} rounded-full w-fit mx-auto mb-4`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl text-[#1A202C] mb-2">{method.title}</h4>
                <p className="text-sm text-[#555555] mb-4">{method.value}</p>
                <Button
                  className={`w-full bg-gradient-to-r ${method.color} hover:opacity-90 text-white`}
                  onClick={() => {
                    if (method.action !== "#") {
                      window.location.href = method.action;
                    }
                  }}
                >
                  যোগাযোগ করুন
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Form */}
        <Card className="mt-8 p-6 md:p-8 bg-gradient-to-br from-[#F7FAFC] to-white border-2">
          <h3 className="text-2xl md:text-3xl text-[#1A202C] mb-6 text-center">
            আপনার প্রশ্ন লিখে পাঠান
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#1A202C]">আপনার নাম *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="নাম লিখুন"
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#1A202C]">মোবাইল নম্বর *</label>
                <Input
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="০১৭xxxxxxxx"
                  className="border-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#1A202C]">ইমেইল (ঐচ্ছিক)</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#1A202C]">বিষয় *</label>
              <Input
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="আপনার প্রশ্ন বা সমস্যার বিষয়"
                className="border-2"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#1A202C]">বার্তা *</label>
              <Textarea
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="বিস্তারিত লিখুন..."
                className="border-2 min-h-[120px]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] text-white text-lg py-6"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              বার্তা পাঠান
            </Button>
          </form>
        </Card>

        {/* Working Hours */}
        <Card className="mt-6 p-6 bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
          <div className="text-center">
            <Clock className="w-12 h-12 mx-auto mb-3 text-[#FFB703]" />
            <h4 className="text-2xl mb-2">সেবা প্রদানের সময়</h4>
            <p className="text-white/90 text-lg">
              ২৪ ঘণ্টা, ৭ দিন - সপ্তাহজুড়ে আমরা আপনার সেবায় নিয়োজিত
            </p>
            <p className="text-white/80 text-sm mt-2">
              ফোন সাপোর্ট: সকাল ৮টা - রাত ৭টা | অনলাইন চ্যাট: ২৪/৭
            </p>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
