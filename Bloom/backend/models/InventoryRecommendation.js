// backend/models/InventoryRecommendation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const InventoryRecommendation = sequelize.define('InventoryRecommendation', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'businesses', key: 'id' }
  },
  recommendations: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    get() { 
      const rawValue = this.getDataValue('recommendations');
      return rawValue ? JSON.parse(rawValue) : null;
    },
    set(value) { 
      this.setDataValue('recommendations', JSON.stringify(value));
    }
  },
  generated_at: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, {
  tableName: 'inventory_recommendations',
  timestamps: true,
});

module.exports = InventoryRecommendation;