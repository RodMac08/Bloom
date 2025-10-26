const cron = require('node-cron');
const { Op } = require('sequelize');
const { Business, SnackRating, InventoryRecommendation, Review, MarketingIdea } = require('../models');
const { generateInventoryRecommendations, generateMarketingTextIdea, generateReviewAudio, generateAggregatedSummary} = require('./aiService');
const { uploadFileToGCS } = require('./storageService');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function generateWeeklyInventoryInsights() {
  console.log('⏰ Ejecutando tarea semanal de insights de inventario...');
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));
    console.log(`Buscando valoraciones de snacks desde ${sevenDaysAgo.toISOString()}`);

    const allRecentSnackRatings = await SnackRating.findAll({
      where: { createdAt: { [Op.gte]: sevenDaysAgo } },
      attributes: ['business_id', 'snack_name', 'rating'],
    });

    if (allRecentSnackRatings.length === 0) {
      console.log('No hay valoraciones de snacks recientes. Omitiendo generación de insights.');
      return;
    }

    const ratingsByBusiness = allRecentSnackRatings.reduce((acc, rating) => {
        const businessId = rating.business_id;
        const snackName = rating.snack_name;
        const score = rating.rating;
        if (!snackName || typeof score !== 'number' || score < 1 || score > 5) {
            console.warn(`Valoración inválida encontrada: Snack=${snackName}, Rating=${score}. Omitiendo.`);
            return acc;
        }
        acc[businessId] = acc[businessId] || {};
        acc[businessId][snackName] = acc[businessId][snackName] || { totalScore: 0, count: 0 };
        acc[businessId][snackName].totalScore += score;
        acc[businessId][snackName].count++;
        return acc;
    }, {});
    
    const avgRatingsByBusiness = {};
    for (const businessId in ratingsByBusiness) {
        avgRatingsByBusiness[businessId] = {};
        for (const snackName in ratingsByBusiness[businessId]) {
            const data = ratingsByBusiness[businessId][snackName];
            if (data.count > 0) {
                 avgRatingsByBusiness[businessId][snackName] = (data.totalScore / data.count).toFixed(1);
            }
        }
    }

    const businessCount = Object.keys(avgRatingsByBusiness).length;
    if (businessCount === 0) {
        console.log('No se pudieron calcular promedios válidos para insights. Omitiendo.');
        return;
    }
    console.log(`Encontrados datos promediados de snacks para ${businessCount} negocios.`);

    for (const businessId in avgRatingsByBusiness) {
      const currentBusinessId = parseInt(businessId, 10);
      if (isNaN(currentBusinessId) || Object.keys(avgRatingsByBusiness[businessId]).length === 0) continue;

      console.log(`Procesando insights para negocio ID: ${currentBusinessId}`);
      const snackRatings = avgRatingsByBusiness[businessId];

      try {
        const recommendations = await generateInventoryRecommendations(snackRatings);
        console.log(`   Recomendaciones generadas para negocio ${currentBusinessId}:`, JSON.stringify(recommendations, null, 2));

        await InventoryRecommendation.create({
          business_id: currentBusinessId,
          recommendations: recommendations,
          generated_at: new Date()
        });
        console.log(`   Recomendaciones guardadas en BD para negocio ${currentBusinessId}.`);
        await delay(2000); 

      } catch (innerError) {
         console.error(`❌ Error generando/guardando recomendación para negocio ${currentBusinessId}:`, innerError.message);
      }
    }
    console.log('✅ Tarea semanal de insights de inventario completada.');
  } catch (error) {
    console.error('❌ Error durante la tarea semanal de insights:', error);
  }
}

async function generateSummaryAudios() {
  console.log('🔊 Ejecutando tarea de generación de audios de resumen...');
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));

    const businesses = await Business.findAll({ include: [Review] }); // Trae todos los negocios con sus reseñas

    for (const business of businesses) {
      const recentReviews = business.Reviews.filter(r => new Date(r.createdAt) >= sevenDaysAgo);
      const positiveReviews = recentReviews.filter(r => r.rating >= 4);
      const negativeReviews = recentReviews.filter(r => r.rating <= 2);

      let positiveAudioUrl = null;
      let negativeAudioUrl = null;

      // Generar audio para resumen positivo
      if (positiveReviews.length > 0) {
        try {
          const positiveSummaryText = await generateAggregatedSummary(positiveReviews, 'positivas');
          const positiveAudioBuffer = await generateReviewAudio(positiveSummaryText, 4); // Usamos 4 para tono positivo
          const destination = `summary-audio/business_${business.id}_positive_${Date.now()}.mp3`;
          positiveAudioUrl = await uploadFileToGCS(positiveAudioBuffer, destination, 'audio/mpeg');
          console.log(`   Audio resumen positivo generado para negocio ${business.id}`);
        } catch (err) { console.error(`Error generando audio positivo para ${business.id}:`, err.message); }
      } else { console.log(`   Sin reseñas positivas recientes para negocio ${business.id}`); }

      // Generar audio para resumen negativo
      if (negativeReviews.length > 0) {
        try {
          const negativeSummaryText = await generateAggregatedSummary(negativeReviews, 'negativas');
          const negativeAudioBuffer = await generateReviewAudio(negativeSummaryText, 2); // Usamos 2 para tono más serio
          const destination = `summary-audio/business_${business.id}_negative_${Date.now()}.mp3`;
          negativeAudioUrl = await uploadFileToGCS(negativeAudioBuffer, destination, 'audio/mpeg');
          console.log(`   Audio resumen negativo generado para negocio ${business.id}`);
        } catch (err) { console.error(`Error generando audio negativo para ${business.id}:`, err.message); }
      } else { console.log(`   Sin reseñas negativas recientes para negocio ${business.id}`); }

      // Guardar URLs en la tabla Businesses (¡Añade estas columnas a tu modelo!)
      if (positiveAudioUrl || negativeAudioUrl) {
        await Business.update(
          {
            latest_positive_summary_audio_url: positiveAudioUrl,
            latest_negative_summary_audio_url: negativeAudioUrl
          },
          { where: { id: business.id } }
        );
         console.log(`   URLs de audio actualizadas para negocio ${business.id}`);
      }
      await delay(5000); // Pausa entre negocios
    }
    console.log('✅ Tarea de audios de resumen completada.');
  } catch (error) { console.error('❌ Error en tarea de audios de resumen:', error); }
}

