/**
 * Migration Script: Upload all base64 images to Cloudinary
 * 
 * Run with: node server/src/migrate-to-cloudinary.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const FormData = require('form-data');

// Cloudinary Configuration
const CLOUDINARY_CONFIG = {
    cloudName: 'deal7ji7s',
    uploadPreset: 'techno_care_academy',
    folder: 'techno_care_unsigned',
};

// Collections to migrate (model name -> image field(s))
const COLLECTIONS_TO_MIGRATE = [
    { model: 'Slide', fields: ['image'] },
    { model: 'Teacher', fields: ['image'] },
    { model: 'Book', fields: ['image', 'coverImage'] },
    { model: 'User', fields: ['profilePicture'] },
    { model: 'Institute', fields: ['image'] },
    { model: 'Course', fields: ['image'] },
    { model: 'Note', fields: ['image', 'thumbnail'] },
    { model: 'Student', fields: ['image'] },
];

// Check if string is base64 image
function isBase64Image(str) {
    return typeof str === 'string' && str.startsWith('data:image');
}

// Upload base64 to Cloudinary
async function uploadToCloudinary(base64String) {
    try {
        // Convert base64 to buffer
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Determine file type
        const matches = base64String.match(/^data:image\/(\w+);base64,/);
        const extension = matches ? matches[1] : 'png';

        const formData = new FormData();
        formData.append('file', buffer, { filename: `image.${extension}` });
        formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        formData.append('folder', CLOUDINARY_CONFIG.folder);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
            formData,
            { headers: formData.getHeaders() }
        );

        return response.data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error.response?.data || error.message);
        return null;
    }
}

async function migrateCollection(modelName, fields) {
    const Model = mongoose.model(modelName);
    console.log(`\n📦 Migrating ${modelName}...`);

    const docs = await Model.find({});
    let migratedCount = 0;
    let skippedCount = 0;

    for (const doc of docs) {
        let needsUpdate = false;
        const updates = {};

        for (const field of fields) {
            const value = doc[field];

            if (isBase64Image(value)) {
                console.log(`  📤 Uploading ${field} for ${modelName} ID: ${doc.id || doc._id}`);
                const cloudinaryUrl = await uploadToCloudinary(value);

                if (cloudinaryUrl) {
                    updates[field] = cloudinaryUrl;
                    needsUpdate = true;
                    console.log(`  ✅ Uploaded: ${cloudinaryUrl.substring(0, 60)}...`);
                } else {
                    console.log(`  ❌ Failed to upload ${field}`);
                }
            } else if (value && !value.includes('cloudinary.com') && !value.startsWith('http')) {
                skippedCount++;
            }
        }

        if (needsUpdate) {
            await Model.updateOne({ _id: doc._id }, { $set: updates });
            migratedCount++;
        }
    }

    console.log(`  📊 ${modelName}: ${migratedCount} migrated, ${skippedCount} skipped`);
    return migratedCount;
}

async function main() {
    console.log('🚀 Starting Cloudinary Migration...\n');
    console.log('Connecting to MongoDB...');

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Import models
        require('./models/Slide');
        require('./models/Teacher');
        require('./models/Book');
        require('./models/User');
        require('./models/Institute');
        require('./models/Course');
        require('./models/Note');
        require('./models/Student');

        let totalMigrated = 0;

        for (const { model, fields } of COLLECTIONS_TO_MIGRATE) {
            try {
                const count = await migrateCollection(model, fields);
                totalMigrated += count;
            } catch (error) {
                console.error(`  ⚠️ Error migrating ${model}:`, error.message);
            }
        }

        console.log(`\n✨ Migration complete! Total images migrated: ${totalMigrated}`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n👋 Disconnected from MongoDB');
    }
}

main();
