import React from 'react';

const CommentsAnalysis: React.FC = () => {
  return (
    <div style={{ 
      padding: '2rem', 
      background: '#f0f0f0', 
      margin: '2rem 0',
      borderRadius: '12px',
      border: '2px solid #26AAA3'
    }}>
      <h3 style={{ color: '#D61A1F' }}>📝 Análisis de Comentarios (TEST)</h3>
      <p>Si ves esto, el componente <strong>CommentsAnalysis</strong> se está montando correctamente.</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Este es un componente de prueba. Luego agregaremos la nube de palabras.</p>
    </div>
  );
};

export default CommentsAnalysis;