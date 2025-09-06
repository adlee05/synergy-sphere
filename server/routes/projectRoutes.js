import express from 'express';
const router = express.Router();

// Create project
router.post('/', (req, res) => {
  // TODO: Implement project creation
  res.send('Create project');
});

// List projects
router.get('/', (req, res) => {
  // TODO: List user's projects
  res.send('List projects');
});

// Get project details
router.get('/:id', (req, res) => {
  // TODO: Get project details
  res.send('Project details');
});

// Update project
router.put('/:id', (req, res) => {
  // TODO: Update project
  res.send('Update project');
});

// Delete project
router.delete('/:id', (req, res) => {
  // TODO: Delete project
  res.send('Delete project');
});

export default router;
