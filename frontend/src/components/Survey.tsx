import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../App.css';

function Survey() {
  const [formData, setFormData] = useState({
    studentName: '',
    studentAgeRange: '',
    respondentType: '',
    npsScore: 0,
    adminAttention: 3,
    adminCommunication: 3,
    adminScheduling: 3,
    teacherKnowledge: 3,
    teacherClarity: 3,
    teacherEngagement: 3,
    improvementSkills: 3,
    interestTech: 3,
    projectsUseful: 3,
    likes: '',
    improvements: '',
    additionalComments: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNpsChange = (value: number) => {
    setFormData(prev => ({ ...prev, npsScore: value }));
  };

  const handleStarClick = (name: string, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    console.log('📤 Enviando datos:', formData);
    
    // ✅ Usa la variable de entorno para la URL completa
    const API_URL = import.meta.env.VITE_API_URL || '';
    console.log('🔍 API_URL:', API_URL); // Para depurar
    const response = await axios.post(`${API_URL}/api/survey`, formData);
    
    console.log('✅ Respuesta del servidor:', response.data);
    setSubmitted(true);
  } catch (error: any) {
    console.error('❌ Error completo:', error);
    if (error.response) {
      console.error('❌ Respuesta del servidor (error):', error.response.data);
      console.error('❌ Status:', error.response.status);
      alert(`Error ${error.response.status}: ${error.response.data?.error || 'Error al enviar la encuesta'}`);
    } else if (error.request) {
      console.error('❌ No se recibió respuesta del servidor');
      alert('No se pudo conectar con el servidor. ¿Está el backend corriendo?');
    } else {
      console.error('❌ Error al configurar la petición:', error.message);
      alert('Error: ' + error.message);
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app">
      <motion.header 
        className="header"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="header-content">
          <motion.img 
            src="/gokulab-logo.png" 
            alt="GokuLab Logo" 
            className="logo"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          />
          <div className="header-text">
            <h1>GŌKU LAB</h1>
            <p>Encuesta de Satisfacción</p>
            <motion.span 
              className="subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Tu opinión es muy importante para nosotros ✨
            </motion.span>
          </div>
        </div>
      </motion.header>

      <motion.form 
        className="survey-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        onSubmit={handleSubmit}
      >
        {/* Secciones del formulario (sin cambios) */}
        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
        >
          <h2>📋 Datos del Alumno</h2>
          <div className="form-group">
            <label>Nombre (opcional)</label>
            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Ej: Juan Pérez" />
          </div>
          <div className="form-group">
            <label>Rango de edad</label>
            <select name="studentAgeRange" value={formData.studentAgeRange} onChange={handleChange}>
              <option value="">Selecciona...</option>
              <option value="4-6">4-6 años</option>
              <option value="7-9">7-9 años</option>
              <option value="10-12">10-12 años</option>
              <option value="13-15">13-15 años</option>
              <option value="16+">16+ años</option>
            </select>
          </div>
          <div className="form-group">
            <label>Eres...</label>
            <select name="respondentType" value={formData.respondentType} onChange={handleChange}>
              <option value="">Selecciona...</option>
              <option value="padre">Padre/Madre</option>
              <option value="alumno">Alumno</option>
            </select>
          </div>
        </motion.section>

        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
        >
          <h2>⭐ ¿Recomendarías GokuLab?</h2>
          <p className="section-description">
            Del 0 al 10, ¿qué tan probable es que recomiendes GokuLab a un amigo?
          </p>
          <div className="nps-group">
            {[...Array(11)].map((_, i) => (
              <motion.label 
                key={i} 
                className="nps-option"
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <input
                  type="radio"
                  name="npsScore"
                  value={i}
                  checked={formData.npsScore === i}
                  onChange={() => handleNpsChange(i)}
                />
                <motion.span
                  animate={formData.npsScore === i ? { 
                    scale: [1, 1.4, 1],
                    rotate: [0, 10, -10, 0],
                    backgroundColor: '#26AAA3',
                    color: '#ffffff',
                    boxShadow: '0 4px 15px rgba(38, 170, 163, 0.4)'
                  } : { 
                    scale: 1, 
                    rotate: 0, 
                    backgroundColor: '#ecf0f1', 
                    color: '#2c3e50',
                    boxShadow: 'none'
                  }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {i}
                </motion.span>
              </motion.label>
            ))}
          </div>
        </motion.section>

        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
        >
          <h2>🏢 Calidad Administrativa</h2>
          {[
            { label: 'Atención y resolución de dudas', name: 'adminAttention' },
            { label: 'Claridad en comunicación (horarios, pagos, eventos)', name: 'adminCommunication' },
            { label: 'Facilidad para agendar o cambiar clases', name: 'adminScheduling' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    className={`star ${Number(formData[name as keyof typeof formData]) >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    whileTap={{ scale: 0.7 }}
                    animate={Number(formData[name as keyof typeof formData]) >= star ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 20, -20, 0]
                    } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.4 }}
        >
          <h2>👨‍🏫 Desempeño de Profesores</h2>
          {[
            { label: 'El profesor domina los temas', name: 'teacherKnowledge' },
            { label: 'El profesor explica con claridad y paciencia', name: 'teacherClarity' },
            { label: 'El profesor fomenta la participación', name: 'teacherEngagement' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    className={`star ${Number(formData[name as keyof typeof formData]) >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    whileTap={{ scale: 0.7 }}
                    animate={Number(formData[name as keyof typeof formData]) >= star ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 20, -20, 0]
                    } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
        >
          <h2>📈 Aprovechamiento Personal / Del Hijo</h2>
          {[
            { label: 'Mejora en habilidades de programación o pensamiento lógico', name: 'improvementSkills' },
            { label: 'Mayor interés en tecnología e innovación', name: 'interestTech' },
            { label: 'Utilidad de los proyectos y actividades', name: 'projectsUseful' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <motion.button
                    key={star}
                    type="button"
                    className={`star ${Number(formData[name as keyof typeof formData]) >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    whileTap={{ scale: 0.7 }}
                    animate={Number(formData[name as keyof typeof formData]) >= star ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, 20, -20, 0]
                    } : { scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    ★
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section 
          className="form-section"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, delay: 0.6 }}
        >
          <h2>💬 Comentarios</h2>
          <div className="form-group">
            <label>¿Qué es lo que más te gusta de GokuLab?</label>
            <textarea name="likes" rows={3} value={formData.likes} onChange={handleChange} placeholder="Comparte lo que más valoras..." />
          </div>
          <div className="form-group">
            <label>¿Qué recomendarías mejorar?</label>
            <textarea name="improvements" rows={3} value={formData.improvements} onChange={handleChange} placeholder="Tus sugerencias nos ayudan a crecer..." />
          </div>
          <div className="form-group">
            <label>Comentarios adicionales</label>
            <textarea name="additionalComments" rows={3} value={formData.additionalComments} onChange={handleChange} placeholder="Espacio para lo que quieras compartir..." />
          </div>
        </motion.section>

        <motion.button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(38, 170, 163, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          {loading ? '🚀 Enviando...' : '✨ Enviar Encuesta'}
        </motion.button>
      </motion.form>

      <footer className="footer">
        <p>© 2026 GokuLab · Innovación · Tecnología · Educación</p>
      </footer>
    </div>
  );
}

export default Survey;