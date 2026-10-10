-- CulturaMétrica: Schema para Supabase (PostgreSQL)
-- Ejecutar en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS guias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo TEXT NOT NULL,
    tema TEXT NOT NULL,
    edad INTEGER NOT NULL CHECK (edad BETWEEN 6 AND 18),
    duracion INTEGER NOT NULL CHECK (duracion BETWEEN 5 AND 120),
    objetivo TEXT NOT NULL,
    contenido JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS actividades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    guia_id UUID REFERENCES guias(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    estado TEXT DEFAULT 'activa' CHECK (estado IN ('activa', 'finalizada', 'borrador')),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reflexiones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actividad_id UUID REFERENCES actividades(id) ON DELETE CASCADE,
    estudiante_id TEXT NOT NULL,
    texto TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS metricas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reflexion_id UUID REFERENCES reflexiones(id) ON DELETE CASCADE,
    indicadores JSONB NOT NULL,
    resumen TEXT,
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_actividades_guia ON actividades(guia_id);
CREATE INDEX IF NOT EXISTS idx_reflexiones_actividad ON reflexiones(actividad_id);
CREATE INDEX IF NOT EXISTS idx_metricas_reflexion ON metricas(reflexion_id);
