// loadModels.js
const mongoose = require('mongoose');

// Función para registrar el modelo después de la conexión
const loadModels = () => {
  const surveySchema = new mongoose.Schema({
    studentName: { type: String, default: '' },
    studentAgeRange: { type: String, default: '' },
    respondentType: { type: String, default: '' },
    npsScore: { type: Number, required: true, min: 0, max: 10 },
    adminAttention: { type: Number, default: 0 },
    adminCommunication: { type: Number, default: 0 },
    adminScheduling: { type: Number, default: 0 },
    teacherKnowledge: { type: Number, default: 0 },
    teacherClarity: { type: Number, default: 0 },
    teacherEngagement: { type: Number, default: 0 },
    improvementSkills: { type: Number, default: 0 },
    interestTech: { type: Number, default: 0 },
    projectsUseful: { type: Number, default: 0 },
    likes: { type: String, default: '' },
    improvements: { type: String, default: '' },
    additionalComments: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
  });

  // Registrar el modelo con la conexión actual
  const Survey = mongoose.model('Survey', surveySchema, 'surveys');
  return Survey;
};

module.exports = loadModels;