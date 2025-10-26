const express = require('express');
const auth = require('../middleware/auth');
const { Review, SnackRating } = require('../models');
const router = express.Router();


router.post('/', auth, async (req, res) => {
  try {
    const { general, snack } = req.body;
    const businessId = req.user.business_id;

    if (!general || !general.rating || !general.text) {
      return res.status(400).json({ error: 'La valoración y reseña general son obligatorias.' });
    }
    if (general.rating < 1 || general.rating > 5) {
        return res.status(400).json({ error: 'La valoración general debe estar entre 1 y 5.' });
    }

    const newReview = await Review.create({
      rating: general.rating,
      text: general.text,
      business_id: businessId,
    });

    let snackRatingResult = null;
    if (snack && snack.name && snack.rating) {
       if (snack.rating < 1 || snack.rating > 5) {
          console.warn(`Valoración de snack inválida (${snack.rating}) para ${snack.name}. Omitiendo.`);
       } else {
          try {
            console.log(`Intentando guardar valoración para snack: ${snack.name} (${snack.rating} estrellas)`);

            snackRatingResult = await SnackRating.create({
              business_id: businessId,
              review_id: newReview.id, 
              snack_name: snack.name,
              rating: snack.rating,
            });
            console.log('Valoración de snack guardada:', snackRatingResult.toJSON());
            

           snackRatingResult = { message: `Valoración para ${snack.name} recibida (simulado).`}; 
          } catch (snackError) {
              console.error('Error al guardar la valoración del snack:', snackError);
          }
       }
    }

    res.status(201).json({
      review: newReview,
      snackRating: snackRatingResult 
    });

  } catch (error) {
    console.error('Error al procesar la reseña:', error);
    res.status(500).json({ error: 'Hubo un error al guardar la reseña.' });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const businessId = req.user.business_id;
    const reviews = await Review.findAll({
      where: { business_id: businessId },
      order: [['createdAt', 'DESC']],
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    res.status(500).json({ error: 'Hubo un error al obtener las reseñas.' });
  }
});

module.exports = router;