import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ApiService } from '../services/api';
import type { Pregunta, EvaluacionResponse } from '../types';
import { Loading } from '../components/Loading';

interface ContextoLeccion {
  leccion: {
    id: number;
    nombre: string;
    curso: {
      id: number;
      nombre: string;
    };
  };
}

export function EvaluacionPage() {
  const { leccionId } = useParams<{ leccionId: string }>();
  
  // Estados principales
  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [contexto, setContexto] = useState<ContextoLeccion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de la evaluación
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestaSeleccionada, setRespuestaSeleccionada] = useState<string>('');
  const [evaluando, setEvaluando] = useState(false);
  const [resultadoActual, setResultadoActual] = useState<EvaluacionResponse | null>(null);
  const [mostrandoResultado, setMostrandoResultado] = useState(false);
  
  // Estados de progreso
  const [respuestasCorrectas, setRespuestasCorrectas] = useState(0);
  const [evaluacionCompleta, setEvaluacionCompleta] = useState(false);

  useEffect(() => {
    if (leccionId) {
      cargarPreguntas(parseInt(leccionId));
    }
  }, [leccionId]);

  const cargarPreguntas = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.obtenerPreguntas(id);
      if (response.success) {
        setPreguntas(response.data);
        if (response.leccion) {
          setContexto({ leccion: response.leccion });
        }
      } else {
        setError(response.error || 'Error al cargar las preguntas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error al cargar preguntas:', err);
    } finally {
      setLoading(false);
    }
  };

  const evaluarRespuesta = async () => {
    if (!respuestaSeleccionada || !preguntas[preguntaActual]) return;

    try {
      setEvaluando(true);
      const response = await ApiService.evaluarRespuesta({
        preguntaId: preguntas[preguntaActual].id,
        respuesta: respuestaSeleccionada
      });

      if (response.success) {
        setResultadoActual(response);
        setMostrandoResultado(true);
        
        if (response.data.esCorrecta) {
          setRespuestasCorrectas(prev => prev + 1);
        }
      } else {
        setError('Error al evaluar la respuesta');
      }
    } catch (err) {
      setError('Error de conexión al evaluar');
      console.error('Error al evaluar:', err);
    } finally {
      setEvaluando(false);
    }
  };

  const siguientePregunta = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(prev => prev + 1);
      setRespuestaSeleccionada('');
      setResultadoActual(null);
      setMostrandoResultado(false);
    } else {
      setEvaluacionCompleta(true);
    }
  };

  const reiniciarEvaluacion = () => {
    setPreguntaActual(0);
    setRespuestaSeleccionada('');
    setResultadoActual(null);
    setMostrandoResultado(false);
    setRespuestasCorrectas(0);
    setEvaluacionCompleta(false);
    if (leccionId) {
      cargarPreguntas(parseInt(leccionId));
    }
  };

  if (loading) {
    return (
      <div className="container">
        <Loading message="Cargando preguntas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          <h3>Error al cargar la evaluación</h3>
          <p>{error}</p>
          <div style={{ marginTop: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => leccionId && cargarPreguntas(parseInt(leccionId))}
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

  if (preguntas.length === 0) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="card" style={{ display: 'inline-block', padding: '2rem' }}>
            <h3>No hay preguntas disponibles</h3>
            <p className="text-muted">Esta lección aún no tiene preguntas configuradas.</p>
            <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Evaluación completada
  if (evaluacionCompleta) {
    const porcentaje = Math.round((respuestasCorrectas / preguntas.length) * 100);
    const aprobado = porcentaje >= 70;

    return (
      <div className="container">
        <div className="text-center">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div className="card-header">
              <h2 className="subtitle">🎉 ¡Evaluación Completada!</h2>
            </div>
            <div className="card-body">
              <div style={{ fontSize: '3rem', margin: '1rem 0' }}>
                {aprobado ? '🏆' : '📚'}
              </div>
              
              <h3 style={{ color: aprobado ? 'var(--success-color)' : 'var(--warning-color)' }}>
                {porcentaje}% de aciertos
              </h3>
              
              <p style={{ fontSize: '1.125rem', margin: '1rem 0' }}>
                Respondiste correctamente {respuestasCorrectas} de {preguntas.length} preguntas
              </p>
              
              <div style={{ 
                padding: '1rem', 
                borderRadius: 'var(--border-radius)', 
                backgroundColor: aprobado ? '#f0fdf4' : '#fffbeb',
                border: `1px solid ${aprobado ? '#bbf7d0' : '#fcd34d'}`,
                margin: '1rem 0'
              }}>
                <p style={{ margin: 0, color: aprobado ? '#166534' : '#92400e' }}>
                  {aprobado 
                    ? '¡Excelente trabajo! Has demostrado un buen dominio del tema.' 
                    : 'Sigue practicando. La práctica hace al maestro.'}
                </p>
              </div>

              {contexto && (
                <p className="text-muted">
                  Lección: {contexto.leccion.nombre} - {contexto.leccion.curso.nombre}
                </p>
              )}
            </div>
            <div className="card-footer">
              <button 
                className="btn btn-primary" 
                onClick={reiniciarEvaluacion}
                style={{ marginRight: '1rem' }}
              >
                🔄 Intentar de nuevo
              </button>
              {contexto && (
                <Link 
                  to={`/curso/${contexto.leccion.curso.id}`} 
                  className="btn btn-secondary"
                  style={{ marginRight: '1rem' }}
                >
                  ← Otras lecciones
                </Link>
              )}
              <Link to="/" className="btn btn-secondary">
                🏠 Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const pregunta = preguntas[preguntaActual];

  return (
    <div className="container-sm">
      {/* Breadcrumb */}
      {contexto && (
        <nav style={{ marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>
            Inicio
          </Link>
          <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>→</span>
          <Link 
            to={`/curso/${contexto.leccion.curso.id}`} 
            style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
          >
            {contexto.leccion.curso.nombre}
          </Link>
          <span style={{ margin: '0 0.5rem', color: 'var(--text-secondary)' }}>→</span>
          <span>{contexto.leccion.nombre}</span>
        </nav>
      )}

      {/* Progreso */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span>Pregunta {preguntaActual + 1} de {preguntas.length}</span>
          <span>Correctas: {respuestasCorrectas}</span>
        </div>
        <div style={{ 
          width: '100%', 
          height: '0.5rem', 
          backgroundColor: 'var(--bg-secondary)', 
          borderRadius: 'var(--border-radius)',
          overflow: 'hidden'
        }}>
          <div style={{ 
            width: `${((preguntaActual + 1) / preguntas.length) * 100}%`, 
            height: '100%', 
            backgroundColor: 'var(--primary-color)',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Pregunta */}
      <div className="pregunta-card">
        <h2 style={{ marginBottom: '1.5rem', lineHeight: '1.4' }}>
          {pregunta.enunciado}
        </h2>

        {/* Opciones */}
        <div className="opciones-grid">
          {pregunta.opciones.map((opcion, index) => {
            let claseBoton = 'opcion-btn';
            
            if (mostrandoResultado && resultadoActual) {
              if (opcion === resultadoActual.data.respuestaCorrecta) {
                claseBoton += ' correcto';
              } else if (opcion === respuestaSeleccionada && !resultadoActual.data.esCorrecta) {
                claseBoton += ' incorrecto';
              }
            } else if (opcion === respuestaSeleccionada) {
              claseBoton += ' selected';
            }

            return (
              <button
                key={index}
                className={claseBoton}
                onClick={() => !mostrandoResultado && setRespuestaSeleccionada(opcion)}
                disabled={mostrandoResultado}
              >
                <strong>{String.fromCharCode(65 + index)}.</strong> {opcion}
              </button>
            );
          })}
        </div>

        {/* Resultado */}
        {mostrandoResultado && resultadoActual && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1rem',
            borderRadius: 'var(--border-radius)',
            backgroundColor: resultadoActual.data.esCorrecta ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${resultadoActual.data.esCorrecta ? '#bbf7d0' : '#fecaca'}`
          }}>
            <h4 style={{ 
              color: resultadoActual.data.esCorrecta ? '#166534' : '#b91c1c',
              marginBottom: '0.5rem'
            }}>
              {resultadoActual.data.esCorrecta ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </h4>
            {!resultadoActual.data.esCorrecta && (
              <p style={{ color: '#b91c1c', margin: 0 }}>
                La respuesta correcta era: <strong>{resultadoActual.data.respuestaCorrecta}</strong>
              </p>
            )}
          </div>
        )}

        {/* Botones */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          {!mostrandoResultado ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={evaluarRespuesta}
              disabled={!respuestaSeleccionada || evaluando}
            >
              {evaluando ? 'Evaluando...' : 'Enviar respuesta'}
            </button>
          ) : (
            <button
              className="btn btn-primary btn-lg"
              onClick={siguientePregunta}
            >
              {preguntaActual < preguntas.length - 1 ? 'Siguiente pregunta →' : 'Ver resultados finales'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}