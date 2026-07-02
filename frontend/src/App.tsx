import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

interface FormData {
  studentName: string;
  studentAgeRange: string;
  respondentType: string;
  npsScore: number;
  adminAttention: number;
  adminCommunication: number;
  adminScheduling: number;
  teacherKnowledge: number;
  teacherClarity: number;
  teacherEngagement: number;
  improvementSkills: number;
  interestTech: number;
  projectsUseful: number;
  likes: string;
  improvements: string;
  additionalComments: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === 'radio' ? parseInt(value) : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleRating = (field: keyof FormData, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/survey', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error al enviar encuesta:', error);
      alert('Hubo un error al enviar la encuesta. Por favor, intenta de nuevo.');
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
            <label>Nombre del alumno (opcional)</label>
            <input
              type="text"
              name="studentName"
              value={formData.studentName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Rango de edad del alumno</label>
            <select
              name="studentAgeRange"
              value={formData.studentAgeRange}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="4-6">4-6 años</option>
              <option value="7-9">7-9 años</option>
              <option value="10-12">10-12 años</option>
              <option value="13-15">13-15 años</option>
              <option value="16+">16 años o más</option>
            </select>
          </div>
          <div className="form-group">
            <label>Eres...</label>
            <select
              name="respondentType"
              value={formData.respondentType}
              onChange={handleChange}
            >
              <option value="">Selecciona...</option>
              <option value="padre">Padre / Madre</option>
              <option value="alumno">Alumno</option>
            </select>
          </div>
        </section>

        {/* Sección 2: NPS */}
        <section className="form-section">
          <h2>¿Recomendarías GokuLab?</h2>
          <p>En una escala del 0 al 10, ¿qué tan probable es que recomiendes GokuLab a un amigo o familiar?</p>
          <div className="nps-group">
            {[...Array(11)].map((_, i) => (
              <label key={i} className="nps-option">
                <input
                  type="radio"
                  name="npsScore"
                  value={i}
                  checked={formData.npsScore === i}
                  onChange={handleChange}
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
            { label: 'Atención y resolución de dudas', field: 'adminAttention' },
            { label: 'Claridad en la comunicación (horarios, pagos, eventos)', field: 'adminCommunication' },
            { label: 'Facilidad para agendar o cambiar clases', field: 'adminScheduling' },
          ].map(({ label, field }) => (
            <div key={field} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[field as keyof FormData] >= star ? 'active' : ''}`}
                    onClick={() => handleRating(field as keyof FormData, star)}
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
            { label: 'El profesor domina los temas', field: 'teacherKnowledge' },
            { label: 'El profesor explica con claridad y paciencia', field: 'teacherClarity' },
            { label: 'El profesor fomenta la participación', field: 'teacherEngagement' },
          ].map(({ label, field }) => (
            <div key={field} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[field as keyof FormData] >= star ? 'active' : ''}`}
                    onClick={() => handleRating(field as keyof FormData, star)}
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
          <h2>Aprovechamiento Personal / Del Hijo</h2>
          {[
            { label: 'Mejora en habilidades de programación o pensamiento lógico', field: 'improvementSkills' },
            { label: 'Mayor interés en tecnología e innovación', field: 'interestTech' },
            { label: 'Utilidad de los proyectos y actividades', field: 'projectsUseful' },
          ].map(({ label, field }) => (
            <div key={field} className="rating-group">
              <label>{label}</label>
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star ${formData[field as keyof FormData] >= star ? 'active' : ''}`}
                    onClick={() => handleRating(field as keyof FormData, star)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Sección 6: Comentarios abiertos */}
        <section className="form-section">
          <h2>Comentarios</h2>
          <div className="form-group">
            <label>¿Qué es lo que más te gusta de GokuLab?</label>
            <textarea
              name="likes"
              rows={3}
              value={formData.likes}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>¿Qué recomendarías mejorar?</label>
            <textarea
              name="improvements"
              rows={3}
              value={formData.improvements}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Comentarios adicionales</label>
            <textarea
              name="additionalComments"
              rows={3}
              value={formData.additionalComments}
              onChange={handleChange}
            />
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