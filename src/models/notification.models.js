import mongoose from 'mongoose';
import { NOTIFICATION_TYPES } from '../config/constants.config.js';

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    message: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        enum: Object.values(NOTIFICATION_TYPES), 
        default: NOTIFICATION_TYPES.SYSTEM 
    },
    // Optional: Stores the Job ID or Application ID so the frontend can make the notification clickable!
    relatedId: { 
        type: mongoose.Schema.Types.ObjectId 
    },
    isRead: { 
        type: Boolean, 
        default: false 
    }
}, { timestamps: true });


const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;