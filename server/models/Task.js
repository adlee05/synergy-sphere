import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('Task', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('todo', 'in_progress', 'completed'), defaultValue: 'todo' },
  assigned_to: { type: DataTypes.INTEGER },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'tasks', timestamps: false });
