import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';

const router = express.Router();

// Create task
router.post('/:id/tasks', verifyFirebaseToken, createTask);

// List tasks
router.get('/:id/tasks', verifyFirebaseToken, getTasks);

// Task details
router.get('/tasks/:taskId', verifyFirebaseToken, getTaskById);

// Update task
router.put('/tasks/:taskId', verifyFirebaseToken, updateTask);

// Delete task
router.delete('/tasks/:taskId', verifyFirebaseToken, deleteTask);

export default router;

