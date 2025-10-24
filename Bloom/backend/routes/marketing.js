// backend/routes/marketing.js
const express = require('express');
const auth = require('../middleware/auth'); // El guardián de seguridad
const { MarketingIdea } = require('../models');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const businessId = req.user.business_id;

    const ideas = await MarketingIdea.findAll({
      where: { business_id: businessId },
      order: [['createdAt', 'DESC']] // Mostrar las más nuevas primero
    });

    res.status(200).json(ideas);
  } catch (error) {
    console.error("Error al obtener ideas de marketing:", error);
    res.status(500).json({ error: 'Error al obtener las ideas.' });
  }
});

module.exports = router;