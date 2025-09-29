import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// Función para barajar un array (Fisher-Yates shuffle)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// GET /api/lecciones/:leccionId/preguntas - Obtiene preguntas de una lección
router.get('/:leccionId/preguntas', async (req: Request, res: Response) => {
  try {
    const leccionId = parseInt(req.params.leccionId);

    if (isNaN(leccionId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID de la lección debe ser un número válido'
      });
    }

    // Verificar que la lección existe
    const leccion = await req.prisma.leccion.findUnique({
      where: { id: leccionId },
      include: {
        curso: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    if (!leccion) {
      return res.status(404).json({
        success: false,
        error: 'Lección no encontrada'
      });
    }

    // Obtener preguntas sin incluir la respuesta correcta
    const preguntas = await req.prisma.pregunta.findMany({
      where: {
        leccionId: leccionId
      },
      select: {
        id: true,
        enunciado: true,
        opciones: true
        // No incluimos respuestaCorrecta por seguridad
      }
    });

    // Barajar el orden de las preguntas
    const preguntasAleatorias = shuffleArray(preguntas);

    res.json({
      success: true,
      data: preguntasAleatorias,
      leccion: {
        id: leccion.id,
        nombre: leccion.nombre,
        curso: leccion.curso
      }
    });
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las preguntas'
    });
  }
});

export default router;