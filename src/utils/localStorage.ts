import api from '../services/api';
import { cachedFetch, CACHE_KEYS, clearCache } from './cache';

// --- Interfaces ---

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  profilePicture?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: string;
  isVerified?: boolean;
  isDisabled?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  targetId: number | string;
  targetType: "course" | "teacher" | "class";
  targetName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "hidden";
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: number;
  courseName: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  status: 'pending' | 'confirmed' | 'rejected';
  createdAt: string;
  courseTitle?: string;
  courseDuration?: string;
  coursePrice?: string | number;
}

export interface Order {
  id: string;
  userId: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  bookPrice: number;
  quantity: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  courseTitle?: string;
  courseDuration?: string;
  coursePrice?: number;
}

export interface Note {
  id: number;
  courseId: number;
  title: string;
  description: string;
  fileType: 'pdf' | 'image' | 'pptx';
  fileUrl: string;
  thumbnail?: string;
  createdAt: string;
  views?: number;
  downloads?: number;
}

export interface SavedNote {
  id: string;
  userId: string;
  noteId: number;
  noteTitle: string;
  noteDescription: string;
  fileType: string;
  fileUrl: string;
  thumbnail?: string;
  savedAt: string;
}

export interface Slide {
  id: string;
  institute?: string;
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  originalPrice?: string;
  discount: string;
  image: string;
  inStock: boolean;
  description?: string;
}

export interface Teacher {
  id: number;
  name: string;
  subject: string;
  qualification: string;
  experience: string;
  rating?: number;
  students?: string;
  initial?: string;
  image: string;
  category: string;
}

export interface Institute {
  id: string;
  name: string;
  location: string;
  image: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  programs?: string[];
  established?: string;
  createdAt?: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  image: string;
  enrolled: string;
  category: string;
  price: string;
}

export interface LiveClass {
  id: string;
  title: string;
  description: string;
  instructor: string;
  subject: string;
  category: "class9" | "class10" | "polytechnic";
  date: string;
  time: string;
  duration: string;
  meetingLink: string;
  thumbnail?: string;
  isActive: boolean;
  maxStudents: number;
  enrolledStudents: number;
  createdAt: string;
}

export interface Schedule {
  id: number;
  day: string;
  subject: string;
  teacher: string;
  time: string;
  platform: string;
  link: string;
  isLive: boolean;
}

export interface Student {
  id: number;
  name: string;
  result: string;
  achievement: string;
  year: string;
  initial: string;
  image: string;
}

export interface Message {
  id: number | string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'read' | 'unread';
  createdAt: string;
}

// --- API Functions with Fallback ---

// Users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, returning empty users:', error);
    return [];
  }
};

export const saveUser = async (user: User) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id: string, updates: Partial<User>) => {
  const response = await api.put(`/users/${id}`, updates);
  return response.data;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/users/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    return false;
  }
};

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
  const users = await getUsers();
  return users.find(u => u.email === email);
};

// Enrollments
export const getEnrollments = async (): Promise<Enrollment[]> => {
  try {
    const response = await api.get('/enrollments');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, returning empty enrollments:', error);
    return [];
  }
};

export const saveEnrollment = async (enrollment: Enrollment) => {
  const response = await api.post('/enrollments', enrollment);
  return response.data;
};

export const updateEnrollment = async (id: string, updates: Partial<Enrollment>) => {
  const response = await api.put(`/enrollments/${id}`, updates);
  return response.data;
};

export const deleteEnrollment = async (id: string) => {
  await api.delete(`/enrollments/${id}`);
};

export const getUserEnrollments = async (userId: string): Promise<Enrollment[]> => {
  const all = await getEnrollments();
  return all.filter(e => String(e.userId) === String(userId));
};

// Orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, returning empty orders:', error);
    return [];
  }
};

export const saveOrder = async (order: Order) => {
  const response = await api.post('/orders', order);
  return response.data;
};

export const updateOrder = async (id: string, updates: Partial<Order>) => {
  const response = await api.put(`/orders/${id}`, updates);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  await api.delete(`/orders/${id}`);
};

export const getUserOrders = async (userId: string): Promise<Order[]> => {
  const all = await getOrders();
  return all.filter(o => o.userId === userId);
};

// Reviews
export const getReviews = async (): Promise<Review[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.REVIEWS, async () => {
      const response = await api.get('/reviews');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty reviews:', error);
    return [];
  }
};

export const saveReview = async (reviewData: Omit<Review, "id" | "createdAt" | "status">): Promise<Review> => {
  const newReview = {
    ...reviewData,
    status: "pending"
  };
  const response = await api.post('/reviews', newReview);
  clearCache(CACHE_KEYS.REVIEWS);
  return response.data;
};

export const updateReviewStatus = async (id: string, status: "approved" | "hidden"): Promise<boolean> => {
  try {
    await api.put(`/reviews/${id}`, { status });
    clearCache(CACHE_KEYS.REVIEWS);
    return true;
  } catch (e) {
    return false;
  }
};

export const deleteReview = async (id: string): Promise<boolean> => {
  try {
    await api.delete(`/reviews/${id}`);
    clearCache(CACHE_KEYS.REVIEWS);
    return true;
  } catch (e) {
    return false;
  }
};

// Notes
export const getNotes = async (): Promise<Note[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.NOTES, async () => {
      const response = await api.get('/notes');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty notes:', error);
    return [];
  }
};

export const saveNote = async (note: Note) => {
  const response = await api.post('/notes', note);
  return response.data;
};

export const updateNote = async (id: number, updates: Partial<Note>) => {
  const response = await api.put(`/notes/${id}`, updates);
  return response.data;
};

export const deleteNote = async (id: number) => {
  await api.delete(`/notes/${id}`);
};

export const getCourseNotes = async (courseId: number): Promise<Note[]> => {
  const all = await getNotes();
  return all.filter(n => n.courseId === courseId);
};

export const hasNoteAccess = async (userId: string, courseId: number): Promise<boolean> => {
  const enrollments = await getUserEnrollments(userId);
  return enrollments.some(
    e => e.courseId === courseId && e.status === 'confirmed'
  );
};

// Saved Notes
export const getSavedNotes = async (): Promise<SavedNote[]> => {
  try {
    const response = await api.get('/saved-notes');
    return response.data;
  } catch (error) {
    console.warn('API unavailable, returning empty saved notes:', error);
    return [];
  }
};

export const getUserSavedNotes = async (userId: string): Promise<SavedNote[]> => {
  const all = await getSavedNotes();
  return all.filter(sn => sn.userId === userId);
};

export const saveNoteToCollection = async (savedNote: SavedNote) => {
  const response = await api.post('/saved-notes', savedNote);
  return response.data;
};

export const removeSavedNote = async (id: string) => {
  await api.delete(`/saved-notes/${id}`);
};

export const isNoteSaved = async (userId: string, noteId: number): Promise<boolean> => {
  const savedNotes = await getUserSavedNotes(userId);
  return savedNotes.some(sn => sn.noteId === noteId);
};

// Slides
export const getSlides = async (): Promise<Slide[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.SLIDES, async () => {
      const response = await api.get('/slides');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty slides:', error);
    return [];
  }
};

export const saveSlide = async (slide: Slide) => {
  const response = await api.post('/slides', slide);
  clearCache(CACHE_KEYS.SLIDES);
  return response.data;
};

export const saveAllSlides = async (slides: Slide[]) => {
  // Not supported by simple CRUD, maybe loop or bulk API?
  // For now, sequentially save (inefficient) or ignore if not used often.
  // Assuming this is used for reordering.
  for (const s of slides) {
    await updateSlide(s.id, s);
  }
};

export const updateSlide = async (id: string, updates: Partial<Slide>) => {
  const response = await api.put(`/slides/${id}`, updates);
  clearCache(CACHE_KEYS.SLIDES);
  return response.data;
};

export const deleteSlide = async (id: string) => {
  await api.delete(`/slides/${id}`);
  clearCache(CACHE_KEYS.SLIDES);
};

// Books
export const getBooks = async (): Promise<Book[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.BOOKS, async () => {
      const response = await api.get('/books');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty books:', error);
    return [];
  }
};

export const saveBook = async (book: Book) => {
  const response = await api.post('/books', book);
  return response.data;
};

export const updateBook = async (id: number, updates: Partial<Book>) => {
  const response = await api.put(`/books/${id}`, updates);
  return response.data;
};

export const deleteBook = async (id: number) => {
  await api.delete(`/books/${id}`);
};

// Teachers
export const getTeachers = async (): Promise<Teacher[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.TEACHERS, async () => {
      const response = await api.get('/teachers');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty teachers:', error);
    return [];
  }
};

export const saveTeacher = async (teacher: Teacher) => {
  const response = await api.post('/teachers', teacher);
  return response.data;
};

export const updateTeacher = async (id: number, updates: Partial<Teacher>) => {
  const response = await api.put(`/teachers/${id}`, updates);
  return response.data;
};

export const deleteTeacher = async (id: number) => {
  await api.delete(`/teachers/${id}`);
};

// Institutes
export const getInstitutes = async (): Promise<Institute[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.INSTITUTES, async () => {
      const response = await api.get('/institutes');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty institutes:', error);
    return [];
  }
};

export const saveInstitute = async (institute: Institute) => {
  const response = await api.post('/institutes', institute);
  return response.data;
};

export const updateInstitute = async (id: string, updates: Partial<Institute>) => {
  const response = await api.put(`/institutes/${id}`, updates);
  return response.data;
};

export const deleteInstitute = async (id: string) => {
  await api.delete(`/institutes/${id}`);
};

// Courses
export const getCourses = async (): Promise<Course[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.COURSES, async () => {
      const response = await api.get('/courses');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty courses:', error);
    return [];
  }
};

export const saveCourse = async (course: Course) => {
  const response = await api.post('/courses', course);
  return response.data;
};

export const updateCourse = async (id: number, updates: Partial<Course>) => {
  const response = await api.put(`/courses/${id}`, updates);
  return response.data;
};

export const deleteCourse = async (id: number) => {
  await api.delete(`/courses/${id}`);
};

// Live Classes
export const getLiveClasses = async (): Promise<LiveClass[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.LIVE_CLASSES, async () => {
      const response = await api.get('/live-classes');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty live classes:', error);
    return [];
  }
};

export const saveLiveClass = async (liveClass: LiveClass) => {
  const response = await api.post('/live-classes', liveClass);
  return response.data;
};

export const updateLiveClass = async (id: string, updates: Partial<LiveClass>) => {
  const response = await api.put(`/live-classes/${id}`, updates);
  return response.data;
};

export const deleteLiveClass = async (id: string) => {
  await api.delete(`/live-classes/${id}`);
};

// Schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.SCHEDULES, async () => {
      const response = await api.get('/schedules');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty schedules:', error);
    return [];
  }
};

export const saveSchedule = async (schedule: Schedule) => {
  const response = await api.post('/schedules', schedule);
  return response.data;
};

export const updateSchedule = async (id: number, updates: Partial<Schedule>) => {
  const response = await api.put(`/schedules/${id}`, updates);
  return response.data;
};

export const deleteSchedule = async (id: number) => {
  await api.delete(`/schedules/${id}`);
};

// Students (Success Stories)
// Students (Success Stories)
export const getStudents = async (): Promise<Student[]> => {
  try {
    return await cachedFetch(CACHE_KEYS.STUDENTS, async () => {
      const response = await api.get('/students');
      return response.data;
    });
  } catch (error) {
    console.warn('API unavailable, returning empty students:', error);
    return [];
  }
};
export const saveStudent = async (student: Student) => {
  const response = await api.post('/students', student);
  clearCache(CACHE_KEYS.STUDENTS);
  return response.data;
};
export const updateStudent = async (id: number, updates: Partial<Student>) => {
  const response = await api.put(`/students/${id}`, updates);
  clearCache(CACHE_KEYS.STUDENTS);
  return response.data;
};
export const deleteStudent = async (id: number) => {
  await api.delete(`/students/${id}`);
  clearCache(CACHE_KEYS.STUDENTS);
};

// Messages
export const getMessages = async (): Promise<Message[]> => {
  try {
    const response = await api.get('/messages');
    // Map _id to id for backward compatibility with existing messages
    return response.data.map((msg: any) => ({
      ...msg,
      id: msg.id || msg._id,
    }));
  } catch (error) {
    console.warn('API unavailable, returning empty messages:', error);
    return [];
  }
};
export const saveMessage = async (message: Message) => {
  const response = await api.post('/messages', message);
  return response.data;
};
export const updateMessage = async (id: string | number, updates: Partial<Message>) => {
  const response = await api.put(`/messages/${id}`, updates);
  return response.data;
};
export const deleteMessage = async (id: string | number) => {
  await api.delete(`/messages/${id}`);
};

export const initializeApp = async () => {
  // No-op for API based app, or maybe check server health?
  console.log("App initialized with API");
};