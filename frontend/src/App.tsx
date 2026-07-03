import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Survey from './components/Survey';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        {/* Barra de navegación */}
        <nav className="main-nav">
          <Link to="/" className="nav-link">📝 Encuesta</Link>
          <Link to="/dashboard" className="nav-link">📊 Dashboard</Link>
        </nav>

        {/* Rutas */}
        <Routes>
          <Route path="/" element={<Survey />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;