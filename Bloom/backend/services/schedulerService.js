// backend/services/schedulerService.js

const cron = require('node-cron');
const { Op } = require('sequelize');
const { Review, MarketingIdea, Business } = require('../models');
const { generatePromoIdea, generatePromoImage } = require('./aiService');

// Función auxiliar para crear una pausa
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function generateWeeklyMarketingIdeas() {
  console.log('⏰ Ejecutando tarea semanal de generación de marketing...');

  try {
    const today = new Date();
    // Ajusta para buscar reseñas de los últimos 7 días desde AHORA, 
    // no necesariamente la semana pasada exacta, más útil para pruebas.
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7)); 

    console.log(`Buscando reseñas positivas desde ${sevenDaysAgo.toISOString()}`);

    const businessesToProcess = await Business.findAll({
      include: [{
        model: Review,
        where: {
          rating: { [Op.gte]: 4 },
          createdAt: { [Op.gte]: sevenDaysAgo } // Usamos la nueva fecha
        },
        required: true 
      }]
    });

    if (businessesToProcess.length === 0) {
       console.log('No hay negocios con reseñas positivas recientes. Omitiendo generación.');
       return;
    }

    console.log(`Encontrados ${businessesToProcess.length} negocios para procesar.`);

    for (const business of businessesToProcess) {
      console.log(`Procesando negocio ID: ${business.id}`);
      const reviewsText = business.Reviews.map(r => r.text).join(' ');
      
      // Generamos hasta 5 ideas (o menos si hay pocas reseñas)
      const ideasToGenerate = Math.min(5, business.Reviews.length); 
      console.log(`Generando ${ideasToGenerate} ideas...`);

      for (let i = 0; i < ideasToGenerate; i++) {
        try {
          const productName = "nuestro producto estrella"; 
          const promoDetails = await generatePromoIdea(reviewsText, productName);
          console.log(`   Idea ${i+1} generada: ${promoDetails.promo_name}`);

          const imageUrl = await generatePromoImage(promoDetails, productName);
          console.log(`   Imagen ${i+1} generada.`);

          await MarketingIdea.create({
            business_id: business.id,
            title: promoDetails.promo_name,
            content: `${promoDetails.offer_text} - Válido ${promoDetails.day}`,
            product_name: productName,
            image_url: imageUrl,
          });

          // --- AÑADIR PAUSA AQUÍ ---
          // Espera 10 segundos antes de la siguiente iteración para no saturar la API
          // Puedes ajustar este tiempo (ej. 5000ms = 5s) si sigue fallando.
          console.log('   Esperando 65 segundos antes de la siguiente generación...');
          await delay(65000); 
          // ------------------------

        } catch (innerError) {
           console.error(`❌ Error generando idea/imagen ${i+1} para negocio ${business.id}:`, innerError.message);
           // Continúa con la siguiente iteración aunque una falle
        }
      }
    }
    console.log('✅ Tarea semanal completada.');
  } catch (error) {
    console.error('❌ Error durante la tarea semanal:', error);
  }
}

// ... (startScheduler y module.exports sin cambios) ...
function startScheduler() {
  cron.schedule('0 1 * * 0', generateWeeklyMarketingIdeas);
  console.log('Servicio de tareas programadas iniciado.');
}

module.exports = { startScheduler, generateWeeklyMarketingIdeas };