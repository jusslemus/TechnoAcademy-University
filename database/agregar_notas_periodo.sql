-- ============================================
-- AGREGAR COLUMNAS PARA NOTAS POR PERÍODO
-- ============================================
-- Este script agrega las columnas nota_p1, nota_p2, nota_p3, nota_p4
-- a la tabla inscripciones para soportar calificaciones por período

-- Verificar si las columnas ya existen
-- En Oracle, puedes verificar con:
-- SELECT column_name FROM user_tab_columns WHERE table_name = 'INSCRIPCIONES';

-- Agregar columnas para notas por período
ALTER TABLE inscripciones ADD (
  nota_p1 NUMBER(4,2),
  nota_p2 NUMBER(4,2),
  nota_p3 NUMBER(4,2),
  nota_p4 NUMBER(4,2)
);

-- Agregar constraints de validación (opcional pero recomendado)
ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p1_rango 
  CHECK (nota_p1 IS NULL OR (nota_p1 >= 0 AND nota_p1 <= 10));

ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p2_rango 
  CHECK (nota_p2 IS NULL OR (nota_p2 >= 0 AND nota_p2 <= 10));

ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p3_rango 
  CHECK (nota_p3 IS NULL OR (nota_p3 >= 0 AND nota_p3 <= 10));

ALTER TABLE inscripciones ADD CONSTRAINT ck_nota_p4_rango 
  CHECK (nota_p4 IS NULL OR (nota_p4 >= 0 AND nota_p4 <= 10));

-- Verificar que las columnas se agregaron correctamente
DESC inscripciones;

-- Mensaje de éxito
SELECT 'Columnas de notas por período agregadas exitosamente' as RESULTADO FROM dual;

COMMIT;
