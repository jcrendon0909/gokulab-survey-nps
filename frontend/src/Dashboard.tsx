import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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

function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/survey/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="loading">Cargando estadísticas...</div>;
  if (!stats || stats.total === 0) return <div className="empty">No hay encuestas aún</div>;

  const npsColor = stats.nps >= 70 ? '#27ae60' : stats.nps >= 50 ? '#f39c12' : '#e74c3c';
  const npsLabel = stats.nps >= 70 ? 'Excelente' : stats.nps >= 50 ? 'Bueno' : 'Necesita mejorar';

  const barData = {
    labels: ['Atención', 'Comunicación', 'Agendamiento', 'Conocimiento', 'Claridad', 'Participación', 'Habilidades', 'Interés', 'Utilidad'],
    datasets: [
      {
        label: 'Promedio (1-5)',
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
        backgroundColor: 'rgba(230, 126, 34, 0.6)',
        borderColor: 'rgba(230, 126, 34, 1)',
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Promotores', 'Pasivos', 'Detractores'],
    datasets: [
      {
        data: [stats.promoters, stats.passives, stats.detractors],
        backgroundColor: ['#27ae60', '#f39c12', '#e74c3c'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="dashboard">
      <h1>📊 Panel de Estadísticas</h1>
      <p>Total de encuestas: <strong>{stats.total}</strong></p>

      <div className="nps-card" style={{ borderColor: npsColor }}>
        <h2>NPS: {stats.nps}</h2>
        <p style={{ color: npsColor }}>{npsLabel}</p>
        <div className="nps-details">
          <span>Promotores: {stats.promoters}</span>
          <span>Pasivos: {stats.passives}</span>
          <span>Detractores: {stats.detractors}</span>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart-box">
          <h3>Promedios por categoría</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="chart-box">
          <h3>Distribución NPS</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;