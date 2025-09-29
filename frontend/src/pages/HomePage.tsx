import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiService } from '../services/api';
import type { Curso } from '../types';
import { Loading } from '../components/Loading';

export function HomePage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar estado de la API primero
      await ApiService.verificarEstado();
      
      const response = await ApiService.obtenerCursos();
      if (response.success) {
        setCursos(response.data);
      } else {
        setError(response.error || 'Error al cargar los cursos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor. Asegúrate de que la API esté ejecutándose.');
      console.error('Error al cargar cursos:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading message="Cargando cursos disponibles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error al cargar los cursos</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={cargarCursos}
            style={{ marginTop: '1rem' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <h1 className="title">🎓 Bienvenido al Sistema de Evaluaciones</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>
          Selecciona un curso para comenzar tu evaluación
        </p>
      </div>

      {cursos.length === 0 ? (
        <div className="text-center">
          <p className="text-muted">No hay cursos disponibles en este momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-cols-2 grid-cols-3">
          {cursos.map((curso) => (
            <Link
              key={curso.id}
              to={`/curso/${curso.id}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card-header">
                <h3 className="subtitle">{curso.nombre}</h3>
              </div>
              <div className="card-body">
                <p className="text-muted">{curso.descripcion}</p>
              </div>
              <div className="card-footer">
                <span className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  Ver lecciones →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center" style={{ marginTop: '3rem' }}>
        <div className="card" style={{ display: 'inline-block', maxWidth: '600px', textAlign: 'left' }}>
          <div className="card-header">
            <h3 className="subtitle">📋 Instrucciones</h3>
          </div>
          <div className="card-body">
            <ol style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li>Selecciona un curso de tu interés</li>
              <li>Elige una lección para practicar</li>
              <li>Responde las preguntas una por una</li>
              <li>Recibe retroalimentación inmediata</li>
              <li>Mejora tu conocimiento paso a paso</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}