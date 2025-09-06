import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import User from '../models/User.js';
import sequelize from '../config.js';

const ProjectModel = Project(sequelize);
const ProjectMemberModel = ProjectMember(sequelize);
const UserModel = User(sequelize);

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const created_by = req.user.id;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Create project
    const project = await ProjectModel.create({
      name,
      description,
      created_by
    });

    // Add creator as project member
    await ProjectMemberModel.create({
      project_id: project.id,
      user_id: created_by
    });

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get projects where user is a member
    const projects = await ProjectModel.findAll({
      include: [
        {
          model: ProjectMemberModel,
          where: { user_id: userId },
          attributes: []
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id: id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get project details
    const project = await ProjectModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    // Check if user is the creator of this project
    const project = await ProjectModel.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.created_by !== userId) {
      return res.status(403).json({ error: 'Only project creator can update project' });
    }

    // Update project
    await ProjectModel.update(
      { name, description },
      { where: { id } }
    );

    res.json({ message: 'Project updated successfully' });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is the creator of this project
    const project = await ProjectModel.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.created_by !== userId) {
      return res.status(403).json({ error: 'Only project creator can delete project' });
    }

    // Delete project (cascade will handle related records)
    await ProjectModel.destroy({ where: { id } });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
};
