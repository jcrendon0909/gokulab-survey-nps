import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
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

// Registrar los componentes de Chart.js
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
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/survey/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
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
        <h2>📊 No hay datos aún</h2>
        <p>Comparte la encuesta para empezar a recibir respuestas.</p>
      </div>
    );
  }

  // Datos para el gráfico de barras (promedios)
  const barData = {
    labels: [
      'Atención Admin',
      'Comunicación Admin',
      'Agendamiento Admin',
      'Conocimiento Prof.',
      'Claridad Prof.',
      'Participación Prof.',
      'Mejora Habilidades',
      'Interés Tecnología',
      'Utilidad Proyectos',
    ],
    datasets: [
      {
        label: 'Promedio de Calificaciones (1-5)',
        data: [
          stats.averages.adminAttention,
          stats.averages.adminCommunication,
          stats.averages.adminScheduling,
          stats.averages.teacherKnowledge,
          stats.averages.teacherClarity,
          stats.averages.teacherEngagement,
          stats.averages.improvementSkills,
          stats.averages.interestTech,
          stats.averages.projectsUseful,
        ],
        backgroundColor: [
          '#e67e22', '#e67e22', '#e67e22',
          '#3498db', '#3498db', '#3498db',
          '#2ecc71', '#2ecc71', '#2ecc71',
        ],
        borderRadius: 8,
      },
    ],
  };

  // Datos para el gráfico de dona (NPS)
  const doughnutData = {
    labels: ['Promotores (9-10)', 'Pasivos (7-8)', 'Detractores (0-6)'],
    datasets: [
      {
        data: [stats.promoters, stats.passives, stats.detractors],
        backgroundColor: ['#2ecc71', '#f1c40f', '#e74c3c'],
        borderWidth: 0,
      },
    ],
  };

  // Color del NPS según el valor
  const getNpsColor = (nps: number) => {
    if (nps >= 70) return '#2ecc71';
    if (nps >= 50) return '#f1c40f';
    if (nps >= 30) return '#e67e22';
    return '#e74c3c';
  };

  const npsColor = getNpsColor(stats.nps);

  return (
    <div className="dashboard">
      <h1>📊 Dashboard de Satisfacción</h1>
      <p>Total de respuestas: <strong>{stats.total}</strong></p>

      {/* Tarjeta NPS */}
      <div className="nps-card" style={{ borderColor: npsColor }}>
        <h2>NPS (Net Promoter Score)</h2>
        <div className="nps-score" style={{ color: npsColor }}>
          {stats.nps}
        </div>
        <div className="nps-details">
          <span>Promotores: {stats.promoters}</span>
          <span>Pasivos: {stats.passives}</span>
          <span>Detractores: {stats.detractors}</span>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="chart-container">
        <h3>Promedios por Categoría</h3>
        <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>

      {/* Gráfico de dona */}
      <div className="chart-container">
        <h3>Distribución de NPS</h3>
        <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
      </div>
    </div>
  );
};

export default Dashboard;