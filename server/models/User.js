import { DataTypes } from 'sequelize';

export default (sequelize) => sequelize.define('User', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  firebase_uid: { type: DataTypes.STRING, allowNull: true, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true }, // Optional for Firebase users
  first_name: { type: DataTypes.STRING(100), allowNull: true },
  last_name: { type: DataTypes.STRING(100), allowNull: true },
  display_name: { type: DataTypes.STRING(255), allowNull: true },
  photo_url: { type: DataTypes.STRING(500), allowNull: true },
  email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  role: { type: DataTypes.ENUM('admin', 'member'), defaultValue: 'member' },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'users', timestamps: false });
