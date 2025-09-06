import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Notification', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
  type: {
    type: DataTypes.ENUM('task_assigned', 'task_completed', 'file_uploaded', 'project_invite', 'task_created'),
    defaultValue: 'task_assigned'
  },
  is_read: { type: DataTypes.BOOLEAN, defaultValue: false },
  related_id: { type: DataTypes.INTEGER },
  related_type: { type: DataTypes.ENUM('task', 'file', 'project'), defaultValue: 'task' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'notifications', timestamps: false });

