import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import {
  addMember,
  removeMember,
  getMembers
} from '../controllers/projectMemberController.js';

const router = express.Router();

// Add member
router.post('/:id/members', verifyFirebaseToken, addMember);

// Remove member
router.delete('/:id/members/:userId', verifyFirebaseToken, removeMember);

// List members
router.get('/:id/members', verifyFirebaseToken, getMembers);

export default router;

