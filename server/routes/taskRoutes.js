import express from 'express';
const router = express.Router();

// Create task
router.post('/:id/tasks', (req, res) => {
  // TODO: Create task for project
  res.send('Create task');
});

// List tasks
router.get('/:id/tasks', (req, res) => {
  // TODO: List tasks for project
  res.send('List tasks');
});

// Task details
router.get('/tasks/:taskId', (req, res) => {
  // TODO: Get task details
  res.send('Task details');
});

// Update task
router.put('/tasks/:taskId', (req, res) => {
  // TODO: Update task
  res.send('Update task');
});

// Delete task
router.delete('/tasks/:taskId', (req, res) => {
  // TODO: Delete task
  res.send('Delete task');
});

export default router;

