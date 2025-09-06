import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import File from '../models/File.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import Notification from '../models/Notifications.js';
import User from '../models/User.js';
import sequelize from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FileModel = File(sequelize);
const ProjectModel = Project(sequelize);
const ProjectMemberModel = ProjectMember(sequelize);
const NotificationModel = Notification(sequelize);
const UserModel = User(sequelize);

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'projects', req.body.project_id);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    const storedName = file.fieldname + '-' + uniqueSuffix + extension;
    cb(null, storedName);
  }
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types
    cb(null, true);
  }
});

export const uploadFile = async (req, res) => {
  try {
    const { project_id } = req.body;
    const uploaded_by = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!project_id) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id, user_id: uploaded_by }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const fileData = {
      project_id,
      uploaded_by,
      original_name: req.file.originalname,
      stored_name: req.file.filename,
      file_path: req.file.path,
      file_size: req.file.size,
      file_type: req.file.mimetype,
      file_extension: path.extname(req.file.originalname),
      is_image: req.file.mimetype.startsWith('image/')
    };

    // Save file record to database
    const file = await FileModel.create(fileData);

    // Notify all project members about new file
    const projectMembers = await ProjectMemberModel.findAll({
      where: { project_id },
      attributes: ['user_id']
    });

    for (const member of projectMembers) {
      if (member.user_id !== uploaded_by) {
        await NotificationModel.create({
          user_id: member.user_id,
          title: 'New File Uploaded',
          message: `A new file "${fileData.original_name}" has been uploaded to the project`,
          type: 'file_uploaded',
          related_id: file.id,
          related_type: 'file'
        });
      }
    }

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file.id,
        original_name: file.original_name,
        file_size: file.file_size,
        file_type: file.file_type,
        is_image: file.is_image,
        created_at: file.created_at
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};

export const getFiles = async (req, res) => {
  try {
    const { id: project_id } = req.params;
    const userId = req.user.id;

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get files for this project
    const files = await FileModel.findAll({
      where: { project_id },
      include: [
        {
          model: UserModel,
          as: 'uploader',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
};

export const downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Get file with project info
    const file = await FileModel.findByPk(fileId, {
      include: [
        {
          model: ProjectModel,
          attributes: ['id', 'name']
        }
      ]
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id: file.project_id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists on disk
    if (!fs.existsSync(file.file_path)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Update download count
    await FileModel.update(
      { download_count: file.download_count + 1 },
      { where: { id: fileId } }
    );

    // Send file
    res.download(file.file_path, file.original_name);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Get file
    const file = await FileModel.findByPk(fileId);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user is the uploader or project creator
    const project = await ProjectModel.findByPk(file.project_id);
    if (file.uploaded_by !== userId && project.created_by !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.file_path)) {
      fs.unlink(file.file_path, (err) => {
        if (err) console.error('File deletion error:', err);
      });
    }

    // Delete from database
    await FileModel.destroy({ where: { id: fileId } });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
};
