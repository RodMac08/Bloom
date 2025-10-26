const { planLimits } = require('../config');
const Review = require('../models/Review');
const { Op } = require('sequelize'); 

async function checkReviewLimit(req, res, next) {
  if (req.business.subscription_plan !== 'seed') {
    return next();
  }

  const startDate = new Date();
  startDate.setDate(1);
  startDate.setHours(0, 0, 0, 0);

  const reviewCount = await Review.count({
    where: {
      business_id: req.business.id,
      created_at: {
        [Op.gte]: startDate
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