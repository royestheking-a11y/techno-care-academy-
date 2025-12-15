const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Enrollment = require('./models/Enrollment');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Note = require('./models/Note');
const SavedNote = require('./models/SavedNote');
const Slide = require('./models/Slide');
const Book = require('./models/Book');
const Teacher = require('./models/Teacher');
const Institute = require('./models/Institute');
const LiveClass = require('./models/LiveClass');
const Schedule = require('./models/Schedule');

dotenv.config({ path: '../server/.env' }); // Adjust path if running from server root

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding');

        // Clear existing data (optional, be careful in production)
        // await User.deleteMany({});
        // await Course.deleteMany({});
        // ...

        // Mock Data Extraction
        const users = [
            {
                id: 'admin-1',
                name: 'Admin User',
                email: 'technocareacademy.edu@gmail.com',
                phone: '01629648302',
                password: 'admin123',
                role: 'admin',
                bio: 'System Administrator',
                createdAt: new Date().toISOString(),
            }
        ];

        const slides = [
            {
                id: '1',
                institute: "Dhaka Polytechnic Institute",
                title: "এখন আর দূরে নয় তোমার স্বপ্নের পলিটেকনিক ইনস্টিটিউট",
                subtitle: "Dhaka Polytechnic Institute",
                description: "আমাদের সাথে প্রস্তুতি নিন এবং সাফল্যের পথে এগিয়ে যান।",
                image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600",
                isActive: true,
                order: 1,
                buttonText: "এখনই শুরু করো",
                buttonLink: "#courses"
            },
            {
                id: '2',
                institute: "Rajshahi Polytechnic Institute",
                title: "সেরা শিক্ষকদের তত্ত্বাবধানে ক্লাস",
                subtitle: "Rajshahi Polytechnic Institute",
                description: "নিয়মিত লাইভ ক্লাস এবং প্রবলেম সলভিং সেশন।",
                image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b955?w=1600",
                isActive: true,
                order: 2,
                buttonText: "কোর্স দেখুন",
                buttonLink: "#courses"
            },
            {
                id: '3',
                institute: "Khulna Polytechnic Institute",
                title: "সাশ্রয়ী মূল্যে সেরা শিক্ষা",
                subtitle: "Khulna Polytechnic Institute",
                description: "সকলের সাধ্যের মধ্যে মানসম্মত শিক্ষা নিশ্চিত করাই আমাদের লক্ষ্য।",
                image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1600",
                isActive: true,
                order: 3,
                buttonText: "জয়েন করুন",
                buttonLink: "#signup"
            },
        ];

        const books = [
            { id: 1, title: "নবম-দশম শ্রেণির গণিত", author: "ড. মোহাম্মদ আলী", price: "450", originalPrice: "500", discount: "10", image: "https://images.unsplash.com/photo-1543286386-713df548e9cc?w=800", inStock: true, enTitle: "Class 9-10 Math", enAuthor: "Dr. Mohammad Ali" },
            { id: 2, title: "পদার্থ বিজ্ঞান হ্যান্ডবুক", author: "প্রফেসর রহিম উদ্দিন", price: "550", originalPrice: "650", discount: "15", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0fe?w=800", inStock: true, enTitle: "Physics Handbook", enAuthor: "Professor Rahim Uddin" },
            { id: 3, title: "রসায়ন সম্পূর্ণ গাইড", author: "ড. সাবিনা ইয়াসমিন", price: "500", originalPrice: "550", discount: "9", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800", inStock: true, enTitle: "Chemistry Complete Guide", enAuthor: "Dr. Sabina Yasmin" },
            { id: 4, title: "ইংরেজি গ্রামার এন্ড কম্পোজিশন", author: "মুনীর চৌধুরী", price: "350", originalPrice: "400", discount: "12", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800", inStock: true, enTitle: "English Grammar and Composition", enAuthor: "Munir Chowdhury" },
            { id: 5, title: "জীববিজ্ঞান প্রশ্নব্যাংক", author: "ড. হাসান মাহমুদ", price: "420", originalPrice: "480", discount: "12", image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800", inStock: true, enTitle: "Biology Question Bank", enAuthor: "Dr. Hasan Mahmud" },
            { id: 6, title: "বাংলা ব্যাকরণ ও নির্মিতি", author: "ড. মুহম্মদ শহীদুল্লাহ", price: "380", originalPrice: "420", discount: "10", image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800", inStock: true, enTitle: "Bangla Grammar", enAuthor: "Dr. Muhammad Shahidullah" },
        ];

        const teachers = [
            { id: 1, name: "মো. করিম উদ্দিন", subject: "পদার্থ বিজ্ঞান", qualification: "MSc in Physics, Dhaka University", experience: "১৫ বছর", rating: 4.9, students: "500+", initial: "MK", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400", category: "Class 9-10", enName: "Md. Karim Uddin", enSubject: "Physics" },
            { id: 2, name: "ফাতেমা খাতুন", subject: "রসায়ন", qualification: "MSc in Chemistry, Rajshahi University", experience: "১২ বছর", rating: 4.8, students: "450+", initial: "FK", image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400", category: "Class 9-10", enName: "Fatema Khatun", enSubject: "Chemistry" },
            { id: 3, name: "রহিম আলী", subject: "গণিত", qualification: "BSc in Mathematics, Chittagong University", experience: "১৮ বছর", rating: 5.0, students: "700+", initial: "RA", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400", category: "Polytechnic", enName: "Rahim Ali", enSubject: "Mathematics" },
            { id: 4, name: "সালমা বেগম", subject: "ইংরেজি", qualification: "MA in English Literature, Jahangirnagar University", experience: "১০ বছর", rating: 4.7, students: "380+", initial: "SB", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400", category: "Class 9-10", enName: "Salma Begum", enSubject: "English" },
        ];

        // ...

        const notes = [
            {
                id: 1,
                courseId: 1,
                title: "SSC পদার্থ বিজ্ঞান - প্রথম অধ্যায়",
                description: "ভৌত রাশি ও পরিমাপ সম্পূর্ণ নোট",
                fileType: 'pdf',
                fileUrl: '/notes/physics-chapter-1.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400',
                createdAt: new Date().toISOString(),
                tags: ["physics", "chapter 1", "ssc", "science"]
            },
            {
                id: 2,
                courseId: 1,
                title: "SSC গণিত - বীজগণিত",
                description: "বীজগণিতের সূত্র ও সমাধান",
                fileType: 'pdf',
                fileUrl: '/notes/math-algebra.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
                createdAt: new Date().toISOString(),
                tags: ["math", "algebra", "ssc", "general math"]
            },
            {
                id: 3,
                courseId: 2,
                title: "রসায়ন - জৈব যৌগ চিত্র",
                description: "জৈব যৌগের গঠন ও বিক্রিয়া ডায়াগ্রাম",
                fileType: 'image',
                fileUrl: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800',
                thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400',
                createdAt: new Date().toISOString(),
                tags: ["chemistry", "organic", "diagram", "science"]
            },
            {
                id: 4,
                courseId: 1,
                title: "জীববিজ্ঞান - কোষ বিভাজন প্রেজেন্টেশন",
                description: "মাইটোসিস ও মিয়োসিস প্রক্রিয়া",
                fileType: 'pptx',
                fileUrl: '/notes/biology-cell-division.pptx',
                thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400',
                createdAt: new Date().toISOString(),
                tags: ["biology", "cell division", "presentation", "science"]
            },
            {
                id: 5,
                courseId: 6,
                title: "পলিটেকনিক ম্যাথ ফর্মুলা শীট",
                description: "সকল গুরুত্বপূর্ণ সূত্র এক পাতায়",
                fileType: 'pdf',
                fileUrl: '/notes/polytechnic-math-formulas.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=400',
                createdAt: new Date().toISOString(),
                tags: ["polytechnic", "math", "formulas", "diploma"]
            },
            {
                id: 6,
                courseId: 10,
                title: "গণিত - জ্যামিতি সমাধান",
                description: "জ্যামিতির সকল উপপাদ্য ও সমাধান",
                fileType: 'pdf',
                fileUrl: '/notes/geometry-solutions.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400',
                createdAt: new Date().toISOString(),
                tags: ["geometry", "math", "solution", "ssc"]
            },
            {
                id: 7,
                courseId: 17,
                title: "ICT - প্রোগ্রামিং কোড উদাহরণ",
                description: "C, C++, Python এর গুরুত্বপূর্ণ প্রোগ্রাম",
                fileType: 'pdf',
                fileUrl: '/notes/programming-examples.pdf',
                thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
                createdAt: new Date().toISOString(),
                tags: ["ict", "programming", "coding", "python", "c++"]
            },
            {
                id: 8,
                courseId: 20,
                title: "ইংরেজি গ্রামার চার্ট",
                description: "Tenses এবং Voice Change নিয়ম",
                fileType: 'image',
                fileUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800',
                thumbnail: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=400',
                createdAt: new Date().toISOString(),
                tags: ["english", "grammar", "chart", "education"]
            }
        ];

        const reviews = [
            {
                id: "mock-1",
                userId: "user-1",
                userName: "আব্দুল করিম",
                userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100",
                targetId: 1,
                targetType: "teacher",
                targetName: "মো. করিম উদ্দিন",
                rating: 5,
                comment: "স্যারের পদার্থ বিজ্ঞান ক্লাসগুলো সত্যিই অসাধারণ। জটিল বিষয়গুলো খুব সহজে বুঝিয়ে দেন।",
                status: "approved",
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
            },
            {
                id: "mock-2",
                userId: "user-2",
                userName: "আয়েশা সিদ্দিকা",
                userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
                targetId: 2,
                targetType: "teacher",
                targetName: "ফাতেমা খাতুন",
                rating: 4,
                comment: "রসায়ন নিয়ে আমার অনেক ভয় ছিল, কিন্তু ম্যামের ক্লাস করে এখন অনেক কনফিডেন্স পাচ্ছি।",
                status: "approved",
                createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
            },
            {
                id: "mock-3",
                userId: "user-3",
                userName: "রাকিব হাসান",
                userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
                targetId: "course-1", // Stored as string in localStorage code for some reason, correcting to match schema mixed type
                targetType: "course",
                targetName: "ক্লাস ৯ প্রোগ্রাম",
                rating: 5,
                comment: "এই কোর্সের নোটগুলো খুব মানসম্মত। লাইভ ক্লাস মিস করলেও রেকর্ডিং দেখে নেওয়া যায়।",
                status: "approved",
                createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
            },
            {
                id: "mock-4",
                userId: "user-4",
                userName: "সুমাইয়া আক্তার",
                userAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
                targetId: "course-3",
                targetType: "course",
                targetName: "পলিটেকনিক প্রোগ্রাম",
                rating: 5,
                comment: "ডিপ্লোমা ভর্তি প্রস্তুতির জন্য এর চেয়ে ভালো প্ল্যাটফর্ম আর হতে পারে না। খুব উপকৃত হয়েছি।",
                status: "approved",
                createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
            },
            {
                id: "mock-5",
                userId: "user-5",
                userName: "তানভীর আহমেদ",
                userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
                targetId: 3,
                targetType: "teacher",
                targetName: "রহিম আলী",
                rating: 5,
                comment: "গণিত যে এত মজার হতে পারে তা স্যারের ক্লাস না করলে বুঝতাম না। ধন্যবাদ টেকনো কেয়ার একাডেমি।",
                status: "approved",
                createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
            }
        ];

        // Seed Functions
        await upsertData(User, users, 'id');
        await upsertData(Slide, slides, 'id');
        await upsertData(Book, books, 'id');
        await upsertData(Teacher, teachers, 'id');
        await upsertData(Institute, institutes, 'id');
        await upsertData(Course, courses, 'id');
        await upsertData(LiveClass, liveClasses, 'id');
        await upsertData(Schedule, schedules, 'id');
        await upsertData(Note, notes, 'id');
        await upsertData(Review, reviews, 'id');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

const upsertData = async (Model, data, key) => {
    for (const item of data) {
        await Model.findOneAndUpdate({ [key]: item[key] }, item, { upsert: true, new: true });
    }
    console.log(`Seeded ${Model.modelName}s`);
};

seedData();
