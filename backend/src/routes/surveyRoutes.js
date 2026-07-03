const express = require('express');
const Survey = require('../models/SurveyResponse');

const router = express.Router();   // ← ESTO FALTA

router.post('/survey', async (req, res) => {
  console.log('📨 Recibida petición POST /survey con datos:', req.body);
  try {
    const newSurvey = new Survey(req.body);
    const saved = await newSurvey.save();
    console.log('✅ Encuesta guardada:', saved._id);
    res.status(201).json({ success: true, id: saved._id });
  } catch (error) {
    console.error('❌ Error al guardar:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/survey/stats', async (req, res) => {
  try {
    const total = await Survey.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;