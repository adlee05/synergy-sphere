import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('File', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  project_id: { type: DataTypes.INTEGER, allowNull: false },
  uploaded_by: { type: DataTypes.INTEGER, allowNull: false },
  original_name: { type: DataTypes.STRING, allowNull: false },
  stored_name: { type: DataTypes.STRING, allowNull: false },
  file_path: { type: DataTypes.STRING(500), allowNull: false },
  file_size: { type: DataTypes.INTEGER, allowNull: false },
  file_type: { type: DataTypes.STRING(100) },
  file_extension: { type: DataTypes.STRING(10) },
  is_image: { type: DataTypes.BOOLEAN, defaultValue: false },
  download_count: { type: DataTypes.INTEGER, defaultValue: 0 },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'files', timestamps: false });

