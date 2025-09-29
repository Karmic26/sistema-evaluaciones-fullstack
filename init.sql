-- Archivo de inicialización de PostgreSQL

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar zona horaria
SET timezone = 'UTC';

-- Mensaje de confirmación
SELECT 'Base de datos inicializada correctamente' as mensaje;