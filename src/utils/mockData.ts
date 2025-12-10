// Mock data for the application - to be populated in localStorage

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  isActive: boolean;
  order: number;
  createdAt: string;
}

export interface Review {
  id: string;
  studentName: string;
  studentImage?: string;
  courseName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Teacher {
  id: string;
  name: string;
  designation: string;
  qualification: string;
  experience: string;
  image: string;
  subjects: string[];
  bio?: string;
  email?: string;
  phone?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: number;
  category: 'class9' | 'class10' | 'polytechnic';
  instructor: string;
  students: number;
  rating: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  image: string;
  price: number;
  category: 'class9' | 'class10' | 'polytechnic';
  publisher: string;
  pages: number;
  language: string;
  inStock: boolean;
  stock: number;
  createdAt: string;
}

export interface NoteItem {
  id: string;
  courseId: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'image' | 'pptx';
  fileUrl: string;
  thumbnail?: string;
  category: 'class9' | 'class10' | 'polytechnic';
  subject: string;
  chapter?: string;
  views: number;
  downloads: number;
  createdAt: string;
}

export interface Exam {
  id: number;
  title: string;
  description: string;
  duration: string;
  totalMarks: number;
  category: 'class9' | 'class10' | 'polytechnic';
  questions: number;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
  participants: number;
}

// Hero Carousel Mock Data
export const mockHeroSlides: HeroSlide[] = [
  {
    id: "slide-1",
    title: "টেকনো কেয়ার একাডেমিতে স্বাগতম",
    subtitle: "শিক্ষার নতুন দিগন্ত",
    description: "আমাদের সাথে শিখুন, এগিয়ে যান। Class 9, Class 10 এবং Polytechnic কোর্সে বিশেষজ্ঞ শিক্ষকদের সাথে অনলাইন ক্লাস।",
    image: "/placeholder-hero-1.jpg",
    buttonText: "কোর্স দেখুন",
    buttonLink: "#courses",
    isActive: true,
    order: 1,
    createdAt: new Date().toISOString()
  },
  {
    id: "slide-2",
    title: "লাইভ ক্লাস প্রতিদিন",
    subtitle: "ইন্টারঅ্যাক্টিভ লার্নিং",
    description: "সরাসরি শিক্ষকের সাথে যোগাযোগ করুন, প্রশ্ন করুন এবং তাৎক্ষণিক সমাধান পান।",
    image: "/placeholder-hero-2.jpg",
    buttonText: "লাইভ ক্লাস দেখুন",
    buttonLink: "#live-classes",
    isActive: true,
    order: 2,
    createdAt: new Date().toISOString()
  },
  {
    id: "slide-3",
    title: "সম্পূর্ণ নোট ও বই",
    subtitle: "সকল উপকরণ এক জায়গায়",
    description: "পাঠ্যবই, নোট, প্রশ্নব্যাংক এবং সব ধরনের শিক্ষা উপকরণ পান আমাদের কাছে।",
    image: "/placeholder-hero-3.jpg",
    buttonText: "বই দেখুন",
    buttonLink: "#books",
    isActive: true,
    order: 3,
    createdAt: new Date().toISOString()
  }
];

// Reviews Mock Data
export const mockReviews: Review[] = [
  {
    id: "review-1",
    studentName: "মোঃ রাফি আহমেদ",
    studentImage: "",
    courseName: "SSC বিজ্ঞান - ব্যাচ 2024",
    rating: 5,
    comment: "অসাধারণ শিক্ষক এবং খুব সুন্দর পড়ানোর পদ্ধতি। আমার পরীক্ষায় অনেক উন্নতি হয়েছে।",
    isApproved: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "review-2",
    studentName: "সামিয়া খান",
    studentImage: "",
    courseName: "Polytechnic Math",
    rating: 5,
    comment: "লাইভ ক্লাসগুলো সত্যিই সহায়ক। যেকোনো সময় প্রশ্ন করতে পারি এবং শিক্ষক সবসময় সাহায্য করেন।",
    isApproved: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "review-3",
    studentName: "তানভীর হাসান",
    studentImage: "",
    courseName: "Class 9 English",
    rating: 4,
    comment: "ভালো কোর্স। নোটস অনেক হেল্পফুল। তবে আরো বেশি practice materials থাকলে ভালো হতো।",
    isApproved: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "review-4",
    studentName: "নুসরাত জাহান",
    studentImage: "",
    courseName: "SSC গণিত",
    rating: 5,
    comment: "শিক্ষকদের পড়ানোর স্টাইল অসাধারণ। কঠিন টপিকগুলোও সহজভাবে বুঝিয়ে দেন।",
    isApproved: true,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "review-5",
    studentName: "মাহমুদ হাসান",
    studentImage: "",
    courseName: "Polytechnic Physics",
    rating: 5,
    comment: "খুবই ভালো। প্র্যাক্টিক্যাল ডেমনস্ট্রেশন থাকায় সবকিছু ভালোভাবে বুঝতে পারি।",
    isApproved: false, // Pending approval
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Teachers Mock Data
export const mockTeachers: Teacher[] = [
  {
    id: "teacher-1",
    name: "ড. আবুল কালাম আজাদ",
    designation: "প্রধান শিক্ষক - গণিত",
    qualification: "PhD in Mathematics, Dhaka University",
    experience: "15 বছরের শিক্ষকতার অভিজ্ঞতা",
    image: "",
    subjects: ["গণিত", "উচ্চতর গণিত", "পরিসংখ্যান"],
    bio: "গণিতে বিশেষজ্ঞ শিক্ষক। SSC এবং HSC লেভেলে ১৫ বছরের অভিজ্ঞতা।",
    email: "akalam@technocare.com",
    phone: "01712345678",
    createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "teacher-2",
    name: "প্রফেসর নাসরিন সুলতানা",
    designation: "সিনিয়র শিক্ষক - পদার্থবিজ্ঞান",
    qualification: "MSc in Physics, BUET",
    experience: "12 বছরের শিক্ষকতার অভিজ্ঞতা",
    image: "",
    subjects: ["পদার্থবিজ্ঞান", "Applied Physics", "Mechanics"],
    bio: "পদার্থবিজ্ঞানে বিশেষজ্ঞ। Polytechnic এবং SSC উভয় লেভেলে দক্ষ।",
    email: "nsultana@technocare.com",
    phone: "01812345678",
    createdAt: new Date(Date.now() - 300 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "teacher-3",
    name: "মোঃ জাহিদুল ইসলাম",
    designation: "সিনিয়র শিক্ষক - ইংরেজি",
    qualification: "MA in English Literature, DU",
    experience: "10 বছরের শিক্ষকতার অভিজ্ঞতা",
    image: "",
    subjects: ["English", "English Literature", "Grammar"],
    bio: "ইংরেজি ভাষা ও সাহিত্যে পারদর্শী। Communicative English এ বিশেষজ্ঞ।",
    email: "zislam@technocare.com",
    phone: "01912345678",
    createdAt: new Date(Date.now() - 250 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "teacher-4",
    name: "সাবিনা আক্তার",
    designation: "শিক্ষক - রসায়ন",
    qualification: "MSc in Chemistry, Chittagong University",
    experience: "8 বছরের শিক্ষকতার অভিজ্ঞতা",
    image: "",
    subjects: ["রসায়ন", "Organic Chemistry", "Analytical Chemistry"],
    bio: "রসায়নে বিশেষজ্ঞ শিক্ষিকা। ব্যবহারিক ক্লাসে দক্ষ।",
    email: "saktar@technocare.com",
    phone: "01612345678",
    createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "teacher-5",
    name: "মোঃ রফিকুল ইসলাম",
    designation: "শিক্ষক - জীববিজ্ঞান",
    qualification: "MSc in Zoology, Rajshahi University",
    experience: "9 বছরের শিক্ষকতার অভিজ্ঞতা",
    image: "",
    subjects: ["জীববিজ্ঞান", "Botany", "Zoology"],
    bio: "জীববিজ্ঞানে বিশেষজ্ঞ। উদ্ভিদবিদ্যা ও প্রাণীবিদ্যায় পারদর্শী।",
    email: "rislam@technocare.com",
    phone: "01512345678",
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Courses Mock Data
export const mockCourses: Course[] = [
  {
    id: "course-1",
    title: "SSC বিজ্ঞান সম্পূর্ণ কোর্স",
    description: "Class 9 এবং Class 10 এর সম্পূর্ণ বিজ্ঞান কোর্স। পদার্থবিজ্ঞান, রসায়ন এবং জীববিজ্ঞান।",
    image: "",
    duration: "১২ মাস",
    price: 8000,
    category: "class10",
    instructor: "ড. আবুল কালাম আজাদ",
    students: 250,
    rating: 4.8,
    features: [
      "প্রতিদিন লাইভ ক্লাস",
      "রেকর্ডেড ভিডিও",
      "প্রশ্নব্যাংক ও সমাধান",
      "সাপ্তাহিক পরীক্ষা",
      "সার্টিফিকেট"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "course-2",
    title: "Class 9 গণিত মাস্টারি",
    description: "নবম শ্রেণীর গণিত বইয়ের সম্পূর্ণ সমাধান এবং অনুশীলন।",
    image: "",
    duration: "৬ মাস",
    price: 5000,
    category: "class9",
    instructor: "ড. আবুল কালাম আজাদ",
    students: 180,
    rating: 4.9,
    features: [
      "সব অধ্যায়ের বিস্তারিত ক্লাস",
      "দৈনিক অনুশীলন",
      "মাসিক পরীক্ষা",
      "ডাউট ক্লিয়ারিং সেশন"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "course-3",
    title: "Polytechnic Math Complete",
    description: "পলিটেকনিক ভর্তি পরীক্ষার জন্য সম্পূর্ণ গণিত প্রস্তুতি।",
    image: "",
    duration: "৪ মাস",
    price: 4500,
    category: "polytechnic",
    instructor: "ড. আবুল কালাম আজাদ",
    students: 150,
    rating: 4.7,
    features: [
      "Admission focused",
      "Previous year solutions",
      "Mock tests",
      "Formula shortcuts"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "course-4",
    title: "SSC ইংরেজি সম্পূর্ণ কোর্স",
    description: "Grammar, Literature, এবং Writing Skills এর সম্পূর্ণ প্রস্তুতি।",
    image: "",
    duration: "১০ মাস",
    price: 6000,
    category: "class10",
    instructor: "মোঃ জাহিদুল ইসলাম",
    students: 200,
    rating: 4.6,
    features: [
      "Grammar মাস্টারি",
      "Writing practice",
      "Speaking sessions",
      "Literature analysis"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "course-5",
    title: "Class 9 ICT",
    description: "তথ্য ও যোগাযোগ প্রযুক্তি - সম্পূর্ণ কোর্স।",
    image: "",
    duration: "৬ মাস",
    price: 3500,
    category: "class9",
    instructor: "মোঃ রফিকুল ইসলাম",
    students: 120,
    rating: 4.5,
    features: [
      "Practical sessions",
      "Programming basics",
      "Project work",
      "Assignment help"
    ],
    isActive: true,
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Books Mock Data
export const mockBooks: Book[] = [
  {
    id: "book-1",
    title: "নবম শ্রেণী - বিজ্ঞান",
    author: "NCTB",
    description: "নবম শ্রেণীর পাঠ্যবই - সাধারণ বিজ্ঞান। সম্পূর্ণ সিলেবাস কভার।",
    image: "",
    price: 250,
    category: "class9",
    publisher: "NCTB",
    pages: 280,
    language: "বাংলা",
    inStock: true,
    stock: 50,
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-2",
    title: "নবম-দশম শ্রেণী - গণিত",
    author: "NCTB",
    description: "এসএসসি গণিত বই। সব অধ্যায় সহ।",
    image: "",
    price: 300,
    category: "class10",
    publisher: "NCTB",
    pages: 350,
    language: "বাংলা",
    inStock: true,
    stock: 75,
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-3",
    title: "SSC English For Today",
    author: "NCTB",
    description: "নবম-দশম শ্রেণীর ইংরেজি বই - English For Today।",
    image: "",
    price: 200,
    category: "class10",
    publisher: "NCTB",
    pages: 220,
    language: "English",
    inStock: true,
    stock: 60,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-4",
    title: "Polytechnic Math Guide",
    author: "Prof. Abdur Rahman",
    description: "পলিটেকনিক ভর্তি পরীক্ষার গণিত গাইড।",
    image: "",
    price: 450,
    category: "polytechnic",
    publisher: "Academic Publishers",
    pages: 400,
    language: "বাংলা",
    inStock: true,
    stock: 40,
    createdAt: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-5",
    title: "নবম শ্রেণী - বাংলা ব্যাকরণ",
    author: "ড. মুহম্মদ শহীদুল্লাহ",
    description: "বাংলা ব্যাকরণ ও নির্মিতি - নবম শ্রেণী।",
    image: "",
    price: 180,
    category: "class9",
    publisher: "বাংলা একাডেমি",
    pages: 200,
    language: "বাংলা",
    inStock: true,
    stock: 55,
    createdAt: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-6",
    title: "SSC পদার্থবিজ্ঞান",
    author: "NCTB",
    description: "নবম-দশম শ্রেণীর পদার্থবিজ্ঞান বই।",
    image: "",
    price: 220,
    category: "class10",
    publisher: "NCTB",
    pages: 250,
    language: "বাংলা",
    inStock: true,
    stock: 45,
    createdAt: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-7",
    title: "Class 9 ICT",
    author: "NCTB",
    description: "তথ্য ও যোগাযোগ প্রযুক্তি - নবম শ্রেণী।",
    image: "",
    price: 150,
    category: "class9",
    publisher: "NCTB",
    pages: 180,
    language: "বাংলা",
    inStock: true,
    stock: 70,
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "book-8",
    title: "Polytechnic Physics",
    author: "Prof. Kamal Uddin",
    description: "পলিটেকনিক পদার্থবিজ্ঞান - সম্পূর্ণ গাইড।",
    image: "",
    price: 400,
    category: "polytechnic",
    publisher: "Science Publications",
    pages: 380,
    language: "বাংলা/English",
    inStock: true,
    stock: 35,
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Notes Mock Data
export const mockNotes: NoteItem[] = [
  {
    id: "note-1",
    courseId: "course-1",
    title: "পদার্থবিজ্ঞান - অধ্যায় ১: ভৌত রাশি",
    description: "ভৌত রাশি ও পরিমাপ সম্পর্কিত সম্পূর্ণ নোট এবং সূত্রাবলী।",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "class10",
    subject: "পদার্থবিজ্ঞান",
    chapter: "অধ্যায় ১",
    views: 450,
    downloads: 320,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-2",
    courseId: "course-2",
    title: "গণিত - বীজগণিত সূত্রাবলী",
    description: "সকল বীজগাণিতিক সূত্র এবং শর্টকাট টেকনিক।",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "class9",
    subject: "গণিত",
    chapter: "বীজগণিত",
    views: 580,
    downloads: 420,
    createdAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-3",
    courseId: "course-1",
    title: "রসায়ন - পর্যায় সারণি",
    description: "পর্যায় সারণি এবং মৌলের ধর্ম সম্পর্কিত নোট।",
    fileType: "image",
    fileUrl: "#",
    thumbnail: "",
    category: "class10",
    subject: "রসায়ন",
    chapter: "অধ্যায় ৩",
    views: 390,
    downloads: 280,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-4",
    courseId: "course-4",
    title: "English Grammar - Tenses",
    description: "Complete guide to all tenses with examples and exercises.",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "class10",
    subject: "English",
    chapter: "Grammar",
    views: 520,
    downloads: 380,
    createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-5",
    courseId: "course-3",
    title: "Polytechnic Math - Trigonometry",
    description: "ত্রিকোণমিতি সকল সূত্র এবং সমাধান।",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "polytechnic",
    subject: "Math",
    chapter: "Trigonometry",
    views: 340,
    downloads: 250,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-6",
    courseId: "course-1",
    title: "জীববিজ্ঞান - কোষ বিভাজন",
    description: "মাইটোসিস এবং মিয়োসিস সম্পর্কিত বিস্তারিত নোট।",
    fileType: "pptx",
    fileUrl: "#",
    thumbnail: "",
    category: "class10",
    subject: "জীববিজ্ঞান",
    chapter: "অধ্যায় ২",
    views: 410,
    downloads: 310,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-7",
    courseId: "course-2",
    title: "গণিত - জ্যামিতি সূত্র",
    description: "সকল জ্যামিতিক সূত্র এবং উপপাদ্য।",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "class9",
    subject: "গণিত",
    chapter: "জ্যামিতি",
    views: 470,
    downloads: 350,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "note-8",
    courseId: "course-5",
    title: "ICT - Programming Basics",
    description: "C programming এর মৌলিক ধারণা এবং উদাহরণ।",
    fileType: "pdf",
    fileUrl: "#",
    thumbnail: "",
    category: "class9",
    subject: "ICT",
    chapter: "Programming",
    views: 360,
    downloads: 270,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Function to initialize mock data in localStorage
export function initializeMockData() {
  // Check if mock data already exists
  const hasData = localStorage.getItem('mockDataInitialized');
  
  if (!hasData) {
    // Initialize hero slides
    localStorage.setItem('heroSlides', JSON.stringify(mockHeroSlides));
    
    // Initialize reviews
    localStorage.setItem('reviews', JSON.stringify(mockReviews));
    
    // Initialize notes
    localStorage.setItem('notes', JSON.stringify(mockNotes));

    // Initialize exams
    const mockExams: Exam[] = [
      {
        id: Date.now() + 1,
        title: "ক্লাস ৯ গণিত - প্রথম অধ্যায় পরীক্ষা",
        description: "সংখ্যা পদ্ধতি এবং বীজগণিত থেকে MCQ এবং লিখিত প্রশ্ন",
        duration: "৬০ মিনিট",
        totalMarks: 50,
        category: "class9",
        questions: 30,
        date: "2025-01-15",
        time: "10:00 AM",
        status: "upcoming",
        participants: 245
      },
      {
        id: Date.now() + 2,
        title: "ক্লাস ১০ পদার্থবিজ্ঞান মডেল টেস্ট",
        description: "তাপ, আলো এবং শব্দ অধ্যায় থেকে সম্পূর্ণ পরীক্ষা",
        duration: "৯০ মিনিট",
        totalMarks: 100,
        category: "class10",
        questions: 50,
        date: "2025-01-10",
        time: "02:00 PM",
        status: "live",
        participants: 450
      },
      {
        id: Date.now() + 3,
        title: "পলিটেকনিক ভর্তি প্রস্তুতি - গণিত",
        description: "পূর্ববর্তী বছরের প্রশ্ন প্যাটার্ন অনুসরণ করে মডেল টেস্ট",
        duration: "১২০ মিনিট",
        totalMarks: 100,
        category: "polytechnic",
        questions: 100,
        date: "2025-01-12",
        time: "11:00 AM",
        status: "upcoming",
        participants: 320
      },
      {
        id: Date.now() + 4,
        title: "ক্লাস ৯ বাংলা সাপ্তাহিক পরীক্ষা",
        description: "ব্যাকরণ এবং সাহিত্য অংশ থেকে সমন্বিত পরীক্ষা",
        duration: "৬০ মিনিট",
        totalMarks: 50,
        category: "class9",
        questions: 25,
        date: "2025-01-05",
        time: "09:00 AM",
        status: "completed",
        participants: 180
      },
      {
        id: Date.now() + 5,
        title: "SSC রসায়ন ফাইনাল মডেল টেস্ট",
        description: "সম্পূর্ণ সিলেবাস থেকে বোর্ড প্যাটার্ন অনুসরণ করে পরীক্ষা",
        duration: "১৮০ মিনিট",
        totalMarks: 100,
        category: "class10",
        questions: 60,
        date: "2025-01-20",
        time: "10:00 AM",
        status: "upcoming",
        participants: 520
      },
      {
        id: Date.now() + 6,
        title: "পলিটেকনিক ইংরেজি মক টেস্ট",
        description: "Comprehension, Grammar এবং Vocabulary",
        duration: "৬০ মিনিট",
        totalMarks: 50,
        category: "polytechnic",
        questions: 40,
        date: "2025-01-08",
        time: "03:00 PM",
        status: "live",
        participants: 275
      }
    ];
    localStorage.setItem('exams', JSON.stringify(mockExams));
    
    // Mark as initialized
    localStorage.setItem('mockDataInitialized', 'true');
  }
}

// Getter functions
export function getHeroSlides(): HeroSlide[] {
  const slides = localStorage.getItem('heroSlides');
  return slides ? JSON.parse(slides) : [];
}

export function getReviews(): Review[] {
  const reviews = localStorage.getItem('reviews');
  return reviews ? JSON.parse(reviews) : [];
}

export function getTeachers(): Teacher[] {
  const teachers = localStorage.getItem('teachers');
  return teachers ? JSON.parse(teachers) : [];
}

export function getCourses(): Course[] {
  const courses = localStorage.getItem('courses');
  return courses ? JSON.parse(courses) : [];
}

export function getBooks(): Book[] {
  const books = localStorage.getItem('books');
  return books ? JSON.parse(books) : [];
}

export function getNotes(): NoteItem[] {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}