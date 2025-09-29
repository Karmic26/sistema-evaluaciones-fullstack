import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

interface EvaluarRequest {
  preguntaId: number;
  respuesta: string;
}

// POST /api/evaluar - Evalúa una respuesta
router.post('/', async (req: Request, res: Response) => {
  try {
    const { preguntaId, respuesta }: EvaluarRequest = req.body;

    // Validar datos de entrada
    if (!preguntaId || !respuesta) {
      return res.status(400).json({
        success: false,
        error: 'Se requieren preguntaId y respuesta'
      });
    }

    if (typeof preguntaId !== 'number' || typeof respuesta !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'preguntaId debe ser un número y respuesta debe ser un string'
      });
    }

    // Buscar la pregunta
    const pregunta = await req.prisma.pregunta.findUnique({
      where: { id: preguntaId },
      select: {
        id: true,
        enunciado: true,
        respuestaCorrecta: true,
        opciones: true,
        leccion: {
          select: {
            id: true,
            nombre: true,
            curso: {
              select: {
                id: true,
                nombre: true
              }
            }
          }
        }
      }
    });

    if (!pregunta) {
      return res.status(404).json({
        success: false,
        error: 'Pregunta no encontrada'
      });
    }

    // Verificar que la respuesta esté dentro de las opciones válidas
    if (!pregunta.opciones.includes(respuesta)) {
      return res.status(400).json({
        success: false,
        error: 'La respuesta no está entre las opciones válidas'
      });
    }

    // Evaluar la respuesta
    const esCorrecta = pregunta.respuestaCorrecta.trim().toLowerCase() === respuesta.trim().toLowerCase();

    res.json({
      success: true,
      data: {
        preguntaId: pregunta.id,
        respuestaEnviada: respuesta,
        esCorrecta: esCorrecta,
        respuestaCorrecta: pregunta.respuestaCorrecta,
        pregunta: {
          enunciado: pregunta.enunciado,
          opciones: pregunta.opciones
        },
        contexto: {
          leccion: pregunta.leccion
        }
      }
    });

  } catch (error) {
    console.error('Error al evaluar respuesta:', error);
    res.status(500).json({
      success: false,
      error: 'Error al evaluar la respuesta'
    });
  }
});

export default router;