import express from 'express';
const router = express.Router();

// Upload file
router.post('/:id/files', (req, res) => {
  // TODO: Handle file upload
  res.send('Upload file');
});

// List files
router.get('/:id/files', (req, res) => {
  // TODO: List project files
  res.send('List files');
});

// Download/view file
router.get('/files/:fileId', (req, res) => {
  // TODO: Download/view file
  res.send('Download/view file');
});

// Delete file
router.delete('/files/:fileId', (req, res) => {
  // TODO: Delete file
  res.send('Delete file');
});

export default router;

