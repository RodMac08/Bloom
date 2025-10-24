// backend/routes/reviews.js

const express = require('express');
const auth = require('../middleware/auth'); // Nuestro guardián de seguridad
const { Review } = require('../models');

const router = express.Router();

// --- RUTA PARA CREAR UNA NUEVA RESEÑA ---
// POST /api/reviews
router.post('/', auth, async (req, res) => {
  try {
    const { rating, text } = req.body;
    const businessId = req.user.business_id; // Obtenemos el ID del negocio del token

    // Validamos la entrada
    if (!rating || !text) {
      return res.status(400).json({ error: 'La valoración y el texto son obligatorios.' });
    }

    const newReview = await Review.create({
      rating,
      text,
      business_id: businessId,
    });

    res.status(201).json(newReview);
  } catch (error) {
    console.error('Error al crear la reseña:', error);
    res.status(500).json({ error: 'Hubo un error al guardar la reseña.' });
  }
});

// --- RUTA PARA OBTENER TODAS LAS RESEÑAS DE UN NEGOCIO ---
// GET /api/reviews
router.get('/', auth, async (req, res) => {
  try {
    const businessId = req.user.business_id;

    const reviews = await Review.findAll({
      where: { business_id: businessId },
      order: [['createdAt', 'DESC']], // Ordenar por más recientes primero
    });

    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    res.status(500).json({ error: 'Hubo un error al obtener las reseñas.' });
  }
});

module.exports = router;