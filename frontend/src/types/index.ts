// Tipos de la API
export interface Curso {
  id: number;
  nombre: string;
  descripcion: string;
  createdAt: string;
  updatedAt: string;
}

export interface Leccion {
  id: number;
  nombre: string;
  cursoId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pregunta {
  id: number;
  enunciado: string;
  opciones: string[];
  // La respuesta correcta NO se incluye por seguridad y para evitar que el 
  // user sea capaz de visualizar la respuesta desde el "inspeccionar" del navegador
}

export interface EvaluacionRequest {
  preguntaId: number;
  respuesta: string;
}

export interface EvaluacionResponse {
  success: boolean;
  data: {
    preguntaId: number;
    respuestaEnviada: string;
    esCorrecta: boolean;
    respuestaCorrecta: string;
    pregunta: {
      enunciado: string;
      opciones: string[];
    };
    contexto: {
      leccion: {
        id: number;
        nombre: string;
        curso: {
          id: number;
          nombre: string;
        };
      };
    };
  };
}

// Respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface CursosResponse extends ApiResponse<Curso[]> {}

export interface LeccionesResponse extends ApiResponse<Leccion[]> {
  curso?: {
    id: number;
    nombre: string;
  };
}

export interface PreguntasResponse extends ApiResponse<Pregunta[]> {
  leccion?: {
    id: number;
    nombre: string;
    curso: {
      id: number;
      nombre: string;
    };
  };
}

// Estados de la aplicación
export interface EstadoEvaluacion {
  preguntaActual: number;
  respuestasCorrectas: number;
  totalPreguntas: number;
  finalizada: boolean;
}