import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
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

  // 🔥 NUEVA FUNCIÓN para manejar los radios del NPS
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
      const response = await axios.post('/api/survey', formData);
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
        alert('No se pudo conectar con el servidor. ¿Está el backend corriendo en el puerto 5001?');
      } else {
        console.error('❌ Error al configurar la petición:', error.message);
        alert('Error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="success-container">
        <h2>🎉 ¡Gracias por tu respuesta!</h2>
        <p>Tu opinión nos ayuda a mejorar cada día.</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Encuesta de Satisfacción GokuLab</h1>
        <p>Tu opinión es muy importante para nosotros</p>
      </header>
      <motion.form 
        className="survey-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onSubmit={handleSubmit}
      >
        {/* Sección 1: Datos del encuestado */}
        <section className="form-section">
          <h2>Datos del Alumno</h2>
          <div className="form-group">
            <label>Nombre (opcional)</label>
            <input type="text" name="studentName" value={formData.studentName} onChange={handleChange} />
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
        </section>

        {/* Sección 2: NPS - AHORA USA handleNpsChange */}
        <section className="form-section">
          <h2>¿Recomendarías GokuLab?</h2>
          <p>Del 0 al 10, ¿qué tan probable es que recomiendes GokuLab a un amigo?</p>
          <div className="nps-group">
            {[...Array(11)].map((_, i) => (
              <label key={i} className="nps-option">
                <input
                  type="radio"
                  name="npsScore"
                  value={i}
                  checked={formData.npsScore === i}
                  onChange={() => handleNpsChange(i)}  // ← CAMBIO AQUÍ
                />
                <span>{i}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Sección 3: Calidad Administrativa */}
        <section className="form-section">
          <h2>Calidad Administrativa</h2>
          {[
            { label: 'Atención y resolución de dudas', name: 'adminAttention' },
            { label: 'Claridad en comunicación', name: 'adminCommunication' },
            { label: 'Facilidad para agendar clases', name: 'adminScheduling' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[name as keyof typeof formData] >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sección 4: Desempeño de Profesores */}
        <section className="form-section">
          <h2>Desempeño de Profesores</h2>
          {[
            { label: 'Dominio del tema', name: 'teacherKnowledge' },
            { label: 'Claridad y paciencia', name: 'teacherClarity' },
            { label: 'Fomenta la participación', name: 'teacherEngagement' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[name as keyof typeof formData] >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sección 5: Aprovechamiento */}
        <section className="form-section">
          <h2>Aprovechamiento</h2>
          {[
            { label: 'Mejora en programación/lógica', name: 'improvementSkills' },
            { label: 'Mayor interés en tecnología', name: 'interestTech' },
            { label: 'Utilidad de los proyectos', name: 'projectsUseful' },
          ].map(({ label, name }) => (
            <div key={name} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[name as keyof typeof formData] >= star ? 'active' : ''}`}
                    onClick={() => handleStarClick(name, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sección 6: Comentarios */}
        <section className="form-section">
          <h2>Comentarios</h2>
          <div className="form-group">
            <label>¿Qué te gusta más de GokuLab?</label>
            <textarea name="likes" rows={3} value={formData.likes} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>¿Qué mejorarías?</label>
            <textarea name="improvements" rows={3} value={formData.improvements} onChange={handleChange}></textarea>
          </div>
          <div className="form-group">
            <label>Comentarios adicionales</label>
            <textarea name="additionalComments" rows={3} value={formData.additionalComments} onChange={handleChange}></textarea>
          </div>
        </section>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar Encuesta'}
        </button>
      </motion.form>
    </div>
  );
}

export default App;