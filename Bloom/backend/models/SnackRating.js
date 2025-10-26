// backend/models/SnackRating.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SnackRating = sequelize.define('SnackRating', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  business_id: { // Foreign key linking to the Business
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'businesses', // Name of the businesses table
      key: 'id',
    }
  },
  review_id: { // Optional: Foreign key linking to the general Review (if submitted together)
    type: DataTypes.INTEGER,
    allowNull: true, // Make it optional
    references: {
      model: 'reviews', // Name of the reviews table
      key: 'id',
    }
  },
  snack_name: { // Name of the snack being rated
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: { // The star rating (1-5)
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5,
    }
  },
}, {
  tableName: 'snack_ratings', // Explicit table name
  timestamps: true, // Adds createdAt and updatedAt automatically
});

module.exports = SnackRating;