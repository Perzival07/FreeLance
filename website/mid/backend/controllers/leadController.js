import mongoose from 'mongoose';
import leadModel, { LEAD_STATUSES, LEAD_TYPES } from '../models/leadModel.js';
import { sendAdminLeadAlert } from '../services/emailService.js';
import { uploadToCloudinary } from '../utils/uploadImages.js';

const PUBLIC_FIELDS = ['type', 'name', 'phone', 'email', 'message', 'preferredDate', 'preferredTime', 'budget', 'productId', 'productName'];

// Public: storefront forms (book a visit, custom order, call-back, bulk, newsletter)
const createLead = async (req, res) => {
    try {
        const data = {};
        for (const key of PUBLIC_FIELDS) {
            if (req.body[key] !== undefined && req.body[key] !== '') data[key] = String(req.body[key]).trim();
        }

        if (data.type === 'newsletter') {
            const existing = await leadModel.findOne({ type: 'newsletter', email: data.email?.toLowerCase() });
            if (existing) {
                return res.json({ success: true, message: "You're already subscribed — thank you!" });
            }
        }

        if (req.files?.length) {
            data.images = await uploadToCloudinary(req.files, 'enquiries');
        }

        const lead = await leadModel.create(data);
        // Don't make the customer wait for the email
        sendAdminLeadAlert(lead).catch((err) => console.error('Lead alert email error:', err));

        const messages = {
            newsletter: "Thanks for subscribing! You'll hear about new arrivals and offers first.",
            visit: "Your visit is booked. We'll call you to confirm.",
        };
        res.json({ success: true, message: messages[data.type] || "Thank you! Our team will contact you shortly." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: 'Could not submit right now. Please call or WhatsApp us.' });
    }
};

// Admin: list enquiries, newest first
const listLeads = async (req, res) => {
    try {
        const filter = {};
        if (LEAD_TYPES.includes(req.body.type)) filter.type = req.body.type;
        if (LEAD_STATUSES.includes(req.body.status)) filter.status = req.body.status;
        const leads = await leadModel.find(filter).sort({ createdAt: -1 }).limit(500).lean();
        const newCount = await leadModel.countDocuments({ status: 'New' });
        res.json({ success: true, leads, newCount });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const updateLeadStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id) || !LEAD_STATUSES.includes(status)) {
            return res.json({ success: false, message: 'Invalid request' });
        }
        await leadModel.findByIdAndUpdate(id, { status });
        res.json({ success: true, message: 'Status updated' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const removeLead = async (req, res) => {
    try {
        const { id } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.json({ success: false, message: 'Invalid request' });
        }
        await leadModel.findByIdAndDelete(id);
        res.json({ success: true, message: 'Enquiry removed' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { createLead, listLeads, updateLeadStatus, removeLead };
