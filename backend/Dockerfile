# Imagen base
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache openssl

# Copiar package.json y package-lock.json
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Limpiar node_modules y reinstalar solo producción
RUN rm -rf node_modules && npm install --only=production

# Crear usuario no privilegiado
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown -R nextjs:nodejs /app
USER nextjs

# Exponer puerto
EXPOSE 3000

# Comando de arranque
CMD ["npm", "start"]