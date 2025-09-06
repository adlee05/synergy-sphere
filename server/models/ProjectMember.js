import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('ProjectMember', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'project_members',
  timestamps: false,
  indexes: [{ unique: true, fields: ['project_id', 'user_id'] }]
});
