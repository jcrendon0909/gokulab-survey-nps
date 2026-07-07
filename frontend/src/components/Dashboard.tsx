import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import CommentsAnalysis from './CommentsAnalysis';
import './Dashboard.css';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Stats {
  total: number;
  nps: number;
  promoters: number;
  passives: number;
  detractors: number;
  averages: {
    adminAttention: number;
    adminCommunication: number;
    adminScheduling: number;
    teacherKnowledge: number;
    teacherClarity: number;
    teacherEngagement: number;
    improvementSkills: number;
    interestTech: number;
    projectsUseful: number;
  };
  ageDistribution: Record<string, number>;
  respondentTypeDistribution: Record<string, number>;
  recentResponses: Array<{
    id: string;
    studentName: string;
    npsScore: number;
    respondentType: string;
    createdAt: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || '';
        console.log('🔍 API_URL en Dashboard:', API_URL);
        const response = await axios.get(`${API_URL}/api/survey/stats`);
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        alert('No se pudieron cargar las estadísticas. Verifica la conexión al backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="dashboard-loading">Cargando estadísticas...</div>;
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="dashboard-empty">
        <h2>📊 No hay respuestas aún</h2>
        <p>Comparte la encuesta para comenzar a recopilar datos.</p>
      </div>
    );
  }

  // Datos para gráfico de barras de promedios
  const avgLabels = [
    'Atención Admin.',
    'Comunicación Admin.',
    'Agendamiento',
    'Dominio del Tema',
    'Claridad del Profesor',
    'Participación',
    'Mejora en Habilidades',
    'Interés en Tecnología',
    'Utilidad de Proyectos',
  ];
  const avgValues = [
    stats.averages.adminAttention,
    stats.averages.adminCommunication,
    stats.averages.adminScheduling,
    stats.averages.teacherKnowledge,
    stats.averages.teacherClarity,
    stats.averages.teacherEngagement,
    stats.averages.improvementSkills,
    stats.averages.interestTech,
    stats.averages.projectsUseful,
  ];

  const barData = {
    labels: avgLabels,
    datasets: [
      {
        label: 'Promedio (1-5)',
        data: avgValues,
        backgroundColor: 'rgba(38, 170, 163, 0.6)',
        borderColor: '#26AAA3',
        borderWidth: 2,
      },
    ],
  };

  // Datos para gráfico de dona de NPS
  const npsData = {
    labels: ['Promotores (9-10)', 'Pasivos (7-8)', 'Detractores (0-6)'],
    datasets: [
      {
        data: [stats.promoters, stats.passives, stats.detractors],
        backgroundColor: ['#67A934', '#F8B50E', '#D61A1F'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  };

  // Datos para distribución por edad
  const ageLabels = Object.keys(stats.ageDistribution);
  const ageValues = Object.values(stats.ageDistribution);
  const ageChartData = {
    labels: ageLabels,
    datasets: [
      {
        label: 'Respuestas por Edad',
        data: ageValues,
        backgroundColor: 'rgba(214, 26, 31, 0.6)',
        borderColor: '#D61A1F',
        borderWidth: 2,
      },
    ],
  };

  return (
    <motion.div 
      className="dashboard-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="dashboard-header">
        <h1>📊 Panel de Control</h1>
        <p>Estadísticas de la encuesta de satisfacción</p>
      </header>

      {/* Tarjetas de resumen */}
      <div className="summary-cards">
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <h3>Total de Respuestas</h3>
          <p className="card-number">{stats.total}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <h3>NPS</h3>
          <p className="card-number" style={{ color: stats.nps >= 50 ? '#67A934' : stats.nps >= 0 ? '#F8B50E' : '#D61A1F' }}>
            {stats.nps}
          </p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <h3>Promotores</h3>
          <p className="card-number" style={{ color: '#67A934' }}>{stats.promoters}</p>
        </motion.div>
        <motion.div className="card" whileHover={{ scale: 1.02 }}>
          <h3>Detractores</h3>
          <p className="card-number" style={{ color: '#D61A1F' }}>{stats.detractors}</p>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Promedios por Sección</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart-card">
          <h3>Distribución NPS</h3>
          <Doughnut data={npsData} options={{ responsive: true }} />
        </div>
        <div className="chart-card">
          <h3>Respuestas por Edad</h3>
          <Bar data={ageChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart-card">
          <h3>Tipo de Encuestado</h3>
          <Doughnut 
            data={{
              labels: Object.keys(stats.respondentTypeDistribution),
              datasets: [{
                data: Object.values(stats.respondentTypeDistribution),
                backgroundColor: ['#26AAA3', '#F8B50E', '#D61A1F'],
                borderColor: '#ffffff',
                borderWidth: 2,
              }],
            }} 
            options={{ responsive: true }} 
          />
        </div>
      </div>

      {/* Tabla de respuestas recientes */}
      <div className="recent-table">
        <h3>Últimas Respuestas</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>NPS</th>
              <th>Tipo</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentResponses.map((resp) => (
              <tr key={resp.id}>
                <td>{resp.studentName}</td>
                <td>{resp.npsScore}</td>
                <td>{resp.respondentType}</td>
                <td>{new Date(resp.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Análisis de comentarios */}
      <CommentsAnalysis />
    </motion.div>
  );
};

export default Dashboard;