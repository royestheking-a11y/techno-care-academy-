import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getInstitutes, Institute } from "../utils/localStorage";

export function PolytechnicSection() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);

  useEffect(() => {
    getInstitutes().then(setInstitutes);

    const handleStorageChange = () => {
      getInstitutes().then(setInstitutes);
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('institutes-update', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('institutes-update', handleStorageChange);
    };
  }, []);


  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-[#1A202C] mb-3">ইনস্টিটিউট সমূহ</h2>
          <p className="text-[#555555] text-lg">দেশের প্রধান ইনস্টিটিউট সম্পর্কে জানুন</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {institutes.map((institute, index) => (
            <motion.div
              key={institute.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden rounded-2xl border-none shadow-lg hover:shadow-2xl transition-all group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={institute.image}
                    alt={institute.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white text-lg mb-1">{institute.name}</h3>
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{institute.location}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <Button
                    variant="outline"
                    onClick={() => window.open(institute.website || "#", "_blank")}
                    className="w-full border-2 border-[#285046] text-[#285046] hover:bg-[#285046] hover:text-white rounded-xl"
                  >
                    আরো দেখুন
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.location.hash = 'institutes'}
            className="bg-gradient-to-r from-[#285046] to-[#2F6057] text-white px-8 py-6 rounded-full hover:shadow-xl transition-all text-lg"
          >
            সকল ইনস্টিটিউট দেখুন
          </Button>
        </div>
      </div>
    </section>
  );
}