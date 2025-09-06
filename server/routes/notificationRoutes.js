import express from 'express';
const router = express.Router();

// List notifications
router.get('/', (req, res) => {
  // TODO: List notifications for user
  res.send('List notifications');
});

// Mark notification as read
router.put('/:id', (req, res) => {
  // TODO: Mark notification as read
  res.send('Mark notification as read');
});

export default router;

