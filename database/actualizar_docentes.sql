-- =====================================================
-- ACTUALIZAR SCHEMA PARA INCLUIR DOCENTES EN USUARIOS
-- =====================================================

-- 1. Modificar CHECK constraint de usuarios para incluir DOCENTE
ALTER TABLE usuarios DROP CONSTRAINT SYS_C008355;

ALTER TABLE usuarios ADD CONSTRAINT chk_tipo_usuario 
  CHECK (tipo_usuario IN ('ADMIN', 'ALUMNO', 'DOCENTE'));

-- 2. Agregar columna id_usuario a DOCENTES
ALTER TABLE docentes ADD id_usuario NUMBER;

-- 3. Crear constraint UNIQUE para id_usuario en docentes
ALTER TABLE docentes ADD CONSTRAINT uk_docente_usuario UNIQUE (id_usuario);

-- 4. Agregar FOREIGN KEY
ALTER TABLE docentes ADD CONSTRAINT fk_docente_usuario 
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE;

-- 5. Crear índice para mejor performance
CREATE INDEX idx_docentes_usuario ON docentes(id_usuario);

COMMIT;

-- Verificar cambios
SELECT constraint_name, constraint_type, search_condition 
FROM user_constraints 
WHERE table_name = 'USUARIOS';

DESCRIBE docentes;

SELECT COUNT(*) as total_usuarios FROM usuarios;
SELECT COUNT(*) as total_docentes FROM docentes;
