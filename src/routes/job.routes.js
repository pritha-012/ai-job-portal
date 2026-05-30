import express from 'express';
import { createJob, getMyJobs, updateJob, deleteJob } from '../controllers/job.controllers.js';
import { protect,authorize } from '../middlewares/auth.middlewares.js';
import { responseTransformer } from "../transformers/response.transformers.js";

const jobRoutes = express.Router();

jobRoutes.post('/create', protect,authorize('recruiter'), createJob,responseTransformer);
jobRoutes.get('/list-jobs', protect,authorize('recruiter'), getMyJobs,responseTransformer);
jobRoutes.put('/update/:id', protect,authorize('recruiter'), updateJob,responseTransformer);
jobRoutes.delete('/delete/:id', protect,authorize('recruiter'), deleteJob,responseTransformer);

export default jobRoutes;