// Cloudinary Configuration
export const CLOUDINARY_CONFIG = {
    cloudName: 'deal7ji7s',
    uploadPreset: 'techno_care_academy',
    folder: 'techno_care_unsigned',
};

// Upload image to Cloudinary
export async function uploadToCloudinary(file: File | Blob | string): Promise<string> {
    const formData = new FormData();

    // Handle base64 string
    if (typeof file === 'string' && file.startsWith('data:')) {
        // Convert base64 to blob
        const response = await fetch(file);
        const blob = await response.blob();
        formData.append('file', blob);
    } else if (typeof file === 'object' && file !== null) {
        formData.append('file', file as Blob);
    } else {
        throw new Error('Invalid file type');
    }

    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Cloudinary upload error:', error);
        throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
}

// Get optimized image URL from Cloudinary
export function getOptimizedImageUrl(
    url: string,
    options?: {
        width?: number;
        height?: number;
        quality?: 'auto' | number;
        format?: 'auto' | 'webp' | 'jpg' | 'png';
    }
): string {
    // If not a Cloudinary URL, return as-is
    if (!url || !url.includes('cloudinary.com')) {
        return url;
    }

    const { width, height, quality = 'auto', format = 'auto' } = options || {};

    // Build transformation string
    const transforms: string[] = [];

    if (width) transforms.push(`w_${width}`);
    if (height) transforms.push(`h_${height}`);
    transforms.push(`q_${quality}`);
    transforms.push(`f_${format}`);

    const transformString = transforms.join(',');

    // Insert transformations into URL
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{transformations}/{public_id}
    return url.replace('/upload/', `/upload/${transformString}/`);
}

// Check if URL is a base64 data URL
export function isBase64Image(url: string): boolean {
    return typeof url === 'string' && url.startsWith('data:image');
}

// Check if URL is a Cloudinary URL
export function isCloudinaryUrl(url: string): boolean {
    return typeof url === 'string' && url.includes('cloudinary.com');
}
// Generate a download URL for Cloudinary resources (forces download with fl_attachment)
export function getDownloadUrl(url: string, filename?: string): string {
    if (!isCloudinaryUrl(url)) {
        return url;
    }

    // Insert fl_attachment into the URL
    // Format: /upload/fl_attachment:filename/
    // or just /upload/fl_attachment/ if no filename

    // Sanitize filename if provided
    const attachmentFlag = filename
        ? `fl_attachment:${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        : 'fl_attachment';

    return url.replace('/upload/', `/upload/${attachmentFlag}/`);
}

// Upload generic file to Cloudinary (auto detects type: image, video, raw)
export async function uploadFileToCloudinary(file: File | Blob): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
    formData.append('folder', CLOUDINARY_CONFIG.folder);
    formData.append('resource_type', 'auto');

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error('Cloudinary upload error:', error);
        throw new Error(`Upload failed: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
}
