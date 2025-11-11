-- Actualizar contraseñas de usuarios de prueba
UPDATE usuarios 
SET contrasena = '$2a$10$TU6um/SHdA2IJw8V9FWBgeOTuNbckHeuwYtVEsEnanbkL1C53FSLa'
WHERE nombre_usuario = 'admin';

UPDATE usuarios 
SET contrasena = '$2a$10$DgPWl4qzDNJsbBmHV1viRe.EFkUGmaHthqloJzIg.xhpxR9yEZdmK'
WHERE nombre_usuario = 'alumno1';

COMMIT;

-- Verificar usuarios
SELECT nombre_usuario, tipo_usuario FROM usuarios;

EXIT;
