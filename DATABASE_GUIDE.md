# 📊 Guía de Base de Datos - TechnoAcademy University

## 🗄️ Tablas Utilizadas en el Sistema

Este documento describe **SOLO** las tablas que el sistema TechnoAcademy realmente utiliza y cómo consultarlas en Oracle.

---

## 📋 Tablas Activas del Sistema

### 1. **USUARIOS** 👤
**Propósito:** Almacena las credenciales de acceso al sistema

**Columnas utilizadas:**
- `ID_USUARIO` - Identificador único
- `NOMBRE_USUARIO` - Usuario para login
- `CONTRASENA` - Contraseña (hasheada)
- `TIPO_USUARIO` - Tipo: ADMIN, ALUMNO, DOCENTE
- `ESTADO` - ACTIVO/INACTIVO
- `FECHA_CREACION` - Fecha de registro
- `ULTIMO_ACCESO` - Última vez que inició sesión

**Consultar en Oracle:**
```sql
-- Ver todos los usuarios
SELECT id_usuario, nombre_usuario, tipo_usuario, estado 
FROM usuarios;

-- Ver solo usuarios activos
SELECT * FROM usuarios WHERE estado = 'ACTIVO';

-- Contar usuarios por tipo
SELECT tipo_usuario, COUNT(*) as total 
FROM usuarios 
GROUP BY tipo_usuario;
```

---

### 2. **ALUMNOS** 🎓
**Propósito:** Información personal y académica de los estudiantes

**Columnas utilizadas:**
- `ID_ALUMNO` - Identificador único
- `ID_USUARIO` - Relación con tabla USUARIOS
- `CARNET` - Código único del alumno
- `NOMBRES` - Nombres del alumno
- `APELLIDOS` - Apellidos del alumno
- `EMAIL` - Correo electrónico
- `TELEFONO` - Número de contacto
- `FECHA_NACIMIENTO` - Fecha de nacimiento
- `DIRECCION` - Dirección completa
- `ID_CARRERA` - Relación con tabla CARRERAS
- `ESTADO` - ACTIVO/INACTIVO

**Consultar en Oracle:**
```sql
-- Ver todos los alumnos con su carrera
SELECT a.id_alumno, a.carnet, a.nombres, a.apellidos, 
       a.email, c.nombre_carrera, a.estado
FROM alumnos a
LEFT JOIN carreras c ON a.id_carrera = c.id_carrera;

-- Ver alumno específico por carnet
SELECT * FROM alumnos WHERE carnet = '2025-AL003';

-- Ver alumnos con su usuario
SELECT a.carnet, a.nombres, a.apellidos, u.nombre_usuario
FROM alumnos a
INNER JOIN usuarios u ON a.id_usuario = u.id_usuario;
```

---

### 3. **DOCENTES** 👨‍🏫
**Propósito:** Información de profesores del sistema

**Columnas utilizadas:**
- `ID_DOCENTE` - Identificador único
- `ID_USUARIO` - Relación con tabla USUARIOS
- `NOMBRES` - Nombres del docente
- `APELLIDOS` - Apellidos del docente
- `EMAIL` - Correo electrónico
- `TELEFONO` - Número de contacto
- `ESPECIALIDAD` - Área de especialización
- `FECHA_CONTRATACION` - Fecha de ingreso
- `ESTADO` - ACTIVO/INACTIVO

**Consultar en Oracle:**
```sql
-- Ver todos los docentes
SELECT id_docente, nombres, apellidos, email, especialidad, estado
FROM docentes;

-- Ver docentes con su usuario
SELECT d.id_docente, d.nombres, d.apellidos, d.especialidad, u.nombre_usuario
FROM docentes d
LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario;

-- Ver docentes activos
SELECT * FROM docentes WHERE estado = 'ACTIVO';
```

---

### 4. **CARRERAS** 🎯
**Propósito:** Programas académicos disponibles

**Columnas utilizadas:**
- `ID_CARRERA` - Identificador único
- `NOMBRE_CARRERA` - Nombre del programa
- `DESCRIPCION` - Descripción del programa
- `DURACION_ANIOS` - Duración en años
- `ESTADO` - ACTIVO/INACTIVO

**Consultar en Oracle:**
```sql
-- Ver todas las carreras
SELECT * FROM carreras;

-- Ver carreras activas con número de alumnos
SELECT c.nombre_carrera, c.duracion_anios, COUNT(a.id_alumno) as total_alumnos
FROM carreras c
LEFT JOIN alumnos a ON c.id_carrera = a.id_carrera
WHERE c.estado = 'ACTIVO'
GROUP BY c.nombre_carrera, c.duracion_anios;
```

---

### 5. **MATERIAS** 📚
**Propósito:** Asignaturas/cursos del sistema

**Columnas utilizadas:**
- `ID_MATERIA` - Identificador único
- `NOMBRE_MATERIA` - Nombre del curso
- `CODIGO_MATERIA` - Código único
- `CREDITOS` - Número de créditos
- `DESCRIPCION` - Descripción del curso
- `ID_CARRERA` - Relación con tabla CARRERAS
- `ESTADO` - ACTIVO/INACTIVO

**Consultar en Oracle:**
```sql
-- Ver todas las materias
SELECT id_materia, codigo_materia, nombre_materia, creditos, estado
FROM materias;

-- Ver materias por carrera
SELECT m.codigo_materia, m.nombre_materia, m.creditos, c.nombre_carrera
FROM materias m
INNER JOIN carreras c ON m.id_carrera = c.id_carrera
WHERE m.estado = 'ACTIVO';
```

---

### 6. **PERIODOS_ACADEMICOS** 📅
**Propósito:** Ciclos escolares (semestres/cuatrimestres)

**Columnas utilizadas:**
- `ID_PERIODO` - Identificador único
- `NOMBRE_PERIODO` - Nombre del periodo (ej: "Ciclo I - 2025")
- `FECHA_INICIO` - Fecha de inicio
- `FECHA_FIN` - Fecha de finalización
- `ESTADO` - ACTIVO/PLANIFICADO/FINALIZADO

**Consultar en Oracle:**
```sql
-- Ver todos los periodos
SELECT * FROM periodos_academicos ORDER BY fecha_inicio DESC;

-- Ver periodo activo actual
SELECT * FROM periodos_academicos WHERE estado = 'ACTIVO';
```

---

### 7. **GRUPOS** 👥
**Propósito:** Secciones/grupos de cada materia

**Columnas utilizadas:**
- `ID_GRUPO` - Identificador único
- `ID_MATERIA` - Relación con tabla MATERIAS
- `ID_PERIODO` - Relación con tabla PERIODOS_ACADEMICOS
- `ID_DOCENTE` - Relación con tabla DOCENTES
- `NUMERO_GRUPO` - Número del grupo (01, 02, etc.)
- `HORARIO` - Horario de clases
- `AULA` - Salón asignado
- `CUPO_MAXIMO` - Máximo de estudiantes
- `CUPO_DISPONIBLE` - Cupos restantes
- `ESTADO` - ACTIVO/INACTIVO

**Consultar en Oracle:**
```sql
-- Ver grupos con materia y docente
SELECT g.id_grupo, m.nombre_materia, g.numero_grupo, g.horario, g.aula,
       d.nombres || ' ' || d.apellidos as docente,
       g.cupo_maximo, g.cupo_disponible
FROM grupos g
INNER JOIN materias m ON g.id_materia = m.id_materia
LEFT JOIN docentes d ON g.id_docente = d.id_docente
WHERE g.estado = 'ACTIVO';

-- Ver grupos de un docente específico
SELECT g.numero_grupo, m.nombre_materia, g.horario, g.cupo_maximo
FROM grupos g
INNER JOIN materias m ON g.id_materia = m.id_materia
WHERE g.id_docente = 1;
```

---

### 8. **INSCRIPCIONES** 📝
**Propósito:** Registro de alumnos en materias/grupos

**Columnas utilizadas:**
- `ID_INSCRIPCION` - Identificador único
- `ID_ALUMNO` - Relación con tabla ALUMNOS
- `ID_GRUPO` - Relación con tabla GRUPOS
- `FECHA_INSCRIPCION` - Fecha de registro
- `ESTADO` - INSCRITO/RETIRADO
- `NOTA_P1` - Nota periodo 1
- `NOTA_P2` - Nota periodo 2
- `NOTA_P3` - Nota periodo 3
- `NOTA_P4` - Nota periodo 4
- `NOTA_FINAL` - Promedio final

**Consultar en Oracle:**
```sql
-- Ver inscripciones de un alumno con sus notas
SELECT i.id_inscripcion, m.nombre_materia, g.numero_grupo,
       i.nota_p1, i.nota_p2, i.nota_p3, i.nota_p4, i.nota_final,
       i.estado
FROM inscripciones i
INNER JOIN grupos g ON i.id_grupo = g.id_grupo
INNER JOIN materias m ON g.id_materia = m.id_materia
WHERE i.id_alumno = 21 AND i.estado = 'INSCRITO';

-- Ver alumnos inscritos en un grupo
SELECT a.carnet, a.nombres, a.apellidos, i.nota_final
FROM inscripciones i
INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
WHERE i.id_grupo = 1 AND i.estado = 'INSCRITO';
```

---

### 9. **PAGOS** 💳
**Propósito:** Historial de pagos de los alumnos

**Columnas utilizadas:**
- `ID_PAGO` - Identificador único
- `ID_ALUMNO` - Relación con tabla ALUMNOS
- `ID_PERIODO` - Relación con tabla PERIODOS_ACADEMICOS
- `CONCEPTO` - Descripción del pago
- `MONTO` - Cantidad a pagar
- `FECHA_PAGO` - Fecha del pago
- `METODO_PAGO` - EFECTIVO/TRANSFERENCIA/TARJETA
- `ESTADO` - PAGADO/PENDIENTE

**Consultar en Oracle:**
```sql
-- Ver pagos de un alumno
SELECT id_pago, concepto, monto, fecha_pago, metodo_pago, estado
FROM pagos
WHERE id_alumno = 21
ORDER BY fecha_pago DESC;

-- Ver pagos pendientes
SELECT a.carnet, a.nombres, a.apellidos, p.concepto, p.monto
FROM pagos p
INNER JOIN alumnos a ON p.id_alumno = a.id_alumno
WHERE p.estado = 'PENDIENTE';

-- Total pagado por alumno
SELECT a.carnet, a.nombres, SUM(p.monto) as total_pagado
FROM pagos p
INNER JOIN alumnos a ON p.id_alumno = a.id_alumno
WHERE p.estado = 'PAGADO'
GROUP BY a.carnet, a.nombres;
```

---

## 🔍 Consultas Útiles para Verificar Datos

### Ver estadísticas generales del sistema
```sql
-- Resumen del sistema
SELECT 
  (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario='ALUMNO') as total_alumnos,
  (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario='DOCENTE') as total_docentes,
  (SELECT COUNT(*) FROM carreras WHERE estado='ACTIVO') as carreras_activas,
  (SELECT COUNT(*) FROM materias WHERE estado='ACTIVO') as materias_activas,
  (SELECT COUNT(*) FROM grupos WHERE estado='ACTIVO') as grupos_activos
FROM dual;
```

### Ver materias de un alumno con todas sus notas
```sql
SELECT 
  a.carnet,
  a.nombres || ' ' || a.apellidos as alumno,
  m.codigo_materia,
  m.nombre_materia,
  g.numero_grupo,
  d.nombres || ' ' || d.apellidos as docente,
  i.nota_p1,
  i.nota_p2,
  i.nota_p3,
  i.nota_p4,
  i.nota_final,
  CASE 
    WHEN i.nota_final >= 6 THEN 'APROBADO'
    WHEN i.nota_final < 6 AND i.nota_final > 0 THEN 'REPROBADO'
    ELSE 'SIN CALIFICAR'
  END as resultado
FROM alumnos a
INNER JOIN inscripciones i ON a.id_alumno = i.id_alumno
INNER JOIN grupos g ON i.id_grupo = g.id_grupo
INNER JOIN materias m ON g.id_materia = m.id_materia
LEFT JOIN docentes d ON g.id_docente = d.id_docente
WHERE a.carnet = '2025-AL003' AND i.estado = 'INSCRITO';
```

### Ver alumnos de un docente con sus calificaciones
```sql
SELECT 
  m.nombre_materia,
  g.numero_grupo,
  a.carnet,
  a.nombres || ' ' || a.apellidos as alumno,
  i.nota_p1,
  i.nota_p2,
  i.nota_p3,
  i.nota_p4,
  i.nota_final
FROM docentes d
INNER JOIN grupos g ON d.id_docente = g.id_docente
INNER JOIN materias m ON g.id_materia = m.id_materia
INNER JOIN inscripciones i ON g.id_grupo = i.id_grupo
INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
WHERE d.id_docente = 1 AND i.estado = 'INSCRITO'
ORDER BY m.nombre_materia, g.numero_grupo, a.apellidos;
```

### Estado financiero de un alumno
```sql
SELECT 
  a.carnet,
  a.nombres || ' ' || a.apellidos as alumno,
  SUM(CASE WHEN p.estado = 'PAGADO' THEN p.monto ELSE 0 END) as total_pagado,
  SUM(CASE WHEN p.estado = 'PENDIENTE' THEN p.monto ELSE 0 END) as saldo_pendiente,
  COUNT(CASE WHEN p.estado = 'PENDIENTE' THEN 1 END) as pagos_pendientes
FROM alumnos a
LEFT JOIN pagos p ON a.id_alumno = p.id_alumno
WHERE a.carnet = '2025-AL003'
GROUP BY a.carnet, a.nombres, a.apellidos;
```

---

## 🛠️ Comandos Útiles en SQL*Plus

### Conectar a la base de datos
```bash
sqlplus system/Kathya.p03@localhost:1521/XE
```

### Ver la estructura de una tabla
```sql
DESC usuarios;
DESC alumnos;
DESC inscripciones;
```

### Ver todas las tablas del sistema
```sql
SELECT table_name FROM user_tables ORDER BY table_name;
```

### Ver restricciones de una tabla
```sql
SELECT constraint_name, constraint_type, search_condition 
FROM user_constraints 
WHERE table_name = 'ALUMNOS';
```

### Ver las columnas de una tabla
```sql
SELECT column_name, data_type, nullable 
FROM user_tab_columns 
WHERE table_name = 'INSCRIPCIONES' 
ORDER BY column_id;
```

### Limpiar pantalla en SQL*Plus
```sql
CLEAR SCREEN
```

### Ver cuántos registros tiene cada tabla
```sql
SELECT 'USUARIOS' as tabla, COUNT(*) as registros FROM usuarios
UNION ALL
SELECT 'ALUMNOS', COUNT(*) FROM alumnos
UNION ALL
SELECT 'DOCENTES', COUNT(*) FROM docentes
UNION ALL
SELECT 'CARRERAS', COUNT(*) FROM carreras
UNION ALL
SELECT 'MATERIAS', COUNT(*) FROM materias
UNION ALL
SELECT 'GRUPOS', COUNT(*) FROM grupos
UNION ALL
SELECT 'INSCRIPCIONES', COUNT(*) FROM inscripciones
UNION ALL
SELECT 'PAGOS', COUNT(*) FROM pagos;
```

---

## 📊 Datos de Prueba Actuales

### Usuario de prueba: Justin (Alumno)
- **Usuario:** `Justin`
- **Carnet:** `2025-AL003`
- **ID Alumno:** `21`

**Ver sus datos:**
```sql
-- Información personal
SELECT * FROM alumnos WHERE carnet = '2025-AL003';

-- Sus materias inscritas
SELECT m.nombre_materia, g.numero_grupo, d.nombres as docente
FROM inscripciones i
INNER JOIN grupos g ON i.id_grupo = g.id_grupo
INNER JOIN materias m ON g.id_materia = m.id_materia
LEFT JOIN docentes d ON g.id_docente = d.id_docente
WHERE i.id_alumno = 21 AND i.estado = 'INSCRITO';

-- Sus pagos
SELECT * FROM pagos WHERE id_alumno = 21;
```

---

## 🚨 Tablas NO Utilizadas (Ignorar)

El sistema **NO** utiliza estas tablas (si existen en tu base de datos):
- `ASISTENCIAS`
- `REPORTES`
- `SOLICITUDES`
- Cualquier otra tabla no mencionada arriba

---

## 💡 Tips Importantes

1. **Siempre usar WHERE en consultas de producción** para evitar traer demasiados datos
2. **Usar COMMIT después de INSERT/UPDATE/DELETE** para guardar cambios
3. **Los ID son auto-generados** - usar `DEFAULT` al insertar
4. **Las fechas se insertan con SYSDATE** para fecha actual
5. **Los estados son textos** - usar comillas: `'ACTIVO'`, `'PENDIENTE'`

---

## 📞 Conexión desde la Aplicación

**Archivo:** `config/database.js`
```javascript
user: 'system',
password: 'Kathya.p03',
connectString: 'localhost:1521/XE'
```

---

## 🔗 Relaciones Entre Tablas

```
USUARIOS (id_usuario)
  ├─→ ALUMNOS (id_usuario)
  │     └─→ INSCRIPCIONES (id_alumno)
  │     └─→ PAGOS (id_alumno)
  └─→ DOCENTES (id_usuario)
        └─→ GRUPOS (id_docente)

CARRERAS (id_carrera)
  ├─→ ALUMNOS (id_carrera)
  └─→ MATERIAS (id_carrera)

MATERIAS (id_materia)
  └─→ GRUPOS (id_materia)

PERIODOS_ACADEMICOS (id_periodo)
  ├─→ GRUPOS (id_periodo)
  └─→ PAGOS (id_periodo)

GRUPOS (id_grupo)
  └─→ INSCRIPCIONES (id_grupo)
```

---

**Fecha de creación:** Noviembre 11, 2025  
**Sistema:** TechnoAcademy University  
**Base de Datos:** Oracle XE 11g
