const express = require('express');
const auth = require('../middleware/auth');
const { InventoryRecommendation } = require('../models'); 

const router = express.Router();

router.get('/recommendations/latest', auth, async (req, res) => {
  try {
    const businessId = req.user.business_id;

    const latestRecommendation = await InventoryRecommendation.findOne({
      where: { business_id: businessId },
      order: [['generated_at', 'DESC']] 
    });

    if (!latestRecommendation) {
      return res.status(404).json({ message: 'Aún no hay recomendaciones generadas.' });
    }

    res.status(200).json(latestRecommendation.recommendations); 

  } catch (error) {
    console.error("Error al obtener recomendaciones:", error);
    res.status(500).json({ error: 'Error al obtener las recomendaciones.' });
  }
});

module.exports = router;