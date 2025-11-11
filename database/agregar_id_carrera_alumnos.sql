-- =====================================================
-- AGREGAR ID_CARRERA A TABLA ALUMNOS
-- Este script agrega la columna id_carrera como FK
-- =====================================================

-- 1. Agregar la columna id_carrera (puede ser NULL para alumnos existentes)
ALTER TABLE alumnos 
ADD (id_carrera NUMBER);

-- 2. Crear el constraint de FK hacia CARRERAS
ALTER TABLE alumnos 
ADD CONSTRAINT fk_alumnos_carrera 
FOREIGN KEY (id_carrera) 
REFERENCES carreras(id_carrera);

-- 3. Crear índice para mejorar performance
CREATE INDEX idx_alumnos_carrera ON alumnos(id_carrera);

-- 4. Mostrar la estructura actualizada
DESC alumnos;

-- NOTA: El campo CARRERA (texto) se mantiene por compatibilidad
-- Puedes eliminarlo después si lo deseas con:
-- ALTER TABLE alumnos DROP COLUMN carrera;

SELECT 'Columna ID_CARRERA agregada exitosamente a ALUMNOS' AS resultado FROM dual;
