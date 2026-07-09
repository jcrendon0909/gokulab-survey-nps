// ✅ NUEVO ENDPOINT: Análisis de sentimiento con Hugging Face API
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { comments } = req.body;
    if (!comments || comments.length === 0) {
      return res.status(400).json({ error: 'No comments provided' });
    }

    const HF_TOKEN = process.env.HF_TOKEN;
    if (!HF_TOKEN) {
      console.error('❌ HF_TOKEN no configurado en variables de entorno');
      return res.status(500).json({ error: 'HF_TOKEN not configured' });
    }

    console.log(`📤 Analizando ${comments.length} comentarios con Hugging Face...`);

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-xlm-roberta-base-sentiment',
      { inputs: comments },
      { 
        headers: { 
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const results = response.data;
    console.log('📥 Respuesta de Hugging Face:', JSON.stringify(results, null, 2));

    // ✅ CORRECCIÓN: Eliminar la anotación de tipo `: any`
    const sentiments = results.map((r) => {
      const label = r[0]?.label;
      if (label === 'LABEL_2') return 'positive';
      if (label === 'LABEL_0') return 'negative';
      return 'neutral';
    });

    res.json({ sentiments });
  } catch (error) {
    console.error('❌ Error en análisis de sentimiento:', error.message);
    if (error.response) {
      console.error('📄 Respuesta de Hugging Face:', error.response.data);
    }
    res.status(500).json({ error: error.message });
  }
});