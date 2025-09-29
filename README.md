# 📚 Sistema de Evaluaciones - Prueba Técnica Fullstack

Sistema completo de gestión de evaluaciones desarrollado con Node.js + TypeScript, React, PostgreSQL y Docker.

## 🎯 Características

- ✅ **Backend RESTful** con Node.js, Express y TypeScript
- ✅ **Frontend interactivo** con React, TypeScript y Vite
- ✅ **Base de datos** PostgreSQL con Prisma ORM
- ✅ **Dockerización completa** con docker-compose
- ✅ **Evaluaciones dinámicas** con preguntas aleatorias
- ✅ **Retroalimentación inmediata** al responder
- ✅ **Interfaz responsive** y moderna
- ✅ **Navegación intuitiva** con breadcrumbs

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│   Frontend      │─────▶│   Backend API   │─────▶│   PostgreSQL    │
│   React + Vite  │      │   Node.js +     │      │   Database      │
│   Port: 80      │      │   Express       │      │   Port: 5432    │
│                 │      │   Port: 3000    │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

### Stack Tecnológico

**Backend:**
- Node.js 18
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL 15

**Frontend:**
- React 18
- TypeScript
- Vite
- React Router DOM
- Axios

**DevOps:**
- Docker & Docker Compose
- Nginx (para servir el frontend)
- Adminer (administración de BD)

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Docker Desktop instalado y corriendo
- Git (opcional, para clonar el repositorio)

### Opción 1: Ejecución con Docker (Recomendado)

1. **Clonar o descargar el proyecto:**
```bash
git clone <url-del-repositorio>
cd sistema-evaluaciones
```

2. **Iniciar todos los servicios:**
```bash
docker-compose up --build
```

3. **Acceder a la aplicación:**
- **Frontend**: http://localhost
- **API Backend**: http://localhost:3001
- **Adminer (BD)**: http://localhost:8080

4. **Credenciales de la base de datos (para Adminer):**
   - Sistema: PostgreSQL
   - Servidor: `postgres`
   - Usuario: `evaluaciones_user`
   - Contraseña: `evaluaciones_pass`
   - Base de datos: `evaluaciones_db`

### Opción 2: Desarrollo Local (sin Docker)

**Backend:**
```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📡 Endpoints de la API

### Cursos
```http
GET /api/cursos
```
Obtiene la lista de todos los cursos disponibles.

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "JavaScript Fundamentals",
      "descripcion": "Aprende los conceptos fundamentales...",
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  ]
}
```

### Lecciones
```http
GET /api/cursos/:cursoId/lecciones
```
Obtiene todas las lecciones de un curso específico.

### Preguntas
```http
GET /api/lecciones/:leccionId/preguntas
```
Obtiene las preguntas de una lección (en orden aleatorio).

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "enunciado": "¿Cuál es...?",
      "opciones": ["Opción A", "Opción B", "Opción C", "Opción D"]
    }
  ],
  "leccion": {
    "id": 1,
    "nombre": "Variables y Tipos de Datos",
    "curso": { "id": 1, "nombre": "JavaScript Fundamentals" }
  }
}
```

### Evaluación
```http
POST /api/evaluar
Content-Type: application/json

{
  "preguntaId": 1,
  "respuesta": "Opción A"
}
```

Evalúa una respuesta y retorna si fue correcta o incorrecta.

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "preguntaId": 1,
    "respuestaEnviada": "Opción A",
    "esCorrecta": true,
    "respuestaCorrecta": "Opción A",
    "pregunta": {
      "enunciado": "¿Cuál es...?",
      "opciones": ["..."]
    },
    "contexto": { "leccion": {...} }
  }
}
```

### Health Check
```http
GET /health
```
Verifica el estado de la API.

## 🗄️ Modelo de Datos

```prisma
model Curso {
  id          Int       @id @default(autoincrement())
  nombre      String
  descripcion String
  lecciones   Leccion[]
}

model Leccion {
  id        Int        @id @default(autoincrement())
  nombre    String
  cursoId   Int
  curso     Curso      @relation(fields: [cursoId])
  preguntas Pregunta[]
}

model Pregunta {
  id                Int     @id @default(autoincrement())
  enunciado         String
  opciones          String[]
  respuestaCorrecta String
  leccionId         Int
  leccion           Leccion @relation(fields: [leccionId])
}
```

## 🧪 Datos de Prueba

El sistema incluye datos de prueba creados automáticamente:

- **3 cursos**: JavaScript Fundamentals, React.js, Node.js Backend
- **5 lecciones** distribuidas entre los cursos
- **15+ preguntas** de ejemplo

## 🎮 Uso de la Aplicación

1. **Página de inicio**: Visualiza todos los cursos disponibles
2. **Selecciona un curso**: Ve las lecciones disponibles
3. **Inicia una evaluación**: Comienza a responder preguntas
4. **Recibe retroalimentación**: Obtén feedback inmediato
5. **Revisa resultados**: Visualiza tu puntuación final

## 🐳 Comandos Docker Útiles

```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Reconstruir las imágenes
docker-compose up --build

# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f api

# Ver logs solo del frontend
docker-compose logs -f frontend

# Parar todos los servicios
docker-compose down

# Parar y eliminar volúmenes (resetear BD)
docker-compose down -v

# Ver estado de los contenedores
docker-compose ps

# Ejecutar comandos dentro del contenedor
docker-compose exec api sh
docker-compose exec postgres psql -U evaluaciones_user -d evaluaciones_db
```

## 📁 Estructura del Proyecto

```
sistema-evaluaciones/
├── backend/
│   ├── src/
│   │   ├── routes/          # Rutas de la API
│   │   │   ├── cursos.ts
│   │   │   ├── lecciones.ts
│   │   │   └── evaluar.ts
│   │   ├── types/           # Definiciones TypeScript
│   │   ├── index.ts         # Punto de entrada
│   │   └── seed.ts          # Datos de prueba
│   ├── prisma/
│   │   └── schema.prisma    # Esquema de BD
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   │   ├── Header.tsx
│   │   │   └── Loading.tsx
│   │   ├── pages/           # Páginas principales
│   │   │   ├── HomePage.tsx
│   │   │   ├── CursoPage.tsx
│   │   │   └── EvaluacionPage.tsx
│   │   ├── services/        # Servicios API
│   │   │   └── api.ts
│   │   ├── types/           # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── App.css
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
├── .dockerignore
└── README.md
```

## 🔒 Seguridad

- ✅ Las respuestas correctas NO se exponen en el endpoint de preguntas
- ✅ Validación de entrada en todos los endpoints
- ✅ Manejo seguro de errores sin exponer detalles internos
- ✅ Usuario no privilegiado en contenedores Docker
- ✅ CORS configurado correctamente

## 🧹 Mantenimiento

### Limpiar todo Docker
```bash
# Detener y eliminar todo
docker-compose down -v

# Limpiar imágenes no usadas
docker system prune -a

# Limpiar volúmenes
docker volume prune
```

### Regenerar datos de prueba
```bash
docker-compose exec api npx ts-node src/seed.ts
```

### Actualizar dependencias
```bash
# Backend
cd backend && npm update

# Frontend
cd frontend && npm update
```

## 🐛 Troubleshooting

### El frontend no carga
- Verifica que el backend esté corriendo: `docker-compose logs api`
- Asegúrate de que no haya errores de CORS
- Revisa la consola del navegador (F12)

### Error de conexión a la base de datos
- Verifica que PostgreSQL esté corriendo: `docker-compose ps`
- Revisa los logs: `docker-compose logs postgres`
- Resetea la base de datos: `docker-compose down -v && docker-compose up --build`

### Puerto ya en uso
- Cambia los puertos en `docker-compose.yml`
- Verifica qué está usando el puerto: `netstat -ano | findstr :80`

## 📊 Pruebas con Postman

Importa la colección `postman_collection.json` incluida en el repositorio para probar todos los endpoints de la API.

## 👨‍💻 Desarrollo

### Agregar nuevos cursos/lecciones
Edita el archivo `backend/src/seed.ts` y ejecuta:
```bash
docker-compose exec api npx ts-node src/seed.ts
```

### Modificar el esquema de BD
1. Edita `backend/prisma/schema.prisma`
2. Ejecuta: `docker-compose exec api npx prisma db push`

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica.

## 🤝 Contacto

Para consultas o sugerencias sobre este proyecto, por favor abre un issue en el repositorio.

---

**Desarrollado con ❤️ usando React, Node.js, TypeScript y Docker**