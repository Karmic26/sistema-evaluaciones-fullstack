import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import type { Leccion } from '../types';
import { Loading } from '../components/Loading';

export function CursoPage() {
  const { cursoId } = useParams<{ cursoId: string }>();
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nombreCurso, setNombreCurso] = useState<string>('');

  useEffect(() => {
    if (cursoId) {
      cargarLecciones(parseInt(cursoId));
    }
  }, [cursoId]);

  const cargarLecciones = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.obtenerLecciones(id);
      if (response.success) {
        setLecciones(response.data);
        if (response.curso) {
          setNombreCurso(response.curso.nombre);
        }
      } else {
        setError(response.error || 'Error al cargar las lecciones');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error al cargar lecciones:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading message="Cargando lecciones del curso..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error al cargar las lecciones</h3>
          <p>{error}</p>
          <div style={{ marginTop: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => cursoId && cargarLecciones(parseInt(cursoId))}
              style={{ marginRight: '1rem' }}
            >
              Reintentar
            </button>
            <Link to="/" className="btn btn-secondary">
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Breadcrumb */}
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
          Inicio
        </Link>
        <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>→</span>
        <span>{nombreCurso}</span>
      </nav>

      <div className="text-center" style={{ marginBottom: '3rem' }}>
        <h1 className="title">📚 {nombreCurso}</h1>
        <p className="text-muted" style={{ fontSize: '1.125rem' }}>
          Selecciona una lección para comenzar la evaluación
        </p>
      </div>

      {lecciones.length === 0 ? (
        <div className="text-center">
          <div className="card" style={{ display: 'inline-block', padding: '2rem' }}>
            <p className="text-muted">No hay lecciones disponibles para este curso.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 grid-cols-2">
          {lecciones.map((leccion, index) => (
            <Link
              key={leccion.id}
              to={`/evaluacion/${leccion.id}`}
              className="card"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </div>
                  <h3 className="subtitle" style={{ margin: 0 }}>{leccion.nombre}</h3>
                </div>
              </div>
              <div className="card-body">
                <p className="text-muted">
                  Pon a prueba tus conocimientos sobre {leccion.nombre.toLowerCase()}
                </p>
              </div>
              <div className="card-footer">
                <span className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                  Comenzar evaluación →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center" style={{ marginTop: '3rem' }}>
        <Link to="/" className="btn btn-secondary">
          ← Volver a todos los cursos
        </Link>
      </div>
    </div>
  );
}