console.log('🔥 Iniciando index.js (CommonJS)...');

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const surveyRoutes = require('./routes/surveyRoutes');

(async () => {
  try {
    console.log('📦 Cargando variables de entorno...');
    dotenv.config();
    console.log('✅ Variables cargadas');

    console.log('🔄 Conectando a MongoDB...');
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    const app = express();
    const PORT = process.env.PORT || 5001;

    app.use(cors());
    app.use(express.json());

    app.use('/api', surveyRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
})();