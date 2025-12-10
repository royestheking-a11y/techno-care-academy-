import { Users, BookOpen, GraduationCap, Library, Loader2 } from "lucide-react";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { studentsAPI, coursesAPI, teachersAPI, statisticsAPI } from "../utils/api";

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    if (!inView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [inView, end, duration]);

  return (
    <span ref={ref}>
      {count >= 1000 ? (count / 1000).toFixed(1).replace('.0', '') + 'k' : count}+
    </span>
  );
}

export function StatsSection() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      icon: Users,
      title: "Successful Students",
      number: 712,
      color: "from-[#285046] to-[#2F6057]",
    },
    {
      icon: BookOpen,
      title: "Total Courses",
      number: 10,
      color: "from-[#2F6057] to-[#285046]",
    },
    {
      icon: GraduationCap,
      title: "Experienced Teachers",
      number: 50,
      color: "from-[#285046] to-[#2F6057]",
    },
    {
      icon: Library,
      title: "Total Subjects",
      number: 80,
      color: "from-[#285046] to-[#2F6057]",
    },
  ]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [students, courses, teachers, institutes] = await Promise.all([
        import("../utils/localStorage").then(m => m.getStudents()),
        import("../utils/localStorage").then(m => m.getCourses()),
        import("../utils/localStorage").then(m => m.getTeachers()),
        import("../utils/localStorage").then(m => m.getInstitutes()),
      ]);

      // Base values + real data for marketing display
      const BASE_STUDENTS = 2000;
      const BASE_COURSES = 40;
      const BASE_TEACHERS = 40;
      const BASE_INSTITUTES = 20;

      setStats([
        {
          icon: Users,
          title: "Successful Students",
          number: BASE_STUDENTS + students.length,
          color: "from-[#285046] to-[#2F6057]",
        },
        {
          icon: BookOpen,
          title: "Total Courses",
          number: BASE_COURSES + courses.length,
          color: "from-[#2F6057] to-[#285046]",
        },
        {
          icon: GraduationCap,
          title: "Experienced Teachers",
          number: BASE_TEACHERS + teachers.length,
          color: "from-[#285046] to-[#2F6057]",
        },
        {
          icon: Library,
          title: "Affiliated Institutes",
          number: BASE_INSTITUTES + institutes.length,
          color: "from-[#285046] to-[#2F6057]",
        },
      ]);
    } catch (error) {
      console.warn("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gradient-to-br from-[#285046] to-[#2F6057]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-white" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-[#285046] to-[#2F6057] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-32 h-32 border-4 border-white rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-4 border-white rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl text-white mb-3">একনজরে Techno Care Academy</h2>
          <p className="text-white/90 text-lg">আমাদের সাফল্যের গল্প</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring" }}
            >
              <Card className="p-6 rounded-2xl border-none shadow-2xl hover:shadow-3xl transition-all bg-white group hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-20 h-20 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-4xl md:text-5xl text-[#1A202C] mb-2">
                    <Counter end={stat.number} />
                  </h3>
                  <p className="text-[#555555]">{stat.title}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}