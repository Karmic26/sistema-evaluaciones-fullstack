import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.pregunta.deleteMany();
  await prisma.leccion.deleteMany();
  await prisma.curso.deleteMany();

  // Crear cursos
  const cursoJS = await prisma.curso.create({
    data: {
      nombre: 'JavaScript Fundamentals',
      descripcion: 'Aprende los conceptos fundamentales de JavaScript desde cero'
    }
  });

  const cursoReact = await prisma.curso.create({
    data: {
      nombre: 'React.js',
      descripcion: 'Desarrollo de aplicaciones web modernas con React.js'
    }
  });

  const cursoNode = await prisma.curso.create({
    data: {
      nombre: 'Node.js Backend',
      descripcion: 'Desarrollo de APIs y servicios backend con Node.js'
    }
  });

  // Crear lecciones para JavaScript
  const leccionVariables = await prisma.leccion.create({
    data: {
      nombre: 'Variables y Tipos de Datos',
      cursoId: cursoJS.id
    }
  });

  const leccionFunciones = await prisma.leccion.create({
    data: {
      nombre: 'Funciones',
      cursoId: cursoJS.id
    }
  });

  // Crear lecciones para React
  const leccionComponentes = await prisma.leccion.create({
    data: {
      nombre: 'Componentes',
      cursoId: cursoReact.id
    }
  });

  const leccionHooks = await prisma.leccion.create({
    data: {
      nombre: 'Hooks',
      cursoId: cursoReact.id
    }
  });

  // Crear lecciones para Node.js
  const leccionExpress = await prisma.leccion.create({
    data: {
      nombre: 'Express.js',
      cursoId: cursoNode.id
    }
  });

  // Crear preguntas para Variables y Tipos de Datos
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál de las siguientes es la forma correcta de declarar una variable en JavaScript?',
        opciones: ['var nombre = "Juan";', 'variable nombre = "Juan";', 'string nombre = "Juan";', 'declare nombre = "Juan";'],
        respuestaCorrecta: 'var nombre = "Juan";',
        leccionId: leccionVariables.id
      },
      {
        enunciado: '¿Qué tipo de dato retorna typeof null en JavaScript?',
        opciones: ['null', 'undefined', 'object', 'string'],
        respuestaCorrecta: 'object',
        leccionId: leccionVariables.id
      },
      {
        enunciado: '¿Cuál es la diferencia principal entre let y var?',
        opciones: ['No hay diferencia', 'let tiene scope de bloque', 'var es más rápido', 'let no puede ser reasignado'],
        respuestaCorrecta: 'let tiene scope de bloque',
        leccionId: leccionVariables.id
      }
    ]
  });

  // Crear preguntas para Funciones
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál es la sintaxis correcta para una función flecha?',
        opciones: ['const suma = (a, b) => a + b', 'const suma = (a, b) -> a + b', 'const suma = (a, b) { a + b }', 'const suma = function(a, b) => a + b'],
        respuestaCorrecta: 'const suma = (a, b) => a + b',
        leccionId: leccionFunciones.id
      },
      {
        enunciado: '¿Qué es el hoisting en JavaScript?',
        opciones: ['Un error de sintaxis', 'El comportamiento de mover declaraciones al inicio', 'Una función built-in', 'Un tipo de variable'],
        respuestaCorrecta: 'El comportamiento de mover declaraciones al inicio',
        leccionId: leccionFunciones.id
      }
    ]
  });

  // Crear preguntas para Componentes de React
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál es la forma correcta de crear un componente funcional en React?',
        opciones: ['function MiComponente() { return <div>Hola</div>; }', 'const MiComponente = <div>Hola</div>', 'MiComponente = function() { <div>Hola</div> }', 'component MiComponente() { return <div>Hola</div>; }'],
        respuestaCorrecta: 'function MiComponente() { return <div>Hola</div>; }',
        leccionId: leccionComponentes.id
      },
      {
        enunciado: '¿Qué son las props en React?',
        opciones: ['Propiedades que se pasan a los componentes', 'Funciones especiales', 'Estados internos del componente', 'Métodos del componente'],
        respuestaCorrecta: 'Propiedades que se pasan a los componentes',
        leccionId: leccionComponentes.id
      }
    ]
  });

  // Crear preguntas para Hooks
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál es el hook más básico para manejar estado en React?',
        opciones: ['useState', 'useEffect', 'useContext', 'useReducer'],
        respuestaCorrecta: 'useState',
        leccionId: leccionHooks.id
      },
      {
        enunciado: '¿Cuándo se ejecuta useEffect sin dependencias?',
        opciones: ['Solo al montar el componente', 'En cada render', 'Solo al desmontar', 'Nunca'],
        respuestaCorrecta: 'En cada render',
        leccionId: leccionHooks.id
      }
    ]
  });

  // Crear preguntas para Express.js
  await prisma.pregunta.createMany({
    data: [
      {
        enunciado: '¿Cuál es la forma correcta de crear una ruta GET en Express?',
        opciones: ['app.get("/ruta", handler)', 'app.route("/ruta", "GET", handler)', 'app.GET("/ruta", handler)', 'express.get("/ruta", handler)'],
        respuestaCorrecta: 'app.get("/ruta", handler)',
        leccionId: leccionExpress.id
      },
      {
        enunciado: '¿Qué middleware se usa comúnmente para parsear JSON en Express?',
        opciones: ['express.json()', 'body-parser.json()', 'express.parse()', 'json-middleware()'],
        respuestaCorrecta: 'express.json()',
        leccionId: leccionExpress.id
      }
    ]
  });

  console.log('Seed completado exitosamente');
  console.log(`Cursos creados: ${[cursoJS, cursoReact, cursoNode].length}`);
  
  // Contar lecciones y preguntas
  const totalLecciones = await prisma.leccion.count();
  const totalPreguntas = await prisma.pregunta.count();
  
  console.log(`Lecciones creadas: ${totalLecciones}`);
  console.log(`Preguntas creadas: ${totalPreguntas}`);
}

main()
  .catch((e) => {
    console.error('Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });