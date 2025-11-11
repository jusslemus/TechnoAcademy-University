-- Insertar período de prueba
INSERT INTO periodos_academicos (codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin, estado) 
VALUES ('2024-I', 'Periodo 2024-I', TO_DATE('2024-01-15', 'YYYY-MM-DD'), TO_DATE('2024-05-31', 'YYYY-MM-DD'), 'ACTIVO');

COMMIT;

-- Verificar
SELECT id_periodo, nombre_periodo, estado FROM periodos_academicos;

EXIT;
