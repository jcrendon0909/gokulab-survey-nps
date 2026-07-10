const express = require('express');
const Survey = require('../models/SurveyResponse');
const { NlpManager } = require('node-nlp');

const router = express.Router();

// =============================================
// 1. CONFIGURACIÓN DEL MODELO node-nlp
// =============================================
const manager = new NlpManager({ languages: ['es'] });
let modelReady = false;

// =============================================
// 2. FUNCIÓN DE ENTRENAMIENTO (se ejecutará después de arrancar el servidor)
// =============================================
async function trainModel() {
  if (modelReady) {
    console.log('✅ Modelo ya entrenado, omitiendo...');
    return;
  }

  console.log('🧠 Entrenando modelo de sentimiento (esto puede tomar unos segundos)...');

  // --- FRASES POSITIVAS ---
  manager.addDocument('es', 'me encanta este lugar', 'positive');
  manager.addDocument('es', 'es increíble', 'positive');
  manager.addDocument('es', 'excelente servicio', 'positive');
  manager.addDocument('es', 'me gusta mucho', 'positive');
  manager.addDocument('es', 'maravilloso', 'positive');
  manager.addDocument('es', 'buen servicio', 'positive');
  manager.addDocument('es', 'muy bueno', 'positive');
  manager.addDocument('es', 'me fascina', 'positive');
  manager.addDocument('es', 'genial', 'positive');
  manager.addDocument('es', 'espectacular', 'positive');
  manager.addDocument('es', 'fantástico', 'positive');
  manager.addDocument('es', 'me encantó', 'positive');
  manager.addDocument('es', 'súper recomendable', 'positive');
  manager.addDocument('es', 'lo mejor', 'positive');
  manager.addDocument('es', 'excelente atención', 'positive');
  manager.addDocument('es', 'muy satisfecho', 'positive');
  manager.addDocument('es', 'me alegra', 'positive');
  manager.addDocument('es', 'perfecto', 'positive');
  manager.addDocument('es', 'increíble experiencia', 'positive');
  manager.addDocument('es', 'me divierte', 'positive');
  manager.addDocument('es', 'me hace feliz', 'positive');
  manager.addDocument('es', 'es ideal', 'positive');
  manager.addDocument('es', 'maravillosa experiencia', 'positive');
  manager.addDocument('es', 'me encantaría volver', 'positive');
  manager.addDocument('es', 'excelente calidad', 'positive');
  manager.addDocument('es', 'muy profesional', 'positive');
  manager.addDocument('es', 'gran lugar', 'positive');
  manager.addDocument('es', 'extraordinario', 'positive');
  manager.addDocument('es', 'me parece excelente', 'positive');
  manager.addDocument('es', 'todo genial', 'positive');
  manager.addDocument('es', 'súper bien', 'positive');
  manager.addDocument('es', 'muy contento', 'positive');
  manager.addDocument('es', 'me gusta bastante', 'positive');
  manager.addDocument('es', 'recomendado', 'positive');
  manager.addDocument('es', 'excelente todo', 'positive');
  manager.addDocument('es', 'maravilloso lugar', 'positive');
  manager.addDocument('es', 'muy agradable', 'positive');
  manager.addDocument('es', 'encantador', 'positive');
  manager.addDocument('es', 'buen ambiente', 'positive');
  manager.addDocument('es', 'excelentes instalaciones', 'positive');
  manager.addDocument('es', 'muy buen profesor', 'positive');
  manager.addDocument('es', 'aprendí mucho', 'positive');
  manager.addDocument('es', 'me siento motivado', 'positive');
  manager.addDocument('es', 'es divertido', 'positive');
  manager.addDocument('es', 'me encantan las clases', 'positive');
  manager.addDocument('es', 'muy buen aprendizaje', 'positive');
  manager.addDocument('es', 'excelente metodología', 'positive');
  manager.addDocument('es', 'me siento cómodo', 'positive');
  manager.addDocument('es', 'muy buena energía', 'positive');
  manager.addDocument('es', 'me inspira', 'positive');
  manager.addDocument('es', 'es un lugar único', 'positive');

  // --- FRASES NEGATIVAS ---
  manager.addDocument('es', 'pésimo', 'negative');
  manager.addDocument('es', 'no me gusta', 'negative');
  manager.addDocument('es', 'terrible', 'negative');
  manager.addDocument('es', 'malo', 'negative');
  manager.addDocument('es', 'mal servicio', 'negative');
  manager.addDocument('es', 'horrible', 'negative');
  manager.addDocument('es', 'decepcionante', 'negative');
  manager.addDocument('es', 'no funciona', 'negative');
  manager.addDocument('es', 'servicio pésimo', 'negative');
  manager.addDocument('es', 'muy malo', 'negative');
  manager.addDocument('es', 'malísimo', 'negative');
  manager.addDocument('es', 'fatal', 'negative');
  manager.addDocument('es', 'no me agrada', 'negative');
  manager.addDocument('es', 'desastroso', 'negative');
  manager.addDocument('es', 'pésimo servicio', 'negative');
  manager.addDocument('es', 'muy mal servicio', 'negative');
  manager.addDocument('es', 'no lo recomiendo', 'negative');
  manager.addDocument('es', 'mala atención', 'negative');
  manager.addDocument('es', 'mala experiencia', 'negative');
  manager.addDocument('es', 'me decepcionó', 'negative');
  manager.addDocument('es', 'no volveré', 'negative');
  manager.addDocument('es', 'es horrible', 'negative');
  manager.addDocument('es', 'pésima calidad', 'negative');
  manager.addDocument('es', 'muy mal ambiente', 'negative');
  manager.addDocument('es', 'mal profesor', 'negative');
  manager.addDocument('es', 'no aprendí nada', 'negative');
  manager.addDocument('es', 'mala metodología', 'negative');
  manager.addDocument('es', 'no me gustó nada', 'negative');
  manager.addDocument('es', 'terrible experiencia', 'negative');
  manager.addDocument('es', 'no sirve', 'negative');
  manager.addDocument('es', 'no me convence', 'negative');
  manager.addDocument('es', 'es un fracaso', 'negative');
  manager.addDocument('es', 'mala organización', 'negative');
  manager.addDocument('es', 'pésimo lugar', 'negative');
  manager.addDocument('es', 'no lo soporto', 'negative');
  manager.addDocument('es', 'me enfada', 'negative');
  manager.addDocument('es', 'es un desastre', 'negative');
  manager.addDocument('es', 'muy malas instalaciones', 'negative');
  manager.addDocument('es', 'mal trato', 'negative');
  manager.addDocument('es', 'no cumplió expectativas', 'negative');
  manager.addDocument('es', 'insatisfecho', 'negative');
  manager.addDocument('es', 'no me gusta nada', 'negative');
  manager.addDocument('es', 'muy malo todo', 'negative');
  manager.addDocument('es', 'no es lo que esperaba', 'negative');
  manager.addDocument('es', 'malísima atención', 'negative');

  // --- FRASES NEUTRALES ---
  manager.addDocument('es', 'normal', 'neutral');
  manager.addDocument('es', 'bien', 'neutral');
  manager.addDocument('es', 'regular', 'neutral');
  manager.addDocument('es', 'sin más', 'neutral');
  manager.addDocument('es', 'más o menos', 'neutral');
  manager.addDocument('es', 'aceptable', 'neutral');
  manager.addDocument('es', 'mediano', 'neutral');
  manager.addDocument('es', 'no está mal', 'neutral');
  manager.addDocument('es', 'pasable', 'neutral');
  manager.addDocument('es', 'bueno', 'neutral');
  manager.addDocument('es', 'adecuado', 'neutral');
  manager.addDocument('es', 'ni bien ni mal', 'neutral');
  manager.addDocument('es', 'sin novedad', 'neutral');
  manager.addDocument('es', 'común', 'neutral');
  manager.addDocument('es', 'corriente', 'neutral');
  manager.addDocument('es', 'correcto', 'neutral');
  manager.addDocument('es', 'decente', 'neutral');
  manager.addDocument('es', 'suficiente', 'neutral');
  manager.addDocument('es', 'tolerable', 'neutral');
  manager.addDocument('es', 'no excelente pero tampoco malo', 'neutral');
  manager.addDocument('es', 'me parece normal', 'neutral');
  manager.addDocument('es', 'nada destacable', 'neutral');
  manager.addDocument('es', 'está bien', 'neutral');
  manager.addDocument('es', 'todo bien', 'neutral');
  manager.addDocument('es', 'todo correcto', 'neutral');
  manager.addDocument('es', 'sin quejas', 'neutral');
  manager.addDocument('es', 'no hay problema', 'neutral');
  manager.addDocument('es', 'funcional', 'neutral');
  manager.addDocument('es', 'práctico', 'neutral');
  manager.addDocument('es', 'estándar', 'neutral');
  manager.addDocument('es', 'apropiado', 'neutral');
  manager.addDocument('es', 'razonable', 'neutral');
  manager.addDocument('es', 'no me emociona pero no me decepciona', 'neutral');
  manager.addDocument('es', 'cumple', 'neutral');
  manager.addDocument('es', 'no está mal pero no es genial', 'neutral');
  manager.addDocument('es', 'justo', 'neutral');
  manager.addDocument('es', 'promedio', 'neutral');
  manager.addDocument('es', 'normalito', 'neutral');
  manager.addDocument('es', 'más o menos bien', 'neutral');
  manager.addDocument('es', 'algo regular', 'neutral');
  manager.addDocument('es', 'normalazo', 'neutral');

  await manager.train();
  modelReady = true;
  console.log('✅ Modelo de sentimiento entrenado correctamente');
}

// =============================================
// 3. STOPWORDS Y DICCIONARIOS (para clasificación híbrida)
// =============================================
const STOPWORDS = [
  'a', 'al', 'ante', 'antes', 'con', 'contra', 'de', 'del', 'desde', 'durante',
  'e', 'el', 'ella', 'ellas', 'ello', 'ellos', 'en', 'entre', 'era', 'eran',
  'esa', 'esas', 'ese', 'eso', 'esos', 'esta', 'estaba', 'estaban', 'estado',
  'estamos', 'estando', 'estar', 'estará', 'estas', 'este', 'esto', 'estos',
  'estoy', 'ex', 'excepto', 'fin', 'fue', 'fuera', 'fueron', 'gran', 'hasta',
  'hay', 'he', 'hemos', 'hoy', 'la', 'las', 'le', 'les', 'lo', 'los', 'más',
  'me', 'mi', 'mis', 'mismo', 'mucho', 'muy', 'nada', 'ni', 'no', 'nos', 'nosotros',
  'nuestra', 'nuestras', 'nuestro', 'nuestros', 'o', 'os', 'otra', 'otras',
  'otro', 'otros', 'para', 'pero', 'poco', 'por', 'porque', 'pues', 'que',
  'quien', 'quienes', 'qué', 'se', 'ser', 'será', 'sí', 'sido', 'siendo',
  'sin', 'sobre', 'son', 'su', 'sus', 'suya', 'suyas', 'suyo', 'suyos', 'tal',
  'también', 'tanto', 'te', 'tendrá', 'ti', 'tiene', 'tienen', 'toda', 'todas',
  'todo', 'todos', 'tu', 'tus', 'un', 'una', 'unas', 'uno', 'unos', 'usted',
  'vuestra', 'vuestras', 'vuestro', 'vuestros', 'y', 'ya', 'yo',
  'hijo', 'hija', 'padre', 'madre', 'clase', 'clases', 'lugar', 'sitio'
];

const POSITIVE_WORDS = [
  'excelente', 'increíble', 'maravilloso', 'feliz', 'encanta', 'genial',
  'fantástico', 'espectacular', 'perfecto', 'mejor', 'recomendado', 'satisfecho',
  'contento', 'motivado', 'divertido', 'agradable', 'buen', 'buena', 'bueno',
  'gran', 'ideal', 'único', 'extraordinario', 'impresionante', 'asombroso',
  'magnífico', 'encantador', 'excelentes', 'increíbles', 'maravillosa',
  'espléndido', 'fabuloso', 'estupendo', 'sensacional', 'formidable',
  'fascinante', 'alucinante', 'perfecta', 'geniales', 'fantástica', 'espectacular',
  'recomiendo', 'encantó', 'gustó', 'amo', 'ama', 'adoro', 'adora',
  'aprendí', 'aprendo', 'crezco', 'mejoró', 'mejora'
];

const NEGATIVE_WORDS = [
  'pésimo', 'malo', 'terrible', 'horrible', 'decepcionante', 'fatal',
  'desastroso', 'insatisfecho', 'malísimo', 'no sirve', 'no funciona',
  'no me gusta', 'me enfada', 'decepción', 'mala', 'mal', 'peor',
  'horroroso', 'nefasto', 'desagradable', 'incómodo', 'no volveré',
  'no lo recomiendo', 'pésima', 'malísima', 'decepciona', 'no me gustó',
  'defraudó', 'defraudado', 'molesta', 'molesto', 'enfadado', 'enfadada',
  'frustrado', 'frustrante', 'lamentable', 'penoso', 'vergonzoso',
  'mal servicio', 'mala atención', 'no aprendí', 'no sirvió'
];

const NEUTRAL_PHRASES = [
  'todo bien', 'normal', 'está bien', 'correcto', 'regular', 'más o menos',
  'sin más', 'aceptable', 'no está mal', 'pasable', 'bueno'
];

function cleanText(text) {
  let clean = text.toLowerCase()
    .replace(/[^a-záéíóúñü\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const words = clean.split(' ');
  const filtered = words.filter(word => 
    word.length > 2 && !STOPWORDS.includes(word)
  );
  return filtered.join(' ');
}

function classifyWithLexicon(text) {
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  let found = false;
  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) {
      score++;
      found = true;
    } else if (NEGATIVE_WORDS.includes(word)) {
      score--;
      found = true;
    }
  });
  if (!found) return null;
  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return null;
}

function isNeutralPhrase(text) {
  const lower = text.toLowerCase();
  return NEUTRAL_PHRASES.some(phrase => lower.includes(phrase));
}

async function classifySentiment(text) {
  const cleaned = cleanText(text);
  if (!cleaned || cleaned.length < 3) return 'neutral';
  
  if (isNeutralPhrase(cleaned)) return 'neutral';
  
  const lexiconResult = classifyWithLexicon(cleaned);
  if (lexiconResult) return lexiconResult;
  
  try {
    const response = await manager.process('es', cleaned);
    const intent = response.intent || 'neutral';
    if (intent === 'positive') return 'positive';
    if (intent === 'negative') return 'negative';
    return 'neutral';
  } catch (error) {
    console.warn('⚠️ node-nlp falló, usando neutral:', error);
    return 'neutral';
  }
}

// =============================================
// 4. RUTAS DE LA API
// =============================================

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
});

// GET /api/survey/comments - Obtener comentarios
router.get('/survey/comments', async (req, res) => {
  try {
    const responses = await Survey.find({}, 'likes improvements additionalComments');
    res.json({ comments: responses });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/analyze-sentiment - Análisis de sentimiento
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments || comments.length === 0) {
      return res.status(400).json({ error: 'No comments provided' });
    }

    console.log(`📤 Analizando ${comments.length} comentarios...`);
    const sentiments = await Promise.all(comments.map(async (text) => {
      if (!text || text.trim().length < 3) return 'neutral';
      const result = await classifySentiment(text);
      if (result === 'positive') return 'positive';
      if (result === 'negative') return 'negative';
      return 'neutral';
    }));

    console.log('📥 Resultados:', sentiments);
    res.json({ sentiments });
  } catch (error) {
    console.error('❌ Error en análisis de sentimiento:', error);
    res.status(500).json({ error: error.message });
  }
});

// =============================================
// 5. EXPORTAR ROUTER Y FUNCIÓN DE ENTRENAMIENTO
// =============================================
module.exports = {
  router,
  trainModel
};