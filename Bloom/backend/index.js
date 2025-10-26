// backend/index.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

// 1. IMPORTA LAS CUATRO FUNCIONES DE schedulerService
const { startScheduler, generateWeeklyInventoryInsights, generateWeeklyMarketingIdeas, generateSummaryAudios } = require('./services/schedulerService');

const inventoryRoutes = require('./routes/inventory');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');
const marketingRoutes = require('./routes/marketing');
const businessRoutes = require('./routes/business'); // Asegúrate que la ruta exista

const app = express();

app.use(cors());
app.use(express.json());

// --- Tus rutas de API ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/business', businessRoutes); // Asegúrate que esta ruta esté registrada

app.get('/', (req, res) => {
  res.send('¡API de Bloom funcionando! 🚀');
});

// ------------------------------------

const PORT = process.env.PORT || 5001;

// Sincroniza la base de datos y luego inicia el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos y tablas sincronizadas (alteradas si es necesario) ✨');
    app.listen(PORT, async () => { // Función async
      console.log(`Servidor corriendo en el puerto ${PORT}`);

      // Inicia el scheduler normal (programará las tres tareas)
      startScheduler();

      // --- LLAMADA ÚNICA PARA PRUEBAS (LAS TRES FUNCIONES) ---
      console.log('\n⚡ INICIANDO EJECUCIÓN MANUAL de TAREAS para pruebas...');
      try {
        // Ejecuta insights de inventario
        console.log('   Ejecutando insights de inventario...');
        await generateWeeklyInventoryInsights();
        console.log('   ✅ Insights de inventario completados.');

        // Ejecuta ideas de marketing
        console.log('   Ejecutando ideas de marketing...');
        await generateWeeklyMarketingIdeas();
        console.log('   ✅ Ideas de marketing completadas.');

        console.log('   Ejecutando audio resúmenes agregados...');
        await generateSummaryAudios();
        console.log('   ✅ Audio resúmenes agregados completados.');

        console.log('✅ Ejecución manual de prueba completada.\n');
      } catch (error) {
        console.error('❌ Error durante la ejecución manual de prueba:', error);
      }

    });
  })
  .catch(err => {
    console.error('No se pudo conectar o sincronizar la base de datos:', err);
  });