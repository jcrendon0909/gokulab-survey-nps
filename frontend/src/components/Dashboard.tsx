import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import WordCloud from 'd3-cloud';
import './SentimentAnalysis.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WordCount {
  text: string;
  value: number;
}

const SentimentAnalysis: React.FC = () => {
  // ✅ Todos los hooks se declaran siempre, sin condiciones
  const [sentiments, setSentiments] = useState<{ positive: number; negative: number; neutral: number } | null>(null);
  const [wordClouds, setWordClouds] = useState<{ positive: WordCount[]; negative: WordCount[]; neutral: WordCount[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        const response = await axios.get(`${API_URL}/api/survey/comments`);
        const comments = response.data.comments
          .map((c: any) => [c.likes, c.improvements, c.additionalComments])
          .flat()
          .filter(Boolean);
        if (comments.length === 0) {
          setError('No hay comentarios para analizar.');
          setLoading(false);
          return;
        }

        const SENTIMENT_URL = import.meta.env.VITE_SENTIMENT_API_URL || '';
        const result = await axios.post(`${SENTIMENT_URL}/analyze`, { comments });

        setSentiments(result.data.sentiments);
        const wc: any = {};
        for (const [sent, words] of Object.entries(result.data.word_counts)) {
          wc[sent] = (words as any[]).map(([text, value]) => ({ text, value }));
        }
        setWordClouds(wc);
      } catch (err) {
        console.error('Error en análisis de sentimiento:', err);
        setError('No se pudo cargar el análisis de sentimiento.');
      } finally {
        setLoading(false);
      }
    };
    fetchSentiment();
  }, []);

  // ✅ Efecto para renderizar nubes (siempre se ejecuta, pero con verificación interna)
  useEffect(() => {
    if (!wordClouds) return;
    setTimeout(() => {
      renderCloud(wordClouds.positive, 'cloud-positive');
      renderCloud(wordClouds.negative, 'cloud-negative');
      renderCloud(wordClouds.neutral, 'cloud-neutral');
    }, 100);
  }, [wordClouds]);

  // Función renderCloud (sin hooks, solo lógica)
  const renderCloud = (words: WordCount[], containerId: string) => {
    if (!words || words.length === 0) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const layout = WordCloud()
      .size([300, 200])
      .words(words)
      .padding(2)
      .rotate(0)
      .font('Poppins')
      .fontSize((d: any) => (d.value / 5) * 20 + 10)
      .on('end', (drawn: any) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', `0 0 ${layout.size()[0]} ${layout.size()[1]}`);
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('transform', 'translate(0, 0)');
        drawn.forEach((word: any) => {
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('font-family', word.font);
          text.setAttribute('font-size', `${word.size}px`);
          text.setAttribute('fill', word.color || '#333');
          text.setAttribute('text-anchor', 'middle');
          text.setAttribute('transform', `translate(${word.x + 150}, ${word.y + 100})`);
          text.textContent = word.text;
          g.appendChild(text);
        });
        svg.appendChild(g);
        container.appendChild(svg);
      });

    layout.start();
  };

  // ✅ Retornos condicionales (después de todos los hooks)
  if (loading) return <div className="sentiment-loading">Analizando sentimientos...</div>;
  if (error) return <div className="sentiment-error">{error}</div>;
  if (!sentiments) return <div className="sentiment-empty">No hay datos de sentimiento.</div>;

  const chartData = {
    labels: ['Positivos', 'Negativos', 'Neutrales'],
    datasets: [{
      data: [sentiments.positive, sentiments.negative, sentiments.neutral],
      backgroundColor: ['#67A934', '#D61A1F', '#F8B50E'],
      borderColor: '#ffffff',
      borderWidth: 2,
    }],
  };

  return (
    <div className="sentiment-container">
      <h2>💬 Análisis de Sentimiento</h2>
      <div className="sentiment-chart">
        <Bar data={chartData} options={{ plugins: { legend: { display: true } } }} />
      </div>
      <div className="sentiment-clouds">
        <div className="cloud-card">
          <h3>😊 Positivo</h3>
          <div id="cloud-positive" className="word-cloud"></div>
        </div>
        <div className="cloud-card">
          <h3>😠 Negativo</h3>
          <div id="cloud-negative" className="word-cloud"></div>
        </div>
        <div className="cloud-card">
          <h3>😐 Neutral</h3>
          <div id="cloud-neutral" className="word-cloud"></div>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;