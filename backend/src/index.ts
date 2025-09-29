import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import cursosRouter from './routes/cursos';
import leccionesRouter from './routes/lecciones';
import evaluarRouter from './routes/evaluar';

// Configurar variables de entorno
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Hacer Prisma disponible en el contexto de la aplicación
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rutas
app.use('/api/cursos', cursosRouter);
app.use('/api/lecciones', leccionesRouter);
app.use('/api/evaluar', evaluarRouter);

// Manejo de errores global
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    console.log('Conectado a la base de datos');

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('🔄 Cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();