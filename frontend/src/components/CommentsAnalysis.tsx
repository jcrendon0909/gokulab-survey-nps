import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { removeStopwords } from 'stopword';
import './CommentsAnalysis.css';

// Declaración de tipos para wordcloud2 (ya que no tiene @types)
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

const CommentsAnalysis: React.FC = () => {
  const [likesWords, setLikesWords] = useState<Word[]>([]);
  const [improvementsWords, setImprovementsWords] = useState<Word[]>([]);
  const [additionalWords, setAdditionalWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Refs para los contenedores de la nube
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

  // Procesar textos: limpiar, tokenizar, eliminar stopwords y contar frecuencias
  const processTexts = (texts: string[]): Word[] => {
    const fullText = texts.filter(t => t && t.trim() !== '').join(' ');
    if (!fullText) return [];

    const words = fullText
      .toLowerCase()
      .match(/[a-záéíóúñü0-9]+/g) || [];

    const filtered = removeStopwords(words, stopword.es);

    const freq: Record<string, number> = {};
    filtered.forEach(word => {
      if (word.length < 3) return;
      freq[word] = (freq[word] || 0) + 1;
    });

    return Object.entries(freq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 50);
  };

  // Renderizar la nube de palabras usando wordcloud2
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

  // Efectos para renderizar las nubes cuando cambian los datos
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