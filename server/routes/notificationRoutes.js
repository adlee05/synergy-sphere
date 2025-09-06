import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} from '../controllers/notificationController.js';

const router = express.Router();

// List notifications
router.get('/', verifyFirebaseToken, getNotifications);

// Get unread count
router.get('/unread-count', verifyFirebaseToken, getUnreadCount);

// Mark notification as read
router.put('/:id', verifyFirebaseToken, markAsRead);

// Mark all notifications as read
router.put('/', verifyFirebaseToken, markAllAsRead);

// Delete notification
router.delete('/:id', verifyFirebaseToken, deleteNotification);

export default router;

