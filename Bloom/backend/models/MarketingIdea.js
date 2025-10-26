const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketingIdea = sequelize.define('MarketingIdea', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  business_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'businesses', key: 'id' }
  },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  product_name: { type: DataTypes.STRING },
  image_url: { type: DataTypes.STRING, allowNull: true }, 
}, {
  tableName: 'marketing_ideas',
  timestamps: true,
});

module.exports = MarketingIdea;