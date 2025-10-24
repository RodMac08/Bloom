// backend/middleware/checkPermissions.js

const { planLimits } = require('../config');

// Middleware que verifica si el plan tiene acceso a una funcionalidad
function canAccess(feature) {
  return (req, res, next) => {
    const userPlan = req.business.subscription_plan; // ej: 'seed', 'flourish'
    const allowedFeatures = planLimits[userPlan]?.features || [];

    if (allowedFeatures.includes(feature)) {
      return next(); // El usuario tiene permiso, continuar.
    }

    res.status(403).send({ 
      error: 'Acceso denegado. Mejora tu plan para usar esta funcionalidad.' 
    });
  };
}

module.exports = { canAccess };