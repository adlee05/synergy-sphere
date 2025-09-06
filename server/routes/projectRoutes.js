import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';

const router = express.Router();

// Create project
router.post('/', verifyFirebaseToken, createProject);

// List projects
router.get('/', verifyFirebaseToken, getProjects);

// Get project details
router.get('/:id', verifyFirebaseToken, getProjectById);

// Update project
router.put('/:id', verifyFirebaseToken, updateProject);

// Delete project
router.delete('/:id', verifyFirebaseToken, deleteProject);

export default router;
