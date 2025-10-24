// backend/config.js

const planLimits = {
  seed: {
    maxReviews: 50, // Límite de 50 reseñas al mes
    maxUsers: 1,
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS']
  },
  flourish: {
    maxReviews: Infinity, // Ilimitado
    maxUsers: 1,
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS', 'UNLIMITED_ANALYSIS', 'IDEA_GENERATION', 'ANALYSIS_HISTORY']
  },
  orchard: {
    maxReviews: Infinity, // Ilimitado
    maxUsers: Infinity, // O un número alto, ej: 100
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS', 'UNLIMITED_ANALYSIS', 'IDEA_GENERATION', 'ANALYSIS_HISTORY', 'MULTIPLE_USERS', 'DETAILED_REPORTS']
  }
};

module.exports = { planLimits };