const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const { router: surveyRoutes, trainModel } = require('./routes/surveyRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', surveyRoutes);

// Conectar a MongoDB y arrancar servidor
connectDB().then(async () => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });

  // Entrenar modelo de sentimiento en segundo plano (no bloquea el servidor)
  try {
    await trainModel();
    console.log('✅ Modelo de sentimiento listo para usar');
  } catch (error) {
    console.warn('⚠️ El modelo de sentimiento no se entrenó correctamente:', error.message);
  }
}).catch(err => {
  console.error('❌ Error conectando a MongoDB:', err);
  process.exit(1);
});