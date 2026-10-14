import mongoose from 'mongoose';

// Enquiries from the storefront: showroom visits, custom orders, call-backs, bulk orders, newsletter
export const LEAD_TYPES = ['visit', 'custom', 'callback', 'bulk', 'newsletter', 'product'];
export const LEAD_STATUSES = ['New', 'Contacted', 'Converted', 'Closed'];

const leadSchema = new mongoose.Schema({
    type: { type: String, enum: LEAD_TYPES, required: true, index: true },
    name: { type: String, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, maxlength: 200 },
    message: { type: String, trim: true, maxlength: 2000 },
    preferredDate: { type: String, trim: true, maxlength: 20 },
    preferredTime: { type: String, trim: true, maxlength: 20 },
    budget: { type: String, trim: true, maxlength: 50 },
    productId: { type: String, trim: true, maxlength: 50 },
    productName: { type: String, trim: true, maxlength: 200 },
    images: { type: [String], default: [] },
    status: { type: String, enum: LEAD_STATUSES, default: 'New' },
    createdAt: { type: Date, default: Date.now, index: true },
});

const leadModel = mongoose.models.lead || mongoose.model('lead', leadSchema);
export default leadModel;
