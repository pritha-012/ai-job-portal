import express from 'express';
import { 
    createJob, 
    getMyJobs, 
    updateJob, 
    deleteJob, 
    getJobStats // 👈 1. Import the new controller
} from '../controllers/job.controllers.js';
import { protect, authorizeRoles } from '../middlewares/auth.middlewares.js'; // 👈 2. Updated middleware
import { responseTransformer } from "../transformers/response.transformers.js";
import { ROLES } from '../config/constants.config.js'; // 👈 3. Import your roles constant

const jobRoutes = express.Router();

// 🚨 THE GLOBAL LOCK 🚨
// This applies authentication and role-checking to EVERY route below it automatically.
jobRoutes.use(protect, authorizeRoles(ROLES.RECRUITER));

// --- 1. STATIC ROUTES (Must go first) ---
jobRoutes.post('/create', createJob, responseTransformer);
jobRoutes.get('/list-jobs', getMyJobs, responseTransformer);
jobRoutes.get('/stats', getJobStats, responseTransformer); // 👈 Added your new Stats API!

// --- 2. DYNAMIC ROUTES (Must go last) ---
jobRoutes.put('/update/:id', updateJob, responseTransformer);
jobRoutes.delete('/delete/:id', deleteJob, responseTransformer);

export default jobRoutes;