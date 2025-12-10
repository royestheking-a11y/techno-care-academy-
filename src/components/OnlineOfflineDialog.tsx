import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Monitor, Users, Video, Wifi, MapPin, Calendar, CheckCircle, Clock, MessageCircle, FileText } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface OnlineOfflineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnlineOfflineDialog({ open, onOpenChange }: OnlineOfflineDialogProps) {
  const onlineFeatures = [
    {
      icon: Video,
      title: "HD লাইভ ক্লাস",
      description: "উচ্চ মানের ভিডিও স্ট্রিমিং এর মাধ্যমে লাইভ ক্লাস"
    },
    {
      icon: Monitor,
      title: "রেকর্ডেড ক্লাস",
      description: "যেকোনো সময় পুনরায় দেখার সুবিধা"
    },
    {
      icon: MessageCircle,
      title: "লাইভ চ্যাট",
      description: "ক্লাসের সময় সরাসরি প্রশ্ন করার সুবিধা"
    },
    {
      icon: FileText,
      title: "ডিজিটাল নোটস",
      description: "সম্পূর্ণ ডিজিটাল স্টাডি ম্যাটেরিয়াল"
    },
    {
      icon: Wifi,
      title: "যেকোনো স্থান থেকে",
      description: "ঘরে বসে পড়াশোনার সুবিধা"
    },
    {
      icon: Clock,
      title: "সময়ের নমনীয়তা",
      description: "নিজের সুবিধামত সময়ে ক্লাস করুন"
    }
  ];

  const offlineFeatures = [
    {
      icon: Users,
      title: "ক্লাসরুম পরিবেশ",
      description: "ঐতিহ্যবাহী ক্লাসরুম অভিজ্ঞতা"
    },
    {
      icon: MapPin,
      title: "নির্ধারিত সেন্টার",
      description: "ঢাকা ও চট্টগ্রামে আমাদের সেন্টার"
    },
    {
      icon: Users,
      title: "সরাসরি যোগাযোগ",
      description: "শিক্ষকদের সাথে সরাসরি আলোচনা"
    },
    {
      icon: FileText,
      title: "প্রিন্টেড নোটস",
      description: "হার্ড কপি স্টাডি ম্যাটেরিয়াল"
    },
    {
      icon: Calendar,
      title: "নিয়মিত ক্লাস",
      description: "নির্ধারিত সময়সূচী অনুযায়ী ক্লাস"
    },
    {
      icon: Users,
      title: "গ্রুপ স্টাডি",
      description: "সহপাঠীদের সাথে গ্রুপ ডিসকাশন"
    }
  ];

  const hybridBenefits = [
    "অনলাইন এবং অফলাইন উভয় পদ্ধতিতে ক্লাস করার সুবিধা",
    "অফলাইন ক্লাস মিস করলে অনলাইনে রেকর্ডেড ক্লাস দেখুন",
    "সপ্তাহে ৩টি অনলাইন + ২টি অফলাইন ক্লাস",
    "উভয় মাধ্যমেই একই মানের পড়াশোনা",
    "একটি ফি দিয়ে উভয় সুবিধা পাবেন",
    "নমনীয় এবং সুবিধাজনক শিক্ষা পদ্ধতি"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] lg:max-w-[1400px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 md:p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl md:text-4xl flex items-center gap-3">
            <Monitor className="w-8 h-8 md:w-10 md:h-10 text-[#285046]" />
            Online & Offline Program
          </DialogTitle>
          <DialogDescription>
            অনলাইন এবং অফলাইন উভয় মাধ্যমেই ক্লাস করার সুবিধা
          </DialogDescription>
        </DialogHeader>

        {/* Mode Selection Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Online Mode */}
          <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
            <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl text-[#1A202C]">অনলাইন মোড</h3>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <p className="text-sm text-[#555555]">
                  ঘরে বসে লাইভ ক্লাস এবং রেকর্ডেড লেকচার দেখার সুবিধা
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {onlineFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#F7FAFC] hover:bg-blue-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#1A202C] mb-1">{feature.title}</p>
                      <p className="text-xs text-[#555555]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white">
                অনলাইন মোড সিলেক্ট করুন
              </Button>
            </div>
          </Card>

          {/* Offline Mode */}
          <Card className="overflow-hidden border-2 hover:shadow-xl transition-all duration-300">
            <div className="h-3 bg-gradient-to-r from-green-500 to-emerald-500" />
            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl text-[#1A202C]">অফলাইন মোড</h3>
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <MapPin className="w-3 h-3 mr-1" />
                    Physical
                  </Badge>
                </div>
                <p className="text-sm text-[#555555]">
                  আমাদের সেন্টারে সরাসরি ক্লাসরুম পরিবেশে পড়াশোনা
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offlineFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#F7FAFC] hover:bg-green-50 transition-colors">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#1A202C] mb-1">{feature.title}</p>
                      <p className="text-xs text-[#555555]">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-emerald-500 hover:to-green-500 text-white">
                অফলাইন মোড সিলেক্ট করুন
              </Button>
            </div>
          </Card>
        </div>

        {/* Hybrid Mode Section */}
        <Card className="mt-8 overflow-hidden border-2 border-[#285046]">
          <div className="h-3 bg-gradient-to-r from-[#285046] via-purple-500 to-[#FFB703]" />
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <Badge className="mb-3 text-base px-4 py-2 bg-gradient-to-r from-[#285046] to-purple-600 text-white border-0">
                ⭐ সবচেয়ে জনপ্রিয়
              </Badge>
              <h3 className="text-2xl md:text-3xl text-[#1A202C] mb-2">হাইব্রিড মোড</h3>
              <p className="text-[#555555]">অনলাইন এবং অফলাইন উভয় সুবিধা একসাথে</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                {hybridBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#555555]">{benefit}</p>
                  </div>
                ))}
              </div>

              <Card className="p-6 bg-gradient-to-br from-[#285046] to-[#2F6057] text-white">
                <h4 className="text-xl mb-4">সাপ্তাহিক সময়সূচী</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Monitor className="w-5 h-5" />
                    <div>
                      <p className="text-sm">সোম, বুধ, শুক্র</p>
                      <p className="text-xs text-white/80">অনলাইন লাইভ ক্লাস</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Users className="w-5 h-5" />
                    <div>
                      <p className="text-sm">মঙ্গল, বৃহস্পতি</p>
                      <p className="text-xs text-white/80">অফলাইন ক্লাসরুম</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Calendar className="w-5 h-5" />
                    <div>
                      <p className="text-sm">শনিবার</p>
                      <p className="text-xs text-white/80">সাপ্তাহিক পরীক্ষা</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="mt-6 text-center">
              <Button className="bg-gradient-to-r from-[#285046] via-purple-600 to-[#FFB703] hover:from-[#FFB703] hover:via-purple-600 hover:to-[#285046] text-white text-lg px-8 py-6">
                <CheckCircle className="w-5 h-5 mr-2" />
                হাইব্রিড মোড সিলেক্ট করুন
              </Button>
            </div>
          </div>
        </Card>

      </DialogContent>
    </Dialog>
  );
}