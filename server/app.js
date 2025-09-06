import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import projectMemberRoutes from './routes/projectMemberRoutes.js';

// Import database
import sequelize from './config.js';

// Import models to initialize associations
import './models/User.js';
import './models/Project.js';
import './models/Task.js';
import './models/File.js';
import './models/ProjectMember.js';
import './models/Notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects', taskRoutes);
app.use('/api/projects', fileRoutes);
app.use('/api/projects', projectMemberRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'SynergySphere API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Sync database (create tables if they don't exist)
    // Use force: false to avoid dropping existing data
    await sequelize.sync({ alter: true, force: false });
    console.log('✅ Database synchronized successfully.');
    
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📱 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    
    // If it's a constraint error, provide helpful message
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('💡 Database constraint error detected.');
      console.log('   This usually happens when there are existing records with duplicate values.');
      console.log('   You may need to clean up your database or modify the constraint.');
    }
    
    process.exit(1);
  }
};

startServer();