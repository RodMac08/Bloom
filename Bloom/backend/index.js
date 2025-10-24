const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { startScheduler } = require('./services/schedulerService');
// 1. IMPORTA LA FUNCIÓN DE GENERACIÓN
const { generateWeeklyMarketingIdeas } = require('./services/schedulerService');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');
const marketingRoutes = require('./routes/marketing'); // Asegúrate de que esta ruta existe

const app = express();

app.use(cors());
app.use(express.json());

// --- Tus rutas de API ---
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/marketing', marketingRoutes); // Asegúrate de usar las rutas de marketing

app.get('/', (req, res) => {
  res.send('¡API de Bloom funcionando! 🚀');
});

// ------------------------------------

const PORT = process.env.PORT || 5001; // Usando el puerto que funcionó

// Sincroniza la base de datos y luego inicia el servidor
sequelize.sync()
  .then(() => {
    console.log('Base de datos y tablas creadas ✨');
    // 2. Haz la función del listener ASÍNCRONA
    app.listen(PORT, async () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      
      // Inicia el scheduler normal (seguirá programado para el domingo)
      startScheduler();

      // --- LLAMADA ÚNICA PARA PRUEBA ---
      console.log('\n⚡ INICIANDO EJECUCIÓN MANUAL de generateWeeklyMarketingIdeas para pruebas...');
      try {
        // 3. LLAMA A LA FUNCIÓN DE GENERACIÓN AQUÍ
        await generateWeeklyMarketingIdeas();
        console.log('✅ Ejecución manual de prueba completada.\n');
      } catch (error) {
        console.error('❌ Error durante la ejecución manual de prueba:', error);
      }
      // -------------------------------

    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });