const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConnect');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors()); // Allow all origins for simplicity, or configure specific domains
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Cache Middleware
// Caches GET requests for 5 minutes to reduce server load and speed up client
const cacheMiddleware = (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
        return next();
    }

    // Exclude private/sensitive routes from caching
    // content that changes per user or shouldn't be publicly cached
    const noCacheRoutes = [
        '/api/users',
        '/api/orders',
        '/api/enrollments',
        '/api/messages',
        '/api/saved-notes'
    ];

    if (noCacheRoutes.some(route => req.path.startsWith(route))) {
        return next();
    }

    // Set Cache-Control header for public data (Courses, Teachers, etc.)
    // public: can be cached by anyone (browser, CDN)
    // max-age=300: cache for 300 seconds (5 minutes)
    res.set('Cache-Control', 'public, max-age=300');
    next();
};

app.use(cacheMiddleware);

// Database Connection Middleware
// This ensures DB is connected before handling any request in serverless environment
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

const createCrudRouter = require('./routes/crud');

// Import Models
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
const Student = require('./models/Student');
const Message = require('./models/Message');

// Routes - with image field configuration for Cloudinary cleanup
app.use('/api/users', createCrudRouter(User, { imageFields: ['profilePicture'] }));
app.use('/api/courses', createCrudRouter(Course, { imageFields: ['image'] }));
app.use('/api/enrollments', createCrudRouter(Enrollment));
app.use('/api/orders', createCrudRouter(Order));
app.use('/api/reviews', createCrudRouter(Review));
app.use('/api/notes', createCrudRouter(Note, { imageFields: ['fileUrl', 'thumbnail'] }));
app.use('/api/saved-notes', createCrudRouter(SavedNote));
app.use('/api/slides', createCrudRouter(Slide, { imageFields: ['image'] }));
app.use('/api/books', createCrudRouter(Book, { imageFields: ['image'] }));
app.use('/api/teachers', createCrudRouter(Teacher, { imageFields: ['image'] }));
app.use('/api/institutes', createCrudRouter(Institute, { imageFields: ['image'] }));
app.use('/api/live-classes', createCrudRouter(LiveClass, { imageFields: ['thumbnail'] }));
app.use('/api/schedules', createCrudRouter(Schedule));
app.use('/api/students', createCrudRouter(Student, { imageFields: ['image'] }));
app.use('/api/messages', createCrudRouter(Message));

// Auth Route (Simple Login)
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });

        if (user) {
            if (user.isDisabled) {
                return res.status(403).json({ message: 'Account is disabled' });
            }
            res.json(user);
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Techno Care Academy API is running');
});

// Conditionally listen if not in production/serverless environment or if run directly
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export the app for Vercel
module.exports = app;
