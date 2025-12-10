import {
  getCourses,
  // saveCourse,
  // updateCourse,
  // deleteCourse,
  getLiveClasses,
  // saveLiveClass, 
  // ...
  getEnrollments,
  saveEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getOrders,
  saveOrder,
  updateOrder,
  deleteOrder,
  getReviews,
  saveReview,
  updateReviewStatus,
  deleteReview,
  getSchedules,
  saveSchedule,
  updateSchedule,
  deleteSchedule,
  getStudents,
  saveStudent,
  updateStudent,
  deleteStudent,
  getMessages,
  saveMessage,
  updateMessage,
  deleteMessage,
  getBooks,
  getTeachers,
  getInstitutes,
  getNotes
  // ... 
} from './localStorage';

// Define generic interfaces matching the expected usage in components
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Helper to wrap calls
const wrap = async <T>(fn: () => Promise<T>): Promise<ApiResponse<T>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error: any) {
    console.error("API Error:", error);
    return { success: false, data: [] as any, error: error.message };
  }
};

// --- API Objects ---

export const coursesAPI = {
  getAll: async () => wrap(getCourses),
  getById: async (id: number) => {
    try {
      const courses = await getCourses();
      const course = courses.find((c: any) => c.id === id);
      return { success: !!course, data: course || {} };
    } catch (error) {
      return { success: false, data: {} };
    }
  }
};

export const liveClassesAPI = {
  getAll: async () => wrap(getLiveClasses),
};

export const schedulesAPI = {
  getAll: async () => wrap(getSchedules),
  create: async (data: any) => {
    try {
      const res = await saveSchedule(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  update: async (id: number, data: any) => {
    try {
      const res = await updateSchedule(id, data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  delete: async (id: number) => {
    try {
      await deleteSchedule(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};

export const teachersAPI = {
  getAll: async () => wrap(getTeachers),
};

export const studentsAPI = {
  getAll: async () => wrap(getStudents),
  create: async (data: any) => {
    try {
      const res = await saveStudent(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  update: async (id: number, data: any) => {
    try {
      const res = await updateStudent(id, data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  delete: async (id: number) => {
    try {
      await deleteStudent(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};

export const booksAPI = {
  getAll: async () => wrap(getBooks),
};

export const polytechnicInstitutesAPI = {
  getAll: async () => wrap(getInstitutes),
};

export const statisticsAPI = {
  getAll: async () => {
    // Mock or implement backend endpoint if exists
    return {
      success: true,
      data: {
        totalStudents: 10000,
        totalCourses: 50,
        totalTeachers: 100,
        successRate: 95,
      }
    };
  }
};

// Enrollments
export const enrollmentsAPI = {
  getAll: async () => wrap(getEnrollments),
  create: async (data: any) => {
    try {
      const res = await saveEnrollment(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  update: async (id: string, data: any) => {
    try {
      const res = await updateEnrollment(id, data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  delete: async (id: string) => {
    try {
      await deleteEnrollment(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};

// Messages
export const messagesAPI = {
  getAll: async () => wrap(getMessages),
  create: async (data: any) => {
    try {
      const res = await saveMessage(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  update: async (id: string | number, data: any) => {
    try {
      const res = await updateMessage(id, data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  delete: async (id: string | number) => {
    try {
      await deleteMessage(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};

// Orders
export const ordersAPI = {
  getAll: async () => wrap(getOrders),
  create: async (data: any) => {
    try {
      const res = await saveOrder(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  update: async (id: string, data: any) => {
    try {
      const res = await updateOrder(id, data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  delete: async (id: string) => {
    try {
      await deleteOrder(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};

// Notes
export const notesAPI = {
  getAll: async () => wrap(getNotes),
};

// Reviews
export const reviewsAPI = {
  getAll: async () => wrap(getReviews),
  create: async (data: any) => {
    try {
      const res = await saveReview(data);
      return { success: true, data: res };
    } catch (err: any) { return { success: false, data: {}, error: err.message }; }
  },
  updateStatus: async (id: string, status: "approved" | "hidden") => {
    try {
      await updateReviewStatus(id, status);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  },
  delete: async (id: string) => {
    try {
      await deleteReview(id);
      return { success: true, data: undefined };
    } catch (err: any) { return { success: false, data: undefined, error: err.message }; }
  }
};