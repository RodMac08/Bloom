const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const { startScheduler, generateWeeklyInventoryInsights, generateWeeklyMarketingIdeas } = require('./services/schedulerService');
const inventoryRoutes = require('./routes/inventory'); 
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const reviewRoutes = require('./routes/reviews');
const marketingRoutes = require('./routes/marketing');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/marketing', marketingRoutes); 
app.use('/api/inventory', inventoryRoutes); 
app.get('/', (req, res) => {
  res.send('¡API de Bloom funcionando! 🚀');
});


const PORT = process.env.PORT || 5001; 

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos y tablas creadas ✨');
    app.listen(PORT, async () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      
      startScheduler();

      console.log('\n⚡ INICIANDO EJECUCIÓN MANUAL de generateWeeklyMarketingIdeas para pruebas...');
      try {
        console.log('   Ejecutando insights de inventario...');
        await generateWeeklyInventoryInsights();
        console.log('   ✅ Insights de inventario completados.');

        console.log('   Ejecutando ideas de marketing...');
        await generateWeeklyMarketingIdeas();
        console.log('   ✅ Ideas de marketing completadas.');

        console.log('✅ Ejecución manual de prueba completada.\n');
      } catch (error) {
        console.error('❌ Error durante la ejecución manual de prueba:', error);
      }

    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });