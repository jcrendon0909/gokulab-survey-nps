const express = require('express');
const Survey = require('../models/SurveyResponse');

// ✅ DEFINICIÓN DEL ROUTER (ESTO ES LO QUE FALTABA)
const router = express.Router();

// POST /api/survey - Guardar encuesta
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

// GET /api/survey/stats - Estadísticas completas
router.get('/survey/stats', async (req, res) => {
  try {
    const responses = await Survey.find({});
    const total = responses.length;

    if (total === 0) {
      return res.json({
        total: 0,
        nps: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        averages: {
          adminAttention: 0,
          adminCommunication: 0,
          adminScheduling: 0,
          teacherKnowledge: 0,
          teacherClarity: 0,
          teacherEngagement: 0,
          improvementSkills: 0,
          interestTech: 0,
          projectsUseful: 0,
        },
        ageDistribution: {},
        respondentTypeDistribution: {},
        recentResponses: [],
      });
    }

    let promoters = 0, passives = 0, detractors = 0;
    const sums = {
      adminAttention: 0,
      adminCommunication: 0,
      adminScheduling: 0,
      teacherKnowledge: 0,
      teacherClarity: 0,
      teacherEngagement: 0,
      improvementSkills: 0,
      interestTech: 0,
      projectsUseful: 0,
    };
    const ageCounts = {};
    const respondentCounts = {};

    responses.forEach(r => {
      if (r.npsScore >= 9) promoters++;
      else if (r.npsScore >= 7) passives++;
      else detractors++;

      for (const key in sums) {
        sums[key] += r[key] || 0;
      }

      const age = r.studentAgeRange || 'No especificado';
      ageCounts[age] = (ageCounts[age] || 0) + 1;

      const type = r.respondentType || 'No especificado';
      respondentCounts[type] = (respondentCounts[type] || 0) + 1;
    });

    const nps = Math.round(((promoters - detractors) / total) * 100);

    const averages = {};
    for (const key in sums) {
      averages[key] = parseFloat((sums[key] / total).toFixed(2));
    }

    const recentResponses = responses
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5)
      .map(r => ({
        id: r._id,
        studentName: r.studentName || 'Anónimo',
        npsScore: r.npsScore,
        respondentType: r.respondentType || 'No especificado',
        createdAt: r.createdAt,
      }));

    res.json({
      total,
      nps,
      promoters,
      passives,
      detractors,
      averages,
      ageDistribution: ageCounts,
      respondentTypeDistribution: respondentCounts,
      recentResponses,
    });
  } catch (error) {
    console.error('Error en stats:', error);
    res.status(500).json({ error: error.message });
  }
  // GET /api/survey/comments - Obtener todos los comentarios de texto libre
router.get('/survey/comments', async (req, res) => {
  try {
    // Solo seleccionamos los campos de texto, excluimos el resto para optimizar
    const responses = await Survey.find({}, 'likes improvements additionalComments');
    res.json({ comments: responses });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ EXPORTAR EL ROUTER
module.exports = router; 
