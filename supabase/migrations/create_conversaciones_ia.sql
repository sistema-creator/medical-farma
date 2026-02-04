-- Tabla para almacenar conversaciones del asistente IA
-- MEDICAL FARMA - Asistente IA para Vendedores
CREATE TABLE IF NOT EXISTS conversaciones_ia (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    mensaje_usuario TEXT NOT NULL,
    respuesta_ia TEXT NOT NULL,
    contexto JSONB DEFAULT '{}'::jsonb,
    conversation_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Índices para mejorar rendimiento
    CONSTRAINT conversaciones_ia_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
-- Índices
CREATE INDEX IF NOT EXISTS idx_conversaciones_ia_usuario_id ON conversaciones_ia(usuario_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_ia_conversation_id ON conversaciones_ia(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversaciones_ia_created_at ON conversaciones_ia(created_at DESC);
-- Comentarios
COMMENT ON TABLE conversaciones_ia IS 'Registro de conversaciones con el asistente IA para vendedores';
COMMENT ON COLUMN conversaciones_ia.usuario_id IS 'ID del vendedor que realizó la consulta';
COMMENT ON COLUMN conversaciones_ia.mensaje_usuario IS 'Pregunta o consulta del vendedor';
COMMENT ON COLUMN conversaciones_ia.respuesta_ia IS 'Respuesta generada por Gemini AI';
COMMENT ON COLUMN conversaciones_ia.contexto IS 'Contexto adicional (productos consultados, modelo usado, etc.)';
COMMENT ON COLUMN conversaciones_ia.conversation_id IS 'ID de la conversación para agrupar mensajes relacionados';
-- RLS (Row Level Security)
ALTER TABLE conversaciones_ia ENABLE ROW LEVEL SECURITY;
-- Política: Los usuarios solo pueden ver sus propias conversaciones
CREATE POLICY "Usuarios pueden ver sus propias conversaciones" ON conversaciones_ia FOR
SELECT USING (auth.uid() = usuario_id);
-- Política: Los usuarios pueden insertar sus propias conversaciones
CREATE POLICY "Usuarios pueden crear conversaciones" ON conversaciones_ia FOR
INSERT WITH CHECK (auth.uid() = usuario_id);
-- Política: Gerencia puede ver todas las conversaciones (para análisis)
CREATE POLICY "Gerencia puede ver todas las conversaciones" ON conversaciones_ia FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM usuarios
            WHERE usuarios.id = auth.uid()
                AND usuarios.rol = 'gerencia'
        )
    );
-- Vista para estadísticas de uso del asistente IA
CREATE OR REPLACE VIEW estadisticas_asistente_ia AS
SELECT DATE(created_at) as fecha,
    COUNT(*) as total_consultas,
    COUNT(DISTINCT usuario_id) as usuarios_activos,
    COUNT(DISTINCT conversation_id) as conversaciones_unicas,
    AVG(LENGTH(mensaje_usuario)) as promedio_longitud_pregunta,
    AVG(LENGTH(respuesta_ia)) as promedio_longitud_respuesta
FROM conversaciones_ia
GROUP BY DATE(created_at)
ORDER BY fecha DESC;
COMMENT ON VIEW estadisticas_asistente_ia IS 'Estadísticas diarias de uso del asistente IA';