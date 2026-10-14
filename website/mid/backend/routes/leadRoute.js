import express from 'express';
import { createLead, listLeads, updateLeadStatus, removeLead } from '../controllers/leadController.js';
import adminAuth from '../middleware/adminAuth.js';
import { leadLimiter } from '../middleware/rateLimiter.js';
import { validateLead } from '../middleware/validation.js';
import { acceptPhotos } from '../utils/uploadImages.js';

const leadRouter = express.Router();

// reference photos are optional (custom-order requests)
leadRouter.post('/create', leadLimiter, acceptPhotos(3), validateLead, createLead);
leadRouter.post('/list', adminAuth, listLeads);
leadRouter.post('/status', adminAuth, updateLeadStatus);
leadRouter.post('/remove', adminAuth, removeLead);

export default leadRouter;
