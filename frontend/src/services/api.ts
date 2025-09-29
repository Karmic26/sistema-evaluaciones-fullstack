import axios from 'axios';
import type {
  CursosResponse,
  LeccionesResponse,
  PreguntasResponse,
  EvaluacionRequest,
  EvaluacionResponse
} from '../types';

// Configuración base de axios
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export class ApiService {
  // Get todos los cursos
  static async obtenerCursos(): Promise<CursosResponse> {
    try {
      const response = await api.get<CursosResponse>('/cursos');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los cursos');
    }
  }

  // get lecciones de un curso
  static async obtenerLecciones(cursoId: number): Promise<LeccionesResponse> {
    try {
      const response = await api.get<LeccionesResponse>(`/cursos/${cursoId}/lecciones`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las lecciones');
    }
  }

  // Grt preguntas de una lección
  static async obtenerPreguntas(leccionId: number): Promise<PreguntasResponse> {
    try {
      const response = await api.get<PreguntasResponse>(`/lecciones/${leccionId}/preguntas`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las preguntas');
    }
  }

  // evaluar una respuesta
  static async evaluarRespuesta(evaluacion: EvaluacionRequest): Promise<EvaluacionResponse> {
    try {
      const response = await api.post<EvaluacionResponse>('/evaluar', evaluacion);
      return response.data;
    } catch (error) {
      throw new Error('Error al evaluar la respuesta');
    }
  }

  // Verificar estado de la API 
  // (No influye en la prueba, esta funcion es solo para validcion del estadp del server)
static async verificarEstado(): Promise<{ status: string; timestamp: string }> {
  try {
    const response = await axios.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('API no disponible');
  }
}
}