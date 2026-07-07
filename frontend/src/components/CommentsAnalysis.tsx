import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WordCloud from 'wordcloud2';
import { removeStopwords } from 'stopword';
import './CommentsAnalysis.css';

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

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        console.log('🔍 API_URL en Comments:', API_URL);
        const response = await axios.get(`${API_URL}/api/survey/comments`);
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

  // Función para renderizar la nube de palabras
  const renderWordCloud = (words: Word[], containerId: string) => {
    if (words.length === 0) return;
    
    setTimeout(() => {
      const container = document.getElementById(containerId);
      if (container) {
        // Limpiar el contenedor
        container.innerHTML = '';
        
        // Configurar la nube
        WordCloud(container, {
          list: words.map(w => [w.text, w.value]),
          gridSize: 8,
          weightFactor: (w: number) => w * 8,
          fontFamily: 'Poppins, sans-serif',
          color: (word: string, weight: number) => {
            const colors = ['#26AAA3', '#67A934', '#D61A1F', '#F8B50E', '#2c3e50'];
            return colors[Math.floor(Math.random() * colors.length)];
          },
          rotateRatio: 0.5,
          minRotation: -Math.PI / 6,
          maxRotation: Math.PI / 6,
        });
      }
    }, 100);
  };

  // Efecto para renderizar las nubes cuando cambian los datos
  useEffect(() => {
    if (likesWords.length > 0) renderWordCloud(likesWords, 'cloud-likes');
  }, [likesWords]);

  useEffect(() => {
    if (improvementsWords.length > 0) renderWordCloud(improvementsWords, 'cloud-improvements');
  }, [improvementsWords]);

  useEffect(() => {
    if (additionalWords.length > 0) renderWordCloud(additionalWords, 'cloud-additional');
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
          <div id="cloud-likes" className="word-cloud-container"></div>
          {likesWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>

        <div className="cloud-card">
          <h3>¿Qué recomendarías mejorar?</h3>
          <div id="cloud-improvements" className="word-cloud-container"></div>
          {improvementsWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>

        <div className="cloud-card">
          <h3>Comentarios adicionales</h3>
          <div id="cloud-additional" className="word-cloud-container"></div>
          {additionalWords.length === 0 && <p className="no-data">No hay comentarios aún.</p>}
        </div>
      </div>
    </div>
  );
};

export default CommentsAnalysis;