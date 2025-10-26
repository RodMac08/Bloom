const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Business = sequelize.define('Business', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subscription_plan: {
    type: DataTypes.ENUM('seed', 'flourish', 'orchard'),
    defaultValue: 'seed',
  },
  latest_positive_summary_audio_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  latest_negative_summary_audio_url: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'businesses', 
  timestamps: true, 
});


module.exports = Business;