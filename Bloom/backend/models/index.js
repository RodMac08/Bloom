const sequelize = require('../config/database');
const Business = require('./Business');
const User = require('./User');
const Review = require('./Review');
const MarketingIdea = require('./MarketingIdea');
const SnackRating = require('./SnackRating');
const InventoryRecommendation = require('./InventoryRecommendation');

Business.hasMany(User, { foreignKey: 'business_id' });
User.belongsTo(Business, { foreignKey: 'business_id' });

Business.hasMany(Review, { foreignKey: 'business_id' });
Review.belongsTo(Business, { foreignKey: 'business_id' });

Business.hasMany(MarketingIdea, { foreignKey: 'business_id' });
MarketingIdea.belongsTo(Business, { foreignKey: 'business_id' });

Business.hasMany(SnackRating, { foreignKey: 'business_id' }); 
SnackRating.belongsTo(Business, { foreignKey: 'business_id' }); 

Review.hasOne(SnackRating, { foreignKey: 'review_id' }); 
SnackRating.belongsTo(Review, { foreignKey: 'review_id' }); 

Business.hasMany(InventoryRecommendation, { foreignKey: 'business_id' });
InventoryRecommendation.belongsTo(Business, { foreignKey: 'business_id' });

module.exports = {
  sequelize,
  Business,
  User,
  Review,
  MarketingIdea,
  SnackRating,
  InventoryRecommendation
};