const express = require('express');
const auth = require('../middleware/auth');
const { Business } = require('../models');
const router = express.Router();

router.get('/me/summary-audio', auth, async (req, res) => {
  try {
    const business = await Business.findByPk(req.user.business_id, {
      attributes: ['latest_positive_summary_audio_url', 'latest_negative_summary_audio_url']
    });
    if (!business) return res.status(404).json({ error: 'Negocio no encontrado.' });
    res.json({
      positiveUrl: business.latest_positive_summary_audio_url,
      negativeUrl: business.latest_negative_summary_audio_url
    });
  } catch (error) { res.status(500).json({ error: 'Error al obtener URLs de audio.' }); }
});
module.exports = router;