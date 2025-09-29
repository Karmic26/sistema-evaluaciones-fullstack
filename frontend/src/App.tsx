import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CursoPage } from './pages/CursoPage';
import { EvaluacionPage } from './pages/EvaluacionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/curso/:cursoId" element={<CursoPage />} />
            <Route path="/evaluacion/:leccionId" element={<EvaluacionPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>Prueba Técnica Fullstack</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

// Componente 404
function NotFound() {
  return (
    <div className="container">
      <div className="text-center">
        <div className="card" style={{ display: 'inline-block', padding: '3rem' }}>
          <h1 style={{ fontSize: '4rem', margin: '0 0 1rem 0' }}>🔍</h1>
          <h2 className="subtitle">Página no encontrada</h2>
          <p className="text-muted" style={{ marginBottom: '2rem' }}>
            La página que buscas no existe o fue movida.
          </p>
          <a href="/" className="btn btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;