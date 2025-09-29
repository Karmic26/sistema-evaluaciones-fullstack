-- CreateTable
CREATE TABLE "public"."cursos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cursos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."lecciones" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lecciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preguntas" (
    "id" SERIAL NOT NULL,
    "enunciado" TEXT NOT NULL,
    "opciones" TEXT[],
    "respuestaCorrecta" TEXT NOT NULL,
    "leccionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "preguntas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."lecciones" ADD CONSTRAINT "lecciones_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "public"."cursos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."preguntas" ADD CONSTRAINT "preguntas_leccionId_fkey" FOREIGN KEY ("leccionId") REFERENCES "public"."lecciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
