// backend/middleware/checkReviewLimit.js

const { planLimits } = require('../config');
const Review = require('../models/Review'); // Asumiendo un modelo de reseña
const { Op } = require('sequelize'); // Para queries de fecha

async function checkReviewLimit(req, res, next) {
  // Solo aplicamos el límite al plan 'seed'
  if (req.business.subscription_plan !== 'seed') {
    return next();
  }

  const startDate = new Date();
  startDate.setDate(1); // Primer día del mes
  startDate.setHours(0, 0, 0, 0);

  const reviewCount = await Review.count({
    where: {
      business_id: req.business.id,
      created_at: {
        [Op.gte]: startDate // "gte" = mayor o igual que
      }
    }
  });

  if (reviewCount >= planLimits.seed.maxReviews) {
    return res.status(403).send({ 
      error: 'Has alcanzado el límite de reseñas para este mes. Mejora tu plan para continuar.' 
    });
  }

  next();
}

module.exports = checkReviewLimit;