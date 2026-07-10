const express = require('express');
const Survey = require('../models/SurveyResponse');
const { NlpManager } = require('node-nlp');

const router = express.Router();

// =============================================
// 1. CONFIGURACIÓN DEL MODELO node-nlp
// =============================================
const manager = new NlpManager({ languages: ['es'] });

// Entrenamiento (mantén tu lista de frases, no la repito)
(async () => {
  // ... (todo tu entrenamiento actual)
  await manager.train();
  console.log('✅ Modelo node-nlp entrenado');
})();

// =============================================
// 2. STOPWORDS
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

// =============================================
// 3. DICCIONARIOS DE SENTIMIENTOS
// =============================================
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
  'sin más', 'aceptable', 'no está mal', 'pasable', 'bueno' // 'bueno' puede ser neutro en algunos contextos
];

// =============================================
// 4. FUNCIONES DE CLASIFICACIÓN
// =============================================
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
  
  // 1. Frases neutrales predefinidas
  if (isNeutralPhrase(cleaned)) return 'neutral';
  
  // 2. Diccionario
  const lexiconResult = classifyWithLexicon(cleaned);
  if (lexiconResult) return lexiconResult;
  
  // 3. node-nlp
  try {
    const response = await manager.process('es', cleaned);
    const intent = response.intent || 'neutral';
    // Normalizar: 'None' u otros → neutral
    if (intent === 'positive') return 'positive';
    if (intent === 'negative') return 'negative';
    return 'neutral';
  } catch (error) {
    console.warn('⚠️ node-nlp falló, usando neutral:', error);
    return 'neutral';
  }
}

// =============================================
// 5. ENDPOINTS
// =============================================
// (tus endpoints GET y POST existentes se mantienen igual)

// POST /api/analyze-sentiment
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
      // Aseguramos que solo devuelva 'positive', 'negative' o 'neutral'
      if (result === 'positive') return 'positive';
      if (result === 'negative') return 'negative';
      return 'neutral';
    }));

    console.log('📥 Resultados:', sentiments);
    res.json({ sentiments });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;