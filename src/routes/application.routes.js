import express from 'express';
import { getRecruiterApplications, updateApplicantStatus } from '../controllers/application.controllers.js';
import { protect, authorizeRoles } from '../middlewares/auth.middlewares.js';
import { responseTransformer } from "../transformers/response.transformers.js";
import { ROLES } from '../config/constants.config.js';

const applicationRoutes = express.Router();

// Apply global recruiter protection to all applicant handling routes
applicationRoutes.use(protect, authorizeRoles(ROLES.RECRUITER));

applicationRoutes.get('/recruiter-list', getRecruiterApplications, responseTransformer);
applicationRoutes.patch('/status/:id', updateApplicantStatus, responseTransformer);

export default applicationRoutes;