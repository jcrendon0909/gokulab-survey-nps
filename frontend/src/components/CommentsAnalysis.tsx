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

    // ✅ Filtrado más agresivo (stopwords y palabras cortas)
    const filtered = removeStopwords(words, es);
    const customStopwords = ['muy', 'son', 'las', 'mis', 'los', 'sus', 'tus', 'nos', 'vos', 'tan', 'más', 'menos', 'tanto', 'cuando', 'donde', 'como', 'pero', 'porque', 'sino', 'aunque', 'mientras', 'entre', 'sobre', 'bajo', 'tras', 'durante', 'según', 'vía', 'sin', 'con', 'para', 'por', 'en', 'de', 'a', 'al', 'del', 'lo', 'le', 'la', 'el', 'es', 'un', 'una', 'algo', 'alguien', 'nada', 'todo', 'cada', 'otro', 'mismo', 'si', 'no', 'sí', 'ya', 'ahora', 'luego', 'después', 'antes', 'hasta', 'siempre', 'nunca', 'jamás'];
    const filteredWords = filtered.filter(word => 
      word.length > 3 && 
      !customStopwords.includes(word) &&
      !/^\d+$/.test(word) // elimina números
    );

    const freq: Record<string, number> = {};
    filteredWords.forEach(word => {
      freq[word] = (freq[word] || 0) + 1;
    });

    // ✅ Ordenar y mostrar top 10 (más relevantes)
    return Object.entries(freq)
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };

  // ✅ Colores degradados (identidad GokuLab)
  const getGradientColors = (count: number) => {
    const colors = [
      '#26AAA3', '#1D8A84', '#67A934', '#F8B50E', '#D61A1F',
      '#E67E22', '#2C3E50', '#3498DB', '#9B59B6', '#1ABC9C'
    ];
    return colors.slice(0, count);
  };

  const chartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Frecuencia: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            weight: '500' as const,
          }
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            weight: '600' as const,
          }
        }
      }
    },
    // ✅ Animaciones
    animation: {
      duration: 1500,
      easing: 'easeInOutQuart' as const,
    },
  };

  const createChartData = (words: Word[]) => {
    const colors = getGradientColors(words.length);
    return {
      labels: words.map(w => w.text),
      datasets: [
        {
          data: words.map(w => w.value),
          backgroundColor: colors,
          borderColor: colors.map(c => c),
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.7,
          categoryPercentage: 0.8,
        },
      ],
    };
  };

  if (loading) return <div className="comments-loading">Cargando comentarios...</div>;
  if (error) return <div className="comments-error">{error}</div>;

  return (
    <div className="comments-container">
      <h2>💬 Análisis de Comentarios</h2>
      <p className="comments-subtitle">Palabras más frecuentes en las preguntas abiertas</p>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>✨ ¿Qué te gusta más de GokuLab?</h3>
          <div style={{ height: '350px' }}>
            {likesWords.length > 0 ? (
              <Bar data={createChartData(likesWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
          <p className="chart-footer">Top 10 palabras positivas</p>
        </div>

        <div className="chart-card">
          <h3>⚡ ¿Qué recomendarías mejorar?</h3>
          <div style={{ height: '350px' }}>
            {improvementsWords.length > 0 ? (
              <Bar data={createChartData(improvementsWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
          <p className="chart-footer">Top 10 palabras de mejora</p>
        </div>

        <div className="chart-card">
          <h3>🌟 Comentarios adicionales</h3>
          <div style={{ height: '350px' }}>
            {additionalWords.length > 0 ? (
              <Bar data={createChartData(additionalWords)} options={chartOptions} />
            ) : (
              <p className="no-data">No hay comentarios aún.</p>
            )}
          </div>
          <p className="chart-footer">Top 10 palabras adicionales</p>
        </div>
      </div>
    </div>
  );
};

export default CommentsAnalysis;