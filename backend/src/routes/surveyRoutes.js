const express = require('express');
const Survey = require('../models/SurveyResponse');

const router = express.Router();

router.post('/survey', async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    const saved = await newSurvey.save();
    res.status(201).json({ success: true, id: saved._id });
  } catch (error) {
    console.error(error);
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