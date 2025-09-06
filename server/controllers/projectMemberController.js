import ProjectMember from '../models/ProjectMember.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Notification from '../models/Notifications.js';
import sequelize from '../config.js';

const ProjectMemberModel = ProjectMember(sequelize);
const ProjectModel = Project(sequelize);
const UserModel = User(sequelize);
const NotificationModel = Notification(sequelize);

export const addMember = async (req, res) => {
  try {
    const { id: project_id } = req.params;
    const { user_id } = req.body;
    const currentUserId = req.user.id;

    // Check if current user is the project creator
    const project = await ProjectModel.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.created_by !== currentUserId) {
      return res.status(403).json({ error: 'Only project creator can add members' });
    }

    // Check if user exists
    const user = await UserModel.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await ProjectMemberModel.findOne({
      where: { project_id, user_id }
    });

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this project' });
    }

    // Add member
    await ProjectMemberModel.create({
      project_id,
      user_id
    });

    // Notify the new member
    await NotificationModel.create({
      user_id,
      title: 'Added to Project',
      message: `You have been added to the project "${project.name}"`,
      type: 'project_invite',
      related_id: project_id,
      related_type: 'project'
    });

    res.status(201).json({ message: 'Member added successfully' });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id: project_id, userId } = req.params;
    const currentUserId = req.user.id;

    // Check if current user is the project creator
    const project = await ProjectModel.findByPk(project_id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.created_by !== currentUserId) {
      return res.status(403).json({ error: 'Only project creator can remove members' });
    }

    // Check if member exists
    const member = await ProjectMemberModel.findOne({
      where: { project_id, user_id: userId }
    });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Remove member
    await ProjectMemberModel.destroy({
      where: { project_id, user_id: userId }
    });

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

export const getMembers = async (req, res) => {
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

    // Get all project members
    const members = await ProjectMemberModel.findAll({
      where: { project_id },
      include: [
        {
          model: UserModel,
          attributes: ['id', 'first_name', 'last_name', 'email', 'created_at']
        }
      ]
    });

    // Get project creator info
    const project = await ProjectModel.findByPk(project_id, {
      include: [
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'first_name', 'last_name', 'email', 'created_at']
        }
      ]
    });

    res.json({
      members: members.map(member => ({
        ...member.toJSON(),
        is_creator: member.user_id === project.created_by
      })),
      creator: project.creator
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({ error: 'Failed to get members' });
  }
};
