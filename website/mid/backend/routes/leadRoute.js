import express from 'express';
import { createLead, listLeads, updateLeadStatus, removeLead } from '../controllers/leadController.js';
import adminAuth from '../middleware/adminAuth.js';
import { leadLimiter } from '../middleware/rateLimiter.js';
import { validateLead } from '../middleware/validation.js';

const leadRouter = express.Router();

leadRouter.post('/create', leadLimiter, validateLead, createLead);
leadRouter.post('/list', adminAuth, listLeads);
leadRouter.post('/status', adminAuth, updateLeadStatus);
leadRouter.post('/remove', adminAuth, removeLead);

export default leadRouter;
