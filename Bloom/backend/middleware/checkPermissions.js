
const { planLimits } = require('../config');

function canAccess(feature) {
  return (req, res, next) => {
    const userPlan = req.business.subscription_plan; 
    const allowedFeatures = planLimits[userPlan]?.features || [];

    if (allowedFeatures.includes(feature)) {
      return next();
    }

    res.status(403).send({ 
      error: 'Acceso denegado. Mejora tu plan para usar esta funcionalidad.' 
    });
  };
}

module.exports = { canAccess };