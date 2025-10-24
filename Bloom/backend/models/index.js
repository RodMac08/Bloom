// backend/models/index.js (NUEVO ARCHIVO)

const sequelize = require('../config/database');
const Business = require('./Business');
const User = require('./User');
const Review = require('./Review');
const MarketingIdea = require('./MarketingIdea');
// Aquí importarías los otros modelos (Review, etc.) en el futuro

// 1. Definir las relaciones
Business.hasMany(User, { foreignKey: 'business_id' });
User.belongsTo(Business, { foreignKey: 'business_id' });


Business.hasMany(Review, { foreignKey: 'business_id' }); // <-- 2. Añade esta relación
Review.belongsTo(Business, { foreignKey: 'business_id' }); // <-- 2. Y esta


// 2. Exportar la conexión y los modelos
module.exports = {
  sequelize,
  Business,
  User,
  Review,
  MarketingIdea
};