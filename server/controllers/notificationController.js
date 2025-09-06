import Notification from '../models/Notifications.js';
import Task from '../models/Task.js';
import File from '../models/File.js';
import Project from '../models/Project.js';
import sequelize from '../config.js';

const NotificationModel = Notification(sequelize);
const TaskModel = Task(sequelize);
const FileModel = File(sequelize);
const ProjectModel = Project(sequelize);

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 50, offset = 0 } = req.query;

    const notifications = await NotificationModel.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // Get related content for each notification
    const notificationsWithContent = await Promise.all(
      notifications.map(async (notification) => {
        let relatedContent = null;

        if (notification.related_id && notification.related_type) {
          switch (notification.related_type) {
            case 'task':
              relatedContent = await TaskModel.findByPk(notification.related_id, {
                attributes: ['id', 'title', 'status']
              });
              break;
            case 'file':
              relatedContent = await FileModel.findByPk(notification.related_id, {
                attributes: ['id', 'original_name', 'file_type']
              });
              break;
            case 'project':
              relatedContent = await ProjectModel.findByPk(notification.related_id, {
                attributes: ['id', 'name']
              });
              break;
          }
        }

        return {
          ...notification.toJSON(),
          related_content: relatedContent
        };
      })
    );

    res.json({ notifications: notificationsWithContent });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await NotificationModel.findOne({
      where: { id, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await NotificationModel.update(
      { is_read: true },
      { where: { id, user_id: userId } }
    );

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await NotificationModel.update(
      { is_read: true },
      { where: { user_id: userId, is_read: false } }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Failed to mark all notifications as read' });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await NotificationModel.count({
      where: { user_id: userId, is_read: false }
    });

    res.json({ unread_count: unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to get unread count' });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await NotificationModel.findOne({
      where: { id, user_id: userId }
    });

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await NotificationModel.destroy({ where: { id, user_id: userId } });

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
};
