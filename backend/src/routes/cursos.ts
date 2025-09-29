import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// GET /api/cursos - Obtiene todos los cursos
router.get('/', async (req: Request, res: Response) => {
  try {
    const cursos = await req.prisma.curso.findMany({
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      success: true,
      data: cursos
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los cursos'
    });
  }
});

// GET /api/cursos/:cursoId/lecciones - Obtiene lecciones de un curso
router.get('/:cursoId/lecciones', async (req: Request, res: Response) => {
  try {
    const cursoId = parseInt(req.params.cursoId);

    if (isNaN(cursoId)) {
      return res.status(400).json({
        success: false,
        error: 'El ID del curso debe ser un número válido'
      });
    }

    // Verificar que el curso existe
    const curso = await req.prisma.curso.findUnique({
      where: { id: cursoId }
    });

    if (!curso) {
      return res.status(404).json({
        success: false,
        error: 'Curso no encontrado'
      });
    }

    const lecciones = await req.prisma.leccion.findMany({
      where: {
        cursoId: cursoId
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json({
      success: true,
      data: lecciones,
      curso: {
        id: curso.id,
        nombre: curso.nombre
      }
    });
  } catch (error) {
    console.error('Error al obtener lecciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener las lecciones'
    });
  }
});

export default router;