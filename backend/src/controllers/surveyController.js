import Survey from '../models/surveyresponses.js';

export const createSurvey = async (req, res) => {
  try {
    const newSurvey = new Survey(req.body);
    await newSurvey.save();
    res.status(201).json({ success: true, message: 'Encuesta guardada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const total = await Survey.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};