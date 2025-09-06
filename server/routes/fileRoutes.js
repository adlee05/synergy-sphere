import express from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth.js';
import { upload, uploadFile, getFiles, downloadFile, deleteFile } from '../controllers/fileController.js';

const router = express.Router();

// Upload file
router.post('/:id/files', verifyFirebaseToken, upload.single('file'), uploadFile);

// List files
router.get('/:id/files', verifyFirebaseToken, getFiles);

// Download/view file
router.get('/files/:fileId', verifyFirebaseToken, downloadFile);

// Delete file
router.delete('/files/:fileId', verifyFirebaseToken, deleteFile);

export default router;

