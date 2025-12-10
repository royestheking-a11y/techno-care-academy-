import { Laptop, Users, MessageCircleQuestion, FileCheck, ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { useState } from "react";
import { ProgramDetailsDialog } from "./ProgramDetailsDialog";
import { OnlineOfflineDialog } from "./OnlineOfflineDialog";
import { QAServiceDialog } from "./QAServiceDialog";

export function ServicesSection() {
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [onlineOfflineDialogOpen, setOnlineOfflineDialogOpen] = useState(false);
  const [qaDialogOpen, setQADialogOpen] = useState(false);

  const services = [
    {
      icon: Laptop,
      title: "Techno Care Academy Program",
      description: "ক্লাস ৯-১০ এবং পলিটেকনিক শিক্ষার্থীদের জন্য বিশেষ প্রোগ্রাম",
      color: "from-[#285046] to-[#2F6057]",
      onClick: () => setProgramDialogOpen(true),
    },
    {
      icon: Users,
      title: "Online & Offline Program",
      description: "অনলাইন এবং অফলাইন উভয় মাধ্যমেই ক্লাস করার সুবিধা",
      color: "from-[#2F6057] to-[#285046]",
      onClick: () => setOnlineOfflineDialogOpen(true),
    },
    {
      icon: MessageCircleQuestion,
      title: "সার্বক্ষণিক Q&A সেবা",
      description: "যেকোনো সমস্যার সমাধান পাবে ২৪/৭ সাপোর্ট টিম থেকে",
      color: "from-[#285046] to-[#2F6057]",
      onClick: () => setQADialogOpen(true),
    },
    {
      icon: FileCheck,
      title: "Free Exam",
      description: "নিয়মিত ফ্রি পরীক্ষা এবং মূল্যায়ন সিস্টেম",
      color: "from-[#285046] to-[#2F6057]",
      onClick: () => {
        window.location.hash = "exams";
      },
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">আমাদের অন্যান্য সেবা সমূহ</h2>
          <p className="text-[#555555] text-lg">শিক্ষার্থীদের জন্য বিশেষ সুবিধা</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <Card className="p-6 rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group cursor-pointer" onClick={service.onClick}>
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <service.icon className="w-8 h-8 text-white animate-pulse" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl text-[#1A202C] mb-2">{service.title}</h3>
                    <p className="text-[#555555] mb-3">{service.description}</p>
                    <button className="text-[#285046] hover:text-[#2F6057] transition-colors flex items-center gap-2 group-hover:gap-3">
                      আরো দেখুন
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      <ProgramDetailsDialog open={programDialogOpen} onOpenChange={setProgramDialogOpen} />
      <OnlineOfflineDialog open={onlineOfflineDialogOpen} onOpenChange={setOnlineOfflineDialogOpen} />
      <QAServiceDialog open={qaDialogOpen} onOpenChange={setQADialogOpen} />
    </section>
  );
}