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
    unique: true, // El email debe ser único
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_image_url: {
    type: DataTypes.STRING,
    allowNull: true, // Puede ser nulo
  },
  business_id: { // Clave foránea que lo conecta con un negocio
    type: DataTypes.INTEGER,
    references: {
      model: 'businesses', // Nombre de la tabla de Businesses
      key: 'id',
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
});

module.exports = User;