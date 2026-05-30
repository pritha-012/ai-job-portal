import express from 'express';
import { getMyNotifications, markAsRead } from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { responseTransformer } from "../transformers/response.transformers.js";


const notificationRoutes = express.Router();

// All notification routes must be protected
notificationRoutes.use(protect);

notificationRoutes.get('/', getMyNotifications,responseTransformer);
notificationRoutes.put('/:id/read', markAsRead,responseTransformer);

export default notificationRoutes;