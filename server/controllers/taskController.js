import Task from '../models/Task.js';
import Project from '../models/Project.js';
import ProjectMember from '../models/ProjectMember.js';
import Notification from '../models/Notifications.js';
import User from '../models/User.js';
import sequelize from '../config.js';

const TaskModel = Task(sequelize);
const ProjectModel = Project(sequelize);
const ProjectMemberModel = ProjectMember(sequelize);
const NotificationModel = Notification(sequelize);
const UserModel = User(sequelize);

export const createTask = async (req, res) => {
  try {
    const { project_id, title, description, assigned_to } = req.body;
    const created_by = req.user.id;

    if (!title || !project_id) {
      return res.status(400).json({ error: 'Title and project ID are required' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id, user_id: created_by }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create task
    const task = await TaskModel.create({
      project_id,
      title,
      description,
      assigned_to,
      created_by
    });

    // Create notifications
    if (assigned_to) {
      // Notify assigned user
      await NotificationModel.create({
        user_id: assigned_to,
        title: 'New Task Assigned',
        message: `You have been assigned a new task: "${title}"`,
        type: 'task_assigned',
        related_id: task.id,
        related_type: 'task'
      });
    }

    // Notify all project members about new task
    const projectMembers = await ProjectMemberModel.findAll({
      where: { project_id },
      attributes: ['user_id']
    });

    for (const member of projectMembers) {
      if (member.user_id !== created_by) {
        await NotificationModel.create({
          user_id: member.user_id,
          title: 'New Task Created',
          message: `A new task "${title}" has been created in the project`,
          type: 'task_created',
          related_id: task.id,
          related_type: 'task'
        });
      }
    }

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTasks = async (req, res) => {
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

    // Get tasks for this project
    const tasks = await TaskModel.findAll({
      where: { project_id },
      include: [
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Get task with project info
    const task = await TaskModel.findByPk(taskId, {
      include: [
        {
          model: ProjectModel,
          attributes: ['id', 'name']
        },
        {
          model: UserModel,
          as: 'assignee',
          attributes: ['id', 'first_name', 'last_name', 'email']
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id: task.project_id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, status, assigned_to } = req.body;
    const userId = req.user.id;

    // Get task
    const task = await TaskModel.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id: task.project_id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update task
    await TaskModel.update(
      { title, description, status, assigned_to },
      { where: { id: taskId } }
    );

    // Create notifications for status changes
    if (status === 'completed') {
      const title = 'Task Completed';
      const message = `Task "${task.title}" has been marked as completed`;

      // Notify task creator
      if (task.created_by !== userId) {
        await NotificationModel.create({
          user_id: task.created_by,
          title,
          message,
          type: 'task_completed',
          related_id: taskId,
          related_type: 'task'
        });
      }

      // Notify all project members
      const projectMembers = await ProjectMemberModel.findAll({
        where: { project_id: task.project_id },
        attributes: ['user_id']
      });

      for (const member of projectMembers) {
        if (member.user_id !== userId) {
          await NotificationModel.create({
            user_id: member.user_id,
            title,
            message,
            type: 'task_completed',
            related_id: taskId,
            related_type: 'task'
          });
        }
      }
    }

    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Get task
    const task = await TaskModel.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if user is a member of this project
    const membership = await ProjectMemberModel.findOne({
      where: { project_id: task.project_id, user_id: userId }
    });

    if (!membership) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete task
    await TaskModel.destroy({ where: { id: taskId } });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
