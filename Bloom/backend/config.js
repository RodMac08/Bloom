const planLimits = {
  seed: {
    maxReviews: 50, 
    maxUsers: 1,
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS']
  },
  flourish: {
    maxReviews: Infinity, 
    maxUsers: 1,
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS', 'UNLIMITED_ANALYSIS', 'IDEA_GENERATION', 'ANALYSIS_HISTORY']
  },
  orchard: {
    maxReviews: Infinity,
    maxUsers: Infinity, 
    features: ['BASIC_SUMMARY', 'LIMITED_ANALYSIS', 'UNLIMITED_ANALYSIS', 'IDEA_GENERATION', 'ANALYSIS_HISTORY', 'MULTIPLE_USERS', 'DETAILED_REPORTS']
  }
};

module.exports = { planLimits };