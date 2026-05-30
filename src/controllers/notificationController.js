import Notification from '../models/notification.model.js';

export const getMyNotifications = async (req, res) => {
    try {
        // Fetch notifications for the logged-in user, sorted by newest first
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20); // Only send the latest 20 to keep the API fast

        // Count how many are unread (so the frontend can show a red bubble with a number on the 🔔)
        const unreadCount = await Notification.countDocuments({ 
            recipient: req.user._id, 
            isRead: false 
        });

        res.status(200).json({ 
            success: true, 
            data: {
                notifications,
                unreadCount
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const markAsRead = async (req, res) => {
    try {
        // Find a specific notification and mark it as read
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id }, // Ensure they own it!
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};