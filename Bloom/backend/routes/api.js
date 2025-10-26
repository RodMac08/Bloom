const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { canAccess } = require('../middleware/checkPermissions');
const checkReviewLimit = require('../middleware/checkReviewLimit');

router.get('/reviews', auth, reviewController.getAll); 
router.post('/reviews', auth, checkReviewLimit, reviewController.create); 
router.post('/marketing-ideas', auth, canAccess('IDEA_GENERATION'), marketingController.create);
router.post('/team/add', auth, canAccess('MULTIPLE_USERS'), userController.addMember);
router.get('/reports/detailed', auth, canAccess('DETAILED_REPORTS'), reportController.getDetailed);