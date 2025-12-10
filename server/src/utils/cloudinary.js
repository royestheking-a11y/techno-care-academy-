/**
 * Cloudinary Utility Module
 * Handles image deletion from Cloudinary when records are deleted from MongoDB
 */

const axios = require('axios');
const crypto = require('crypto');

// Cloudinary configuration
const CLOUDINARY_CONFIG = {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || 'deal7ji7s',
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
};

/**
 * Extract public_id from a Cloudinary URL
 * URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} - The public_id or null if not a Cloudinary URL
 */
function extractPublicId(url) {
    if (!url || typeof url !== 'string') return null;

    // Check if it's a Cloudinary URL
    if (!url.includes('cloudinary.com')) return null;

    try {
        // Match pattern: /upload/v{version}/{folder}/{filename}
        // or /upload/{folder}/{filename}
        const uploadMatch = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
        if (uploadMatch && uploadMatch[1]) {
            return uploadMatch[1];
        }

        return null;
    } catch (error) {
        console.error('Error extracting public_id from URL:', url, error);
        return null;
    }
}

/**
 * Generate signature for Cloudinary API request
 * @param {object} params - Parameters to sign
 * @returns {string} - SHA1 signature
 */
function generateSignature(params) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    const stringToSign = sortedParams + CLOUDINARY_CONFIG.apiSecret;
    return crypto.createHash('sha1').update(stringToSign).digest('hex');
}

/**
 * Delete an image from Cloudinary
 * @param {string} imageUrl - Cloudinary image URL
 * @returns {Promise<boolean>} - True if deleted successfully, false otherwise
 */
async function deleteFromCloudinary(imageUrl) {
    const publicId = extractPublicId(imageUrl);

    if (!publicId) {
        console.log('⏭️ Skipping non-Cloudinary URL:', imageUrl?.substring(0, 50));
        return false;
    }

    if (!CLOUDINARY_CONFIG.apiKey || !CLOUDINARY_CONFIG.apiSecret) {
        console.warn('⚠️ Cloudinary API credentials not configured. Image not deleted from Cloudinary.');
        console.warn('   Add CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to your .env file');
        return false;
    }

    try {
        const timestamp = Math.floor(Date.now() / 1000);
        const params = {
            public_id: publicId,
            timestamp: timestamp,
        };

        const signature = generateSignature(params);

        const formData = new URLSearchParams();
        formData.append('public_id', publicId);
        formData.append('timestamp', timestamp.toString());
        formData.append('api_key', CLOUDINARY_CONFIG.apiKey);
        formData.append('signature', signature);

        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/destroy`,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (response.data.result === 'ok') {
            console.log('✅ Deleted from Cloudinary:', publicId);
            return true;
        } else {
            console.warn('⚠️ Cloudinary delete response:', response.data);
            return false;
        }
    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error.response?.data || error.message);
        return false;
    }
}

/**
 * Delete multiple images from Cloudinary
 * @param {string[]} imageUrls - Array of Cloudinary image URLs
 * @returns {Promise<void>}
 */
async function deleteMultipleFromCloudinary(imageUrls) {
    if (!imageUrls || !Array.isArray(imageUrls)) return;

    const validUrls = imageUrls.filter(url => url && typeof url === 'string');

    for (const url of validUrls) {
        await deleteFromCloudinary(url);
    }
}

module.exports = {
    extractPublicId,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary,
};
