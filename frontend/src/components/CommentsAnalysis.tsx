import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { removeStopwords } from 'stopword';
import { es } from 'stopword';
import './CommentsAnalysis.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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
        const comments = response.data.comments;

        setLikesWords(processTexts(comments.map((c: any) => c.likes)));
        setImprovementsWords(processTexts(comments.map((c: any) => c.improvements)));
        setAdditionalWords(processTexts(comments.map((c: any) => c.additionalComments)));
      } catch (err) {
        console.error('❌ Error cargando comentarios:', err);
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

    const filtered = removeStopwords(words, es);

    const freq: Record<string, number> = {};
    filtered.forEach(word => {
      if (word.length < 3) return;
      freq[word] = (freq[word] || 0) + 1;
    });

    return Object.entries(freq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15); // Mostrar las 15 más frecuentes
  };

  // Configuración de los gráficos
  const chartOptions = {
    indexAxis: 'y' as const, // Barras horizontales
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  const createChartData = (words: Word[]) => ({
    labels: words.map(w => w.text),
    datasets: [
      {
        data: words.map(w => w.value),
        backgroundColor: '#26AAA3',
        borderColor: '#1D8A84',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  });

  if (loading) return <div className="comments-loading">Cargando comentarios...</div>;
  if (error) return <div className="comments-error">{error}</div>;

  return (
    <div className="comments-container">
      <h2>💬 Análisis de Comentarios</h2>
      <p className="comments-subtitle">Palabras más frecuentes en las preguntas abiertas</p>

      <div className="clouds-grid">
        <div className="cloud-card">
          <h3>¿Qué te gusta más de GokuLab?</h3>
          <div style={{ height: '300px' }}>
            {likesWords.length > 0 ? (
              <Bar data={createChartData(likesWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
        </div>

        <div className="cloud-card">
          <h3>¿Qué recomendarías mejorar?</h3>
          <div style={{ height: '300px' }}>
            {improvementsWords.length > 0 ? (
              <Bar data={createChartData(improvementsWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
        </div>

        <div className="cloud-card">
          <h3>Comentarios adicionales</h3>
          <div style={{ height: '300px' }}>
            {additionalWords.length > 0 ? (
              <Bar data={createChartData(additionalWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsAnalysis;