import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './CommentsAnalysis.css';

// Declaración de tipos para wordcloud2
declare const WordCloud: any;

interface Comment {
  likes: string;
  improvements: string;
  additionalComments: string;
}

interface Word {
  text: string;
  value: number;
}

// Lista de stopwords en español
const stopwordsES = [
  'a', 'al', 'algo', 'algunas', 'algunos', 'ante', 'antes', 'aquel', 'aquella', 'aquellas', 'aquellos', 'aquí', 'arriba',
  'bajo', 'bastante', 'bien', 'cada', 'cierta', 'ciertas', 'ciertos', 'como', 'con', 'conmigo', 'contigo', 'contra',
  'cual', 'cuales', 'cualquier', 'cuando', 'cuanto', 'cuantos', 'de', 'del', 'demás', 'dentro', 'desde', 'donde',
  'durante', 'e', 'el', 'ella', 'ellas', 'ello', 'ellos', 'en', 'encima', 'entonces', 'entre', 'era', 'eran', 'esa',
  'esas', 'ese', 'eso', 'esos', 'esta', 'estaba', 'estaban', 'estado', 'estados', 'estamos', 'estando', 'estar', 'estará',
  'estas', 'este', 'esto', 'estos', 'estoy', 'ex', 'excepto', 'fin', 'fue', 'fuera', 'fueron', 'gran', 'hasta', 'hay',
  'he', 'hemos', 'hoy', 'la', 'las', 'le', 'les', 'lo', 'los', 'más', 'me', 'mi', 'mis', 'mismo', 'mucho', 'muy', 'nada',
  'ni', 'no', 'nos', 'nosotros', 'nuestra', 'nuestras', 'nuestro', 'nuestros', 'o', 'os', 'otra', 'otras', 'otro', 'otros',
  'para', 'pero', 'poco', 'por', 'porque', 'pues', 'que', 'quien', 'quienes', 'qué', 'se', 'ser', 'será', 'sí', 'sido',
  'siendo', 'sin', 'sobre', 'son', 'su', 'sus', 'suya', 'suyas', 'suyo', 'suyos', 'tal', 'también', 'tanto', 'te', 'tendrá',
  'ti', 'tiene', 'tienen', 'toda', 'todas', 'todo', 'todos', 'tu', 'tus', 'un', 'una', 'unas', 'uno', 'unos', 'usted',
  'vuestra', 'vuestras', 'vuestro', 'vuestros', 'y', 'ya', 'yo'
];

const CommentsAnalysis: React.FC = () => {
  const [likesWords, setLikesWords] = useState<Word[]>([]);
  const [improvementsWords, setImprovementsWords] = useState<Word[]>([]);
  const [additionalWords, setAdditionalWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const likesRef = useRef<HTMLDivElement>(null);
  const improvementsRef = useRef<HTMLDivElement>(null);
  const additionalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        console.log('🔍 API_URL en Comments:', API_URL);
        const response = await axios.get(`${API_URL}/api/survey/comments`);
        console.log('📊 Comentarios recibidos:', response.data);
        const comments: Comment[] = response.data.comments;

        setLikesWords(processTexts(comments.map(c => c.likes)));
        setImprovementsWords(processTexts(comments.map(c => c.improvements)));
        setAdditionalWords(processTexts(comments.map(c => c.additionalComments)));
      } catch (err) {
        console.error('Error cargando comentarios:', err);
        setError('No se pudieron cargar los comentarios.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // Función para procesar textos (con stopwords manuales)
  const processTexts = (texts: string[]): Word[] => {
    const fullText = texts.filter(t => t && t.trim() !== '').join(' ');
    if (!fullText) return [];

    const words = fullText
      .toLowerCase()
      .match(/[a-záéíóúñü0-9]+/g) || [];

    // Filtrar stopwords manualmente
    const filtered = words.filter(word => 
      word.length >= 3 && !stopwordsES.includes(word)
    );

    const freq: Record<string, number> = {};
    filtered.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });

    return Object.entries(freq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  };

  // Renderizar la nube
  const renderWordCloud = (words: Word[], container: HTMLDivElement | null) => {
    if (!container || words.length === 0) return;
    
    container.innerHTML = '';
    
    try {
      WordCloud(container, {
        list: words.map(w => [w.text, w.value]),
        gridSize: 8,
        weightFactor: (w: number) => w * 8,
        fontFamily: 'Poppins, sans-serif',
        color: () => {
          const colors = ['#26AAA3', '#67A934', '#D61A1F', '#F8B50E', '#2c3e50'];
          return colors[Math.floor(Math.random() * colors.length)];
        },
        rotateRatio: 0.5,
        minRotation: -Math.PI / 6,
        maxRotation: Math.PI / 6,
      });
    } catch (err) {
      console.error('Error renderizando nube:', err);
    }
  };

  useEffect(() => {
    if (likesWords.length > 0) renderWordCloud(likesWords, likesRef.current);
  }, [likesWords]);

  useEffect(() => {
    if (improvementsWords.length > 0) renderWordCloud(improvementsWords, improvementsRef.current);
  }, [improvementsWords]);

  useEffect(() => {
    if (additionalWords.length > 0) renderWordCloud(additionalWords, additionalRef.current);
  }, [additionalWords]);

  if (loading) return <div className="comments-loading">Cargando comentarios...</div>;
  if (error) return <div className="comments-error">{error}</div>;

  return (
    <div className="comments-container">
      <h2>💬 Análisis de Comentarios</h2>
      <p className="comments-subtitle">Nubes de palabras de las preguntas abiertas</p>

      <div className="clouds-grid">
        <div className="cloud-card">
          <h3>¿Qué te gusta más de GokuLab?</h3>
          <div 
            ref={likesRef} 
            className="word-cloud-container"
            style={{ width: '100%', height: '300px' }}
          ></div>
          {likesWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>

        <div className="cloud-card">
          <h3>¿Qué recomendarías mejorar?</h3>
          <div 
            ref={improvementsRef} 
            className="word-cloud-container"
            style={{ width: '100%', height: '300px' }}
          ></div>
          {improvementsWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>

        <div className="cloud-card">
          <h3>Comentarios adicionales</h3>
          <div 
            ref={additionalRef} 
            className="word-cloud-container"
            style={{ width: '100%', height: '300px' }}
          ></div>
          {additionalWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>
      </div>
    </div>
  );
};

export default CommentsAnalysis;