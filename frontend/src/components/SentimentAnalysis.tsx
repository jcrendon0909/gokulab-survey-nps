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
import WordCloud from 'd3-cloud';
import './SentimentAnalysis.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface WordCount {
  text: string;
  value: number;
}

const SentimentAnalysis: React.FC = () => {
  const [sentiments, setSentiments] = useState<{ positive: number; negative: number; neutral: number } | null>(null);
  const [wordClouds, setWordClouds] = useState<{ positive: WordCount[]; negative: WordCount[]; neutral: WordCount[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentiment = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        console.log('🔍 API_URL en SentimentAnalysis:', API_URL);
        const response = await axios.get(`${API_URL}/api/survey/comments`);
        const comments = response.data.comments
          .map((c: any) => [c.likes, c.improvements, c.additionalComments])
          .flat()
          .filter((text: string) => text && text.trim().length > 0);

        console.log('📝 Comentarios obtenidos:', comments.length);

        if (comments.length === 0) {
          setError('No hay comentarios para analizar.');
          setLoading(false);
          return;
        }

        console.log(`📤 Analizando ${comments.length} comentarios con NLP local...`);
        const sentimentResponse = await axios.post(`${API_URL}/api/analyze-sentiment`, { comments });

        const rawLabels = sentimentResponse.data.sentiments;
        const sentimentLabels = rawLabels.map((label: string) => {
          if (label === 'positive') return 'positive';
          if (label === 'negative') return 'negative';
          return 'neutral';
        });

        console.log('📥 Resultados normalizados:', sentimentLabels);

        // Contar sentimientos
        const counts = { positive: 0, negative: 0, neutral: 0 };
        sentimentLabels.forEach((label: string) => {
          if (label === 'positive') counts.positive++;
          else if (label === 'negative') counts.negative++;
          else counts.neutral++;
        });
        console.log('📊 Conteos:', counts);
        setSentiments(counts);

        // Generar nubes de palabras
        const wc: any = { positive: [], negative: [], neutral: [] };
        comments.forEach((text: string, index: number) => {
          const label = sentimentLabels[index] || 'neutral';
          const words = text.toLowerCase().match(/[a-záéíóúñü0-9]+/g) || [];
          words.forEach((word: string) => {
            if (word.length < 3) return;
            const stopwords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'porque', 'que', 'de', 'en', 'con', 'para', 'por', 'sin', 'sobre', 'entre', 'hasta', 'desde', 'durante', 'según', 'mediante', 'versus', 'vía', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro', 'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros', 'vuestras'];
            if (stopwords.includes(word)) return;
            const existing = wc[label].find((w: any) => w.text === word);
            if (existing) existing.value++;
            else wc[label].push({ text: word, value: 1 });
          });
        });

        for (const key in wc) {
          wc[key].sort((a: WordCount, b: WordCount) => b.value - a.value);
          wc[key] = wc[key].slice(0, 20);
        }

        console.log('☁️ Nubes generadas:', wc);
        setWordClouds(wc);

      } catch (err: any) {
        console.error('❌ Error en análisis de sentimiento:', err);
        setError('No se pudo cargar el análisis de sentimiento.');
      } finally {
        setLoading(false);
      }
    };

    fetchSentiment();
  }, []);

  // Renderizar nubes con d3-cloud
  useEffect(() => {
    if (!wordClouds) {
      console.log('⏳ wordClouds aún no está listo');
      return;
    }
    console.log('🎨 Renderizando nubes con wordClouds:', wordClouds);
    setTimeout(() => {
      renderCloud(wordClouds.positive, 'cloud-positive');
      renderCloud(wordClouds.negative, 'cloud-negative');
      renderCloud(wordClouds.neutral, 'cloud-neutral');
    }, 500);
  }, [wordClouds]);

  const renderCloud = (words: WordCount[], containerId: string) => {
  const container = document.getElementById(containerId);
  console.log(`🔍 Contenedor ${containerId}:`, container);
  if (!container) {
    console.error(`❌ Contenedor ${containerId} no encontrado`);
    return;
  }
  if (!words || words.length === 0) {
    container.innerHTML = '<p class="no-words">No hay palabras.</p>';
    return;
  }
  container.innerHTML = '';

  // Tamaño fijo para asegurar visibilidad
  const width = 350;
  const height = 250;

  const layout = WordCloud()
    .size([width, height])
    .words(words)
    .padding(2)
    .rotate(0)
    .font('Poppins')
    .fontSize((d: any) => (d.value / 2) * 15 + 10)
    .on('end', (drawn: any) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
      svg.setAttribute('style', 'display: block; background: transparent;');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${width/2}, ${height/2})`);
      drawn.forEach((word: any) => {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('font-family', word.font);
        text.setAttribute('font-size', `${word.size}px`);
        text.setAttribute('fill', word.color || '#333');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('transform', `translate(${word.x}, ${word.y})`);
        text.textContent = word.text;
        g.appendChild(text);
      });
      svg.appendChild(g);
      container.appendChild(svg);
      console.log(`✅ Nube ${containerId} renderizada`);
    });

  layout.start();
};

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