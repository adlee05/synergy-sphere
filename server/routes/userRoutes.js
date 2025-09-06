import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import {
  syncUser,
  getProfile,
  updateProfile,
  getUserById
} from '../controllers/userController.js';

const router = express.Router();

// Sync user with Firebase data
router.post('/sync-user', verifyFirebaseToken, syncUser);

// Get own profile
router.get('/me', verifyFirebaseToken, getProfile);

// Update own profile
router.put('/me', verifyFirebaseToken, updateProfile);

// Get user by ID
router.get('/:id', verifyFirebaseToken, getUserById);

export default router;

