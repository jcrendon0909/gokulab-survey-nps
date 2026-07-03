const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'gokulab_surveys'   // ← Especificamos la base de datos
    });
    console.log('✅ Conectado a MongoDB (base de datos: gokulab_surveys)');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;