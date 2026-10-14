import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import upload from '../middleware/multer.js';

// Uploads multer memory files to Cloudinary; returns the secure URLs
export const uploadToCloudinary = async (files = [], folder) =>
    Promise.all(
        files.map(async (file) => {
            const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(dataUri, { resource_type: 'image', folder });
            return result.secure_url;
        })
    );

// Accepts up to `max` photos in an "images" field and turns upload errors into JSON
export const acceptPhotos = (max = 3) => (req, res, next) => {
    upload.array('images', max)(req, res, (err) => {
        if (!err) return next();
        if (err instanceof multer.MulterError) {
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? 'Each photo must be 5MB or smaller'
                : err.code === 'LIMIT_UNEXPECTED_FILE'
                ? `You can attach up to ${max} photos`
                : err.message;
            return res.status(400).json({ success: false, message });
        }
        return res.status(400).json({ success: false, message: err.message || 'Upload failed' });
    });
};
