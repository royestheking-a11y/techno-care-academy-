
const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
            maxPoolSize: 10, // Restrict pool size for serverless/M0 limits
        };

        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI is undefined! Check Vercel Environment Variables.');
            throw new Error('MONGODB_URI is undefined');
        }

        cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
            console.log(`✅ MongoDB Connected via Cached Connection. DB Name: "${mongoose.connection.name}"`);
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;
