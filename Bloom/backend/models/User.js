// backend/models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_image_url: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
  business_id: { 
    type: DataTypes.INTEGER,
    references: {
      model: 'businesses',
      key: 'id',
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;