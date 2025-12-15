import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { coursesAPI, schedulesAPI, booksAPI, teachersAPI, polytechnicInstitutesAPI, notesAPI, liveClassesAPI } from "../utils/api";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface KnowledgeBase {
  courses: any[];
  schedules: any[];
  books: any[];
  teachers: any[];
  polytechnics: any[];
  notes: any[];
  liveClasses: any[];
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [knowledge, setKnowledge] = useState<KnowledgeBase>({
    courses: [],
    schedules: [],
    books: [],
    teachers: [],
    polytechnics: [],
    notes: [],
    liveClasses: [],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      addBotMessage(
        "আসসালামু আলাইকুম!\n\nআমি Techno Care Academy এর স্মার্ট সহায়ক। আমি আপনাকে সাহায্য করতে পারি:\n\n• কোর্স এবং ব্যাচের তথ্য\n• বই, দাম এবং স্টক তথ্য\n• ক্লাস সময়সূচী\n• নোট এবং সাজেশন\n• লাইভ ক্লাস\n• শিক্ষকদের তথ্য\n• পলিটেকনিক ইন্সটিটিউট\n• যোগাযোগ এবং ঠিকানা\n\nআপনার কোন প্রশ্ন আছে?"
      );
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchAllData = async () => {
    try {
      const [coursesRes, schedulesRes, booksRes, teachersRes, polytechnicsRes, notesRes, liveClassesRes] = await Promise.all([
        coursesAPI.getAll(),
        schedulesAPI.getAll(),
        booksAPI.getAll(),
        teachersAPI.getAll(),
        polytechnicInstitutesAPI.getAll(),
        notesAPI.getAll(),
        liveClassesAPI.getAll(),
      ]);

      setKnowledge({
        courses: coursesRes.success ? coursesRes.data : [],
        schedules: schedulesRes.success ? schedulesRes.data : [],
        books: booksRes.success ? booksRes.data : [],
        teachers: teachersRes.success ? teachersRes.data : [],
        polytechnics: polytechnicsRes.success ? polytechnicsRes.data : [],
        notes: notesRes.success ? notesRes.data : [],
        liveClasses: liveClassesRes.success ? liveClassesRes.data : [],
      });
    } catch (error) {
      console.warn("Error fetching knowledge base:", error);
    }
  };

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const generateIntelligentResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();

    // === COURSE RELATED QUERIES ===
    if (msg.includes("ssc") || msg.includes("এসএসসি")) {
      const sscCourses = knowledge.courses.filter(c =>
        c.title?.toLowerCase().includes("ssc") ||
        c.title?.toLowerCase().includes("এসএসসি") ||
        c.title?.toLowerCase().includes("class 9") ||
        c.title?.toLowerCase().includes("class 10") ||
        c.title?.toLowerCase().includes("নবম") ||
        c.title?.toLowerCase().includes("দশম")
      );

      if (sscCourses.length > 0) {
        let response = "📚 SSC সংক্রান্ত কোর্সসমূহ:\n\n";
        sscCourses.forEach((course, i) => {
          response += `${i + 1}. ${course.title}\n`;
          if (course.description) response += `   📝 ${course.description}\n`;
          if (course.duration) response += `   ⏱️ সময়কাল: ${course.duration}\n`;
          if (course.enrolled) response += `   👥 ${course.enrolled} শিক্ষার্থী ভর্তি\n`;
          if (course.price) response += `   💰 ফি: ৳${course.price}\n`;
          response += "\n";
        });
        response += "✅ ভর্তি হতে 'Enroll Now' বাটনে ক্লিক করুন।";
        return response;
      } else {
        return "📚 SSC ব্যাচ সম্পর্কে:\n\nআমাদের SSC (Class 9-10) এর জন্য বিশেষ কোর্স রয়েছে যা পরীক্ষার সম্পূর্ণ প্রস্তুতি নিশ্চিত করে।\n\nবিস্তারিত জানতে 'সব কোর্স দেখুন' সেকশনে যান বা আমাদের সাথে যোগাযোগ করুন:\n📞 +880 1712-345678";
      }
    }

    // HSC queries
    if (msg.includes("hsc") || msg.includes("এইচএসসি") || msg.includes("একাদশ") || msg.includes("দ্বাদশ")) {
      const hscCourses = knowledge.courses.filter(c =>
        c.title?.toLowerCase().includes("hsc") ||
        c.title?.toLowerCase().includes("এইচএসসি") ||
        c.title?.toLowerCase().includes("একাদশ") ||
        c.title?.toLowerCase().includes("দ্বাদশ")
      );

      if (hscCourses.length > 0) {
        let response = "📚 HSC সংক্রান্ত কোর্সসমূহ:\n\n";
        hscCourses.forEach((course, i) => {
          response += `${i + 1}. ${course.title}\n`;
          if (course.description) response += `   📝 ${course.description}\n`;
          if (course.duration) response += `   ⏱️ সময়কাল: ${course.duration}\n`;
          if (course.price) response += `   💰 ফি: ৳${course.price}\n`;
          response += "\n";
        });
        response += "ভর্তি হতে চাইলে 'Enroll Now' বাটনে ক্লিক করুন।";
        return response;
      } else {
        return "📚 HSC কোর্স শীঘ্রই আসছে। বর্তমানে SSC এবং পলিটেকনিক কোর্স চালু আছে।\n\nআপডেট পেতে যোগাযোগ করুন:\n📞 +880 1712-345678";
      }
    }

    // Polytechnic queries
    if (msg.includes("polytechnic") || msg.includes("পলিটেকনিক") || msg.includes("diploma") || msg.includes("ডিপ্লোমা")) {
      const polyCourses = knowledge.courses.filter(c =>
        c.title?.toLowerCase().includes("polytechnic") ||
        c.title?.toLowerCase().includes("পলিটেকনিক") ||
        c.title?.toLowerCase().includes("diploma")
      );

      let response = "";

      if (polyCourses.length > 0) {
        response = "🎓 পলিটেকনিক ভর্তি প্রস্তুতি কোর্স:\n\n";
        polyCourses.forEach((course, i) => {
          response += `${i + 1}. ${course.title}\n`;
          if (course.description) response += `   ${course.description}\n`;
          if (course.duration) response += `   ⏱️ ${course.duration}\n`;
          response += "\n";
        });
      } else {
        response = "🎓 পলিটেকনিক ভর্তি প্রস্তুতি:\n\nআমরা পলিটেকনিক ভর্তি পরীক্ষার জন্য বিশেষ কোর্স অফার করি।\n\n";
      }

      // Add polytechnic institutes info
      if (knowledge.polytechnics.length > 0) {
        response += "📍 বাংলাদেশের প্রধান পলিটেকনিক ইন্সটিটিউট:\n\n";
        knowledge.polytechnics.slice(0, 6).forEach((poly, i) => {
          response += `${i + 1}. ${poly.name || poly.title}\n`;
          if (poly.location) response += `   📌 ${poly.location}\n`;
          if (poly.description) response += `   ${poly.description}\n`;
        });
      } else {
        response += "📍 প্রধান ইন্সটিটিউট:\n• Dhaka Polytechnic Institute\n• Rajshahi Polytechnic Institute\n• Khulna Polytechnic Institute\n• Chattogram Polytechnic Institute\n• Barisal Polytechnic Institute\n• Bogura Polytechnic Institute\n\n";
      }

      response += "\nবিস্তারিত দেখতে 'পলিটেকনিক ইন্সটিটিউট সমূহ' সেকশনে যান।";
      return response;
    }

    // === NOTES QUERIES ===
    if (msg.includes("note") || msg.includes("pdf") || msg.includes("sheet") || msg.includes("suggestion") || msg.includes("নোট") || msg.includes("সাজেশন") || msg.includes("সিট")) {
      if (knowledge.notes.length > 0) {
        let response = "📝 আমাদের লেকচার শিট ও নোটসমূহ:\n\n";

        // Try to filter if subject mentioned
        let filteredNotes = knowledge.notes;
        if (msg.includes("math") || msg.includes("গণিত")) filteredNotes = filteredNotes.filter(n => n.title.toLowerCase().includes("গণিত") || n.title.toLowerCase().includes("math"));
        else if (msg.includes("physics") || msg.includes("পদার্থ")) filteredNotes = filteredNotes.filter(n => n.title.toLowerCase().includes("পদার্থ") || n.title.toLowerCase().includes("physics"));
        else if (msg.includes("chemistry") || msg.includes("রসায়ন")) filteredNotes = filteredNotes.filter(n => n.title.toLowerCase().includes("রসায়ন") || n.title.toLowerCase().includes("chemistry"));

        const displayNotes = filteredNotes.slice(0, 5);

        if (displayNotes.length > 0) {
          displayNotes.forEach((note, i) => {
            response += `${i + 1}. ${note.title}\n`;
            if (note.description) response += `   📄 ${note.description}\n`;
            response += "\n";
          });
          response += "সব নোট ডাউনলোড করতে 'Notes' সেকশনে যান।";
        } else {
          response = "দুঃখিত, এই বিষয়ের কোনো নোট বর্তমানে নেই। তবে আমাদের অন্যান্য বিষয়ের নোট রয়েছে 'Notes' সেকশনে।";
        }
        return response;
      } else {
        return "📝 নোট সেকশনে আমাদের সকল ক্লাসের লেকচার শিট এবং সাজেশন পাওয়া যাচ্ছে। অনুগ্রহ করে লগইন করে 'Notes' মেনু দেখুন।";
      }
    }

    // === LIVE CLASS QUERIES ===
    if (msg.includes("live") || msg.includes("class now") || msg.includes("join") || msg.includes("লাইভ") || msg.includes("ক্লাস শুরু")) {
      const activeClasses = knowledge.liveClasses.filter(c => c.status === "live");
      const upcomingClasses = knowledge.liveClasses.filter(c => c.status === "upcoming");

      let response = "";

      if (activeClasses.length > 0) {
        response += "🔴 এখন লাইভ ক্লাস চলছে:\n\n";
        activeClasses.forEach((cls) => {
          response += `▶️ ${cls.title}\n`;
          if (cls.topic) response += `   বিষয়: ${cls.topic}\n`;
          if (cls.teacherName) response += `   👨‍🏫 শিক্ষক: ${cls.teacherName}\n`;
          response += "\n";
        });
        response += "ক্লাসে জয়েন করতে 'Live Class' সেকশনে যান!\n\n";
      }

      if (upcomingClasses.length > 0) {
        response += "⏰ পরবর্তী লাইভ ক্লাস:\n\n";
        upcomingClasses.slice(0, 3).forEach((cls) => {
          response += `📅 ${cls.title}\n`;
          if (cls.startTime) response += `   সময়: ${cls.startTime}\n`;
          response += "\n";
        });
      }

      if (!response) {
        response = "বর্তমানে কোনো লাইভ ক্লাস চলছে না। রুটিন দেখতে 'Live Class' সেকশনে ভিজিট করুন।";
      }

      return response;
    }

    // General course queries
    if (msg.includes("course") || msg.includes("কোর্স") || msg.includes("ব্যাচ") || msg.includes("batch")) {
      if (knowledge.courses.length > 0) {
        let response = "📚 আমাদের সকল কোর্স:\n\n";
        knowledge.courses.slice(0, 8).forEach((course, i) => {
          response += `${i + 1}. ${course.title}\n`;
          if (course.description) response += `   📝 ${course.description}\n`;
          if (course.duration) response += `   ⏱️ ${course.duration}\n`;
          if (course.price) response += `   💰 ৳${course.price}\n`;
          if (course.enrolled) response += `   👥 ${course.enrolled} ভর্তি\n`;
          response += "\n";
        });
        response += "আরো কোর্স দেখতে 'সব কোর্স দেখুন' বাটনে ক্লিক করুন।";
        return response;
      }
    }

    // === BOOK RELATED QUERIES ===
    if (msg.includes("book") || msg.includes("বই") || msg.includes("পাঠ্যবই") || msg.includes("price") || msg.includes("দাম") || msg.includes("available") || msg.includes("stock") || msg.includes("স্টক")) {

      // Check for specific book queries
      let specificBook = null;
      if (msg.includes("math") || msg.includes("গণিত")) {
        specificBook = knowledge.books.find(b => b.title?.toLowerCase().includes("গণিত") || b.title?.toLowerCase().includes("math"));
      } else if (msg.includes("physics") || msg.includes("পদার্থ")) {
        specificBook = knowledge.books.find(b => b.title?.toLowerCase().includes("পদার্থ") || b.title?.toLowerCase().includes("physics"));
      } else if (msg.includes("chemistry") || msg.includes("রসায়ন")) {
        specificBook = knowledge.books.find(b => b.title?.toLowerCase().includes("রসায়ন") || b.title?.toLowerCase().includes("chemistry"));
      } else if (msg.includes("english") || msg.includes("ইংরেজি")) {
        specificBook = knowledge.books.find(b => b.title?.toLowerCase().includes("ইংরেজি") || b.title?.toLowerCase().includes("english"));
      }

      if (specificBook) {
        let response = `📖 ${specificBook.title}\n\n`;
        if (specificBook.author) response += `✍️ লেখক: ${specificBook.author}\n`;
        if (specificBook.price) response += `💰 মূল্য: ৳${specificBook.price}\n`;
        response += `📦 স্টক: ${specificBook.inStock ? "✅ পাওয়া যাচ্ছে" : "❌ স্টকে নেই"}\n\n`;
        response += "অর্ডার করতে 'Buy Now' বাটনে ক্লিক করুন।";
        return response;
      }

      // General book list
      if (knowledge.books.length > 0) {
        let response = "📚 আমাদের বইয়ের তালিকা:\n\n";
        knowledge.books.forEach((book, i) => {
          response += `${i + 1}. ${book.title}\n`;
          if (book.author) response += `   ✍️ ${book.author}\n`;
          if (book.price) response += `   💰 ৳${book.price}\n`;
          response += `   ${book.inStock ? "✅ পাওয়া যাচ্ছে" : "❌ স্টকে নেই"}\n\n`;
        });
        response += "বই অর্ডার করতে 'গুরুত্বপূর্ণ পাঠ্যবই' সেকশন��� যান।";
        return response;
      } else {
        return "📚 আমাদের বই সংগ্রহ:\n\n• নবম-দশম শ্রেণির গণিত - ৳450\n• পদার্থ বিজ্ঞান হ্যান্ডবুক - ৳380\n• রসায়ন সম্পূর্ণ গাইড - ৳420\n• ইংরেজি গ্রামার - ৳350\n\nসব বই দেখতে এবং অর্ডার করতে 'গুরুত্বপূর্ণ পাঠ্যবই' সেকশনে যান।";
      }
    }

    // === CLASS SCHEDULE QUERIES ===
    if (msg.includes("time") || msg.includes("schedule") || msg.includes("সময়") || msg.includes("শিডিউল") || msg.includes("সময়সূচী") || msg.includes("class") || msg.includes("ক্লাস") || msg.includes("কখন")) {
      if (knowledge.schedules.length > 0) {
        let response = "🕐 এই সপ্তাহের ক্লাস শিডিউল:\n\n";
        knowledge.schedules.forEach((schedule, i) => {
          response += `📅 ${schedule.day}\n`;
          response += `📖 বিষয়: ${schedule.subject}\n`;
          response += `👨‍🏫 শিক্ষক: ${schedule.teacher}\n`;
          response += `⏰ সময়: ${schedule.time}\n`;
          if (schedule.platform) response += `📱 প্ল্যাটফর্ম: ${schedule.platform}\n`;
          response += "\n";
        });
        response += "সম্পূর্ণ শিডিউল দেখতে 'ক্লাস শিডিউল' সেকশনে যান।";
        return response;
      } else {
        return "🕐 ক্লাস শিডিউল:\n\nআমাদের নিয়মিত অনলাইন ক্লাস রয়েছে প্রতিদিন সকাল ৯টা থেকে রাত ৮টা পর্যন্ত।\n\nবিস্তারিত শিডিউল দেখতে 'ক্লাস শিডিউল' সেকশনে যান অথবা যোগাযোগ করুন:\n📞 +880 1712-345678";
      }
    }

    // === TEACHER QUERIES ===
    if (msg.includes("teacher") || msg.includes("শিক্ষক") || msg.includes("স্যার") || msg.includes("ম্যাম") || msg.includes("instructor")) {

      // Check for specific subject teacher
      let subject = "";
      if (msg.includes("math") || msg.includes("গণিত")) subject = "গণিত";
      else if (msg.includes("physics") || msg.includes("পদার্থ")) subject = "পদার্থ";
      else if (msg.includes("chemistry") || msg.includes("রসায়ন")) subject = "রসায়ন";
      else if (msg.includes("english") || msg.includes("ইংরেজি")) subject = "ইংরেজি";
      else if (msg.includes("bangla") || msg.includes("বাংলা")) subject = "বাংলা";

      if (subject && knowledge.teachers.length > 0) {
        const subjectTeacher = knowledge.teachers.find(t =>
          t.subject?.toLowerCase().includes(subject.toLowerCase())
        );

        if (subjectTeacher) {
          let response = `👨‍🏫 ${subject} শিক্ষক:\n\n`;
          response += `নাম: ${subjectTeacher.name}\n`;
          response += `বিষয়: ${subjectTeacher.subject}\n`;
          if (subjectTeacher.experience) response += `অভিজ্ঞতা: ${subjectTeacher.experience}\n`;
          if (subjectTeacher.rating) response += `⭐ রেটিং: ${subjectTeacher.rating}\n`;
          if (subjectTeacher.students) response += `👥 শিক্ষার্থী: ${subjectTeacher.students}\n`;
          return response;
        }
      }

      // General teacher list
      if (knowledge.teachers.length > 0) {
        let response = "👨‍🏫 আমাদের অভিজ্ঞ শিক্ষকবৃন্দ:\n\n";
        knowledge.teachers.slice(0, 6).forEach((teacher, i) => {
          response += `${i + 1}. ${teacher.name}\n`;
          response += `   📚 ${teacher.subject}\n`;
          if (teacher.experience) response += `   🎓 ${teacher.experience} অভিজ্ঞতা\n`;
          if (teacher.rating) response += `   ⭐ ${teacher.rating} রেটিং\n`;
          response += "\n";
        });
        response += "সব শিক্ষকদের দেখতে 'আমাদের শিক্ষকবৃন্দ' সেকশনে যান।";
        return response;
      } else {
        return "👨‍🏫 আমাদের শিক্ষকবৃন্দ:\n\nআমাদের সকল শিক্ষক অত্যন্ত দক্ষ ও অভিজ্ঞ। প্রতিটি বিষয়ের জন্য বিশেষজ্ঞ শিক্ষক রয়েছেন।\n\nশিক্ষকদের প্রোফাইল দেখতে 'আমাদের শিক্ষকবৃন্দ' সেকশনে যান।";
      }
    }

    // === CONTACT & LOCATION QUERIES ===
    if (msg.includes("contact") || msg.includes("phone") || msg.includes("যোগাযোগ") || msg.includes("ফোন") || msg.includes("মোবাইল") || msg.includes("address") || msg.includes("ঠিকানা") || msg.includes("location") || msg.includes("email") || msg.includes("ইমেইল") || msg.includes("office") || msg.includes("অফিস") || msg.includes("human") || msg.includes("কথা") || msg.includes("details")) {

      const currentHour = new Date().getHours();
      const isOfficeOpen = currentHour >= 7 && currentHour < 19; // 7 AM to 7 PM

      if (isOfficeOpen) {
        return `📞 আমাদের অফিস এখন খোলা আছে (সকাল ৭টা - সন্ধ্যা ৭টা)।\n\nসরাসরি কথা বলতে নিচের WhatsApp বাটনে ক্লিক করুন:\n\n[WHATSAPP_BUTTON]\n\nঅথবা কল করুন: 01629648302`;
      } else {
        return `দুঃখিত, আমাদের অফিস এখন বন্ধ। 🌙\n\n⏰ অফিস সময়:\nসকাল ৭টা - সন্ধ্যা ৭টা (প্রতিদিন)\n\nঅনুগ্রহ করে অফিস সময়ে যোগাযোগ করুন।\n\nজরুরী প্রয়োজনে মেইল করুন:\ntechnocareacademy.edu@gmail.com`;
      }
    }

    // === FEE/PRICE QUERIES ===
    if (msg.includes("fee") || msg.includes("ফি") || msg.includes("cost") || msg.includes("খরচ") || msg.includes("tuition")) {
      let response = "💰 কোর্স ফি সম্পর্কে:\n\n";

      if (knowledge.courses.length > 0) {
        const coursesWithPrice = knowledge.courses.filter(c => c.price);
        if (coursesWithPrice.length > 0) {
          coursesWithPrice.forEach((course, i) => {
            response += `${i + 1}. ${course.title}\n   💵 ৳${course.price}\n\n`;
          });
        } else {
          response += "প্রতিটি কোর্সের ফি ভিন্ন।\n\n";
        }
      }

      response += "বিস্তারিত জানতে:\n• যেকোনো কোর্সে 'Enroll Now' ক্লিক করুন\n• অথবা কল করুন: 01629648302";
      return response;
    }

    // === ENROLLMENT QUERIES ===
    if (msg.includes("enroll") || msg.includes("admission") || msg.includes("ভর্তি") || msg.includes("admit") || msg.includes("join") || msg.includes("register")) {
      return "✅ ভর্তি প্রক্রিয়া (৪টি ধাপ):\n\n১. পছন্দের কোর্স নির্বাচন করুন\n২. 'Enroll Now' বাটনে ক্লিক করুন\n৩. ফর্ম সম্পূর্ণভাবে পূরণ করুন\n৪. আমাদের টিম ২৪ ঘণ্টার মধ্যে যোগাযোগ করবে\n\n📝 প্রয়োজনীয় তথ্য:\n• নাম\n• মোবাইল নম্বর\n• ইমেইল\n• শ্রেণী/কোর্স\n\nযেকোনো সাহায্যের জন্য:\n📞 01629648302";
    }

    // === SUCCESS/RESULT QUERIES ===
    if (msg.includes("result") || msg.includes("success") || msg.includes("রেজাল্ট") || msg.includes("সাফল্য") || msg.includes("achievement")) {
      return "🏆 আমাদের শিক্ষার্থীদের সাফল্য:\n\n✨ GPA 5.00: ১০০+ শিক্ষার্থী\n📊 A+ Grade: ৩০০+ শিক্ষার্থী\n🎯 পলিটেকনিক ভর্তি: ৯৫%+ সফলতা\n👥 মোট সফল শিক্ষার্থী: ৭১২+\n\n🌟 বিশেষ অর্জন:\n• জাতীয় পর্যায়ে পুরস্কার প্রাপ্ত\n• বিভিন্ন প্রতিযোগিতায় চ্যাম্পিয়ন\n• বৃত্তি প্রাপ্ত শিক্ষার্থী\n\n'সাফল্যের শীর্ষে যারা' সেকশনে আমাদের সফল শিক্ষার্থীদের দেখুন।";
    }

    // === GREETING ===
    if (msg.includes("hello") || msg.includes("hi") || msg.includes("হাই") || msg.includes("হ্যালো") || msg.includes("আসসালাম") || msg.includes("সালাম")) {
      return "ওয়ালাইকুম আসসালাম! 😊\n\nTechno Care Academy তে স্বাগতম।\n\nআমি আপনার যেকোনো প্রশ্নের উত্তর দিতে পারি:\n\n📚 কোর্স এবং ব্যাচ\n📖 বই এবং দাম\n🕐 ক্লাস সময়সূচী\n👨‍🏫 শিক্ষক তথ্য\n🎓 পলিটেকনিক তথ্য\n💰 ফি এবং পেমেন্ট\n✅ ভর্তি প্রক্রিয়া\n📞 যোগাযোগ\n\nআপনার প্রশ্ন করুন!";
    }

    // === ABOUT US ===
    if (msg.includes("about") || msg.includes("সম্পর্কে") || msg.includes("কে") || msg.includes("who") || msg.includes("what")) {
      return "🏫 Techno Care Academy সম্পর্কে:\n\nআমরা বাংলাদেশের একটি শীর্ষস্থানীয় অনলাইন শিক্ষা প্রতিষ্ঠান।\n\n🎯 আমাদের লক্ষ্য:\nSSC, HSC এবং পলিটেকনিক শিক্ষার্থীদের সর্বোচ্চ মানের শিক্ষা প্রদান।\n\n✨ বিশেষত্ব:\n• অভিজ্ঞ শিক্ষকমণ্ডলী\n• লাইভ অনলাইন ক্লাস\n• রেকর্ডেড ভিডিও\n• নিয়মিত পরীক্ষা\n• ব্যক্তিগত যত্ন\n\n📊 পরিসংখ্যান:\n👥 ৭১২+ সফল শিক্ষার্থী\n📚 ১০+ কোর্স\n👨‍🏫 ৫০+ অভিজ্ঞ শিক্ষক\n⭐ ৪.৯/৫ রেটিং";
    }

    // === DEFAULT RESPONSE ===
    return `ধন্যবাদ আপনার প্রশ্নের জন্য! 😊\n\nআমি নিম্নলিখিত বিষয়ে সাহায্য করতে পারি:\n\n📚 কোর্স তথ্য (SSC, HSC, পলিটেকনিক)\n📖 বই, দাম ও স্টক তথ্য\n🕐 ক্লাস সময়সূচী\n👨‍🏫 শিক্ষকদের তথ্য\n🎓 পলিটেকনিক ইন্সটিটিউট\n💰 ফি এবং পেমেন্ট\n✅ ভর্তি প্রক্রিয়া\n📞 যোগাযোগ তথ্য\n\nআপনার প্রশ্ন আরও স্পষ্টভাবে জিজ্ঞাসা করুন অথবা সরাসরি যোগাযোগ করুন:\n📱 01629648302\n📧 technocareacademy.edu@gmail.com`;
  };

  const handleQuickAction = (action: string) => {
    addUserMessage(action);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = generateIntelligentResponse(action);
      addBotMessage(response);
    }, 800);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const userMsg = inputValue;
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const response = generateIntelligentResponse(userMsg);
      addBotMessage(response);
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              maxHeight: "calc(100vh - 120px)",
              bottom: "calc(5rem + env(safe-area-inset-bottom))",
              right: "calc(1.25rem + env(safe-area-inset-right))"
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#285046] to-[#2F6057] p-3 sm:p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white text-sm sm:text-base">Techno Care AI</h3>
                  <p className="text-white/80 text-[10px] sm:text-xs">🟢 সবসময় সক্রিয়</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-1.5 sm:p-2 transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-[#F7FAFC] to-white">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${message.isBot ? "justify-start" : "justify-end"}`}
                  >
                    {message.isBot && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] sm:max-w-[75%] rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3 ${message.isBot
                        ? "bg-white shadow-md border border-gray-100"
                        : "bg-gradient-to-r from-[#285046] to-[#2F6057] text-white shadow-lg"
                        }`}
                    >
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line break-words">
                        {message.text.includes("[WHATSAPP_BUTTON]") ? (
                          <div className="flex flex-col gap-2">
                            <span>{message.text.split("[WHATSAPP_BUTTON]")[0]}</span>
                            <a
                              href="https://wa.me/01629648302"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 mb-2 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full font-bold transition-colors w-full shadow-md"
                            >
                              <MessageCircle className="w-5 h-5" />
                              WhatsApp-এ কথা বলুন
                            </a>
                            <span>{message.text.split("[WHATSAPP_BUTTON]")[1]}</span>
                          </div>
                        ) : (
                          message.text
                        )}
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs mt-1.5 sm:mt-2 block ${message.isBot ? "text-gray-400" : "text-white/70"
                          }`}
                      >
                        {message.timestamp.toLocaleTimeString("bn-BD", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    {!message.isBot && (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#FFB703] to-[#FF8C00] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 justify-start"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-[#285046] to-[#2F6057] rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="bg-white shadow-md border border-gray-100 rounded-xl sm:rounded-2xl px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#285046] rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#285046] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#285046] rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white border-t border-gray-100">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                <button
                  onClick={() => handleQuickAction("SSC ব্যাচ কি available?")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#F7FAFC] to-white border border-[#285046]/20 rounded-full text-[10px] sm:text-xs text-[#285046] hover:border-[#285046] hover:shadow-md transition-all"
                >
                  📚 SSC ব্যাচ
                </button>
                <button
                  onClick={() => handleQuickAction("বইয়ের দাম কত?")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#F7FAFC] to-white border border-[#285046]/20 rounded-full text-[10px] sm:text-xs text-[#285046] hover:border-[#285046] hover:shadow-md transition-all"
                >
                  📖 বইয়ের দাম
                </button>
                <button
                  onClick={() => handleQuickAction("ক্লাস সময়সূচী")}
                  className="px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-[#F7FAFC] to-white border border-[#285046]/20 rounded-full text-[10px] sm:text-xs text-[#285046] hover:border-[#285046] hover:shadow-md transition-all"
                >
                  🕐 সময়সূচী
                </button>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-2 sm:p-3 md:p-4 bg-white border-t border-gray-200">
              <div className="flex gap-1.5 sm:gap-2 items-end">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="আপনার প্রশ্ন লিখুন..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 md:py-3 bg-[#F7FAFC] border border-gray-200 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#285046] focus:border-transparent text-xs sm:text-sm resize-none"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-gradient-to-r from-[#285046] to-[#2F6057] hover:from-[#2F6057] hover:to-[#285046] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl sm:rounded-2xl p-2 sm:p-2.5 md:p-3 transition-all shadow-lg hover:shadow-xl"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed z-50 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full p-3 sm:p-4 shadow-2xl"
        style={{
          animation: isOpen ? "none" : "bounce 2s infinite",
          bottom: "calc(1rem + env(safe-area-inset-bottom))",
          right: "calc(1.25rem + env(safe-area-inset-right))"
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                AI
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}