async function generateWeeklyMarketingIdeas() {
  console.log('💡 Ejecutando tarea semanal de generación de marketing (SOLO TEXTO)...');
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(new Date().setDate(today.getDate() - 7));
    console.log(`Buscando reseñas positivas (generales) desde ${sevenDaysAgo.toISOString()}`);

    const businessesToProcess = await Business.findAll({
      include: [{
        model: Review, 
        where: {
          rating: { [Op.gte]: 4 }, 
          createdAt: { [Op.gte]: sevenDaysAgo }
        },
        required: true
      }]
    });

    if (businessesToProcess.length === 0) {
       console.log('No hay negocios con reseñas positivas recientes para marketing.');
       return;
    }
    console.log(`Encontrados ${businessesToProcess.length} negocios para marketing.`);

    for (const business of businessesToProcess) {
      const currentBusinessId = business.id;
      console.log(`Procesando marketing para negocio ID: ${currentBusinessId}`);
      const reviewsText = business.Reviews.map(r => r.text).join(' ');
      const ideasToGenerate = Math.min(3, business.Reviews.length); 
      console.log(`Generando ${ideasToGenerate} ideas de texto de marketing...`);

      for (let i = 0; i < ideasToGenerate; i++) {
        try {
          const productName = "nuestro producto/servicio"; 
          const marketingIdea = await generateMarketingTextIdea(reviewsText, productName); 
          console.log(`   Idea de marketing ${i+1} generada: ${marketingIdea.title}`);

          await MarketingIdea.create({
            business_id: currentBusinessId,
            title: marketingIdea.title,
            content: marketingIdea.content,
            product_name: marketingIdea.product_name,
            image_url: null, 
          });
          console.log(`   Idea de marketing guardada para negocio ${currentBusinessId}.`);
          await delay(2000);

        } catch (innerError) {
           console.error(`❌ Error generando idea de marketing ${i+1} para negocio ${currentBusinessId}:`, innerError.message);
        }
      }
    }
    console.log('✅ Tarea semanal de marketing (solo texto) completada.');
  } catch (error) {
    console.error('❌ Error durante la tarea semanal de marketing:', error);
  }
}

async function processReviewAudio() {
  console.log('🎧 Buscando reseñas nuevas para generar audio...');
  try {
    const reviewsToProcess = await Review.findAll({
      where: {
        audio_url: null, 
        createdAt: { [Op.gte]: new Date(new Date() - 24 * 60 * 60 * 1000) } 
      },
      limit: 5 
    });

    if (reviewsToProcess.length === 0) {
      console.log('No hay reseñas nuevas para procesar audio.');
      return;
    }
    console.log(`Encontradas ${reviewsToProcess.length} reseñas para generar audio.`);

    for (const review of reviewsToProcess) {
      try {
        const audioBuffer = await generateReviewAudio(review.text, review.rating);
        const destination = `review-audio/review_${review.id}.mp3`; 
        const publicUrl = await uploadFileToGCS(audioBuffer, destination, 'audio/mpeg'); 
        await review.update({ audio_url: publicUrl });
        console.log(`   Audio para reseña ${review.id} guardado: ${publicUrl}`);
        await delay(5000);

      } catch (audioError) {
        console.error(`❌ Error procesando audio para reseña ${review.id}:`, audioError.message);
      }
    }
  } catch (error) {
    console.error('❌ Error general en la tarea de audio:', error);
  }
}

function startScheduler() {
  cron.schedule('0 1 * * 0', generateWeeklyInventoryInsights);
  cron.schedule('0 2 * * 0', generateWeeklyMarketingIdeas); 
  cron.schedule('*/5 * * * *', processReviewAudio); 
  cron.schedule('0 3 * * *', generateSummaryAudios);
  console.log('Servicios programados iniciados (Inventario, Marketing Texto y Audio Reseñas).');
}

module.exports = { 
  startScheduler, 
  generateWeeklyInventoryInsights, 
  generateWeeklyMarketingIdeas, 
  processReviewAudio,
  generateSummaryAudios
};