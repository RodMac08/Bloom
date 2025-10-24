const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { canAccess } = require('../middleware/checkPermissions');
const checkReviewLimit = require('../middleware/checkReviewLimit');

// ---- RUTAS DE RESEÑAS ----
// Cualquiera puede leer reseñas (si es público)
router.get('/reviews', auth, reviewController.getAll); 
// Para crear una reseña, se verifica el límite del plan gratuito
router.post('/reviews', auth, checkReviewLimit, reviewController.create); 

// ---- RUTAS DE MARKETING ----
// Solo los planes "flourish" y "orchard" pueden generar ideas
router.post('/marketing-ideas', auth, canAccess('IDEA_GENERATION'), marketingController.create);

// ---- RUTAS DE USUARIOS ----
// Solo el plan "orchard" puede añadir nuevos miembros al equipo
router.post('/team/add', auth, canAccess('MULTIPLE_USERS'), userController.addMember);

// ---- RUTAS DE REPORTES ----
// Solo el plan "orchard" puede acceder a reportes detallados
router.get('/reports/detailed', auth, canAccess('DETAILED_REPORTS'), reportController.getDetailed);