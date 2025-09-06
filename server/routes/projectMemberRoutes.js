import express from 'express';
const router = express.Router();

// Add member
router.post('/:id/members', (req, res) => {
  // TODO: Add member to project
  res.send('Add member');
});

// Remove member
router.delete('/:id/members/:userId', (req, res) => {
  // TODO: Remove member
  res.send('Remove member');
});

// List members
router.get('/:id/members', (req, res) => {
  // TODO: List all members
  res.send('List members');
});

export default router;

