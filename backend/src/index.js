console.log('🔥 Iniciando index.js (CommonJS)...');

console.log('1. Cargando express...');
const express = require('express');
console.log('✅ Express cargado');

console.log('2. Cargando cors...');
const cors = require('cors');
console.log('✅ Cors cargado');

console.log('3. Cargando dotenv...');
const dotenv = require('dotenv');
console.log('✅ Dotenv cargado');

console.log('4. Cargando connectDB desde ../config/db...');
const connectDB = require('../config/db');
console.log('✅ connectDB cargado');

console.log('5. Cargando surveyRoutes desde ./routes/surveyRoutes...');
const surveyRoutes = require('./routes/surveyRoutes');
console.log('✅ surveyRoutes cargado');

console.log('6. Configurando variables de entorno...');
dotenv.config();
console.log('✅ Variables cargadas');

console.log('7. Conectando a MongoDB...');
(async () => {
  try {
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