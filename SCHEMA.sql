-- =====================================================
-- SISTEMA DE REGISTRO ACADÉMICO
-- Base de Datos Oracle
-- =====================================================

-- =====================================================
-- ELIMINAR TABLAS EXISTENTES (EN ORDEN INVERSO POR FKs)
-- =====================================================

-- Eliminar tablas con FKs primero
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE evaluaciones CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE pagos CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE inscripciones CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE grupos CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE prerrequisitos CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE materias CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE periodos_academicos CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE docentes CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE carreras CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE alumnos CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE administradores CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE usuarios CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN NULL;
END;
/

-- =====================================================
-- CREAR TABLAS
-- =====================================================

-- Tabla de Usuarios (base para Admin y Alumnos)
CREATE TABLE usuarios (
    id_usuario NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre_usuario VARCHAR2(50) UNIQUE NOT NULL,
    contrasena VARCHAR2(255) NOT NULL, -- Almacenar hash
    tipo_usuario VARCHAR2(20) CHECK (tipo_usuario IN ('ADMIN', 'ALUMNO')) NOT NULL,
    estado VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO')),
    fecha_creacion DATE DEFAULT SYSDATE,
    ultimo_acceso DATE
);

-- Tabla de Administradores
CREATE TABLE administradores (
    id_admin NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER UNIQUE NOT NULL,
    nombres VARCHAR2(100) NOT NULL,
    apellidos VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    cargo VARCHAR2(50),
    fecha_contratacion DATE,
    CONSTRAINT fk_admin_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Alumnos
CREATE TABLE alumnos (
    id_alumno NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_usuario NUMBER UNIQUE NOT NULL,
    carnet VARCHAR2(20) UNIQUE NOT NULL,
    nombres VARCHAR2(100) NOT NULL,
    apellidos VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    fecha_nacimiento DATE,
    direccion VARCHAR2(200),
    carrera VARCHAR2(100),
    fecha_ingreso DATE DEFAULT SYSDATE,
    estado_academico VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado_academico IN ('ACTIVO', 'INACTIVO', 'GRADUADO', 'RETIRADO')),
    CONSTRAINT fk_alumno_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

-- Tabla de Carreras
CREATE TABLE carreras (
    id_carrera NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_carrera VARCHAR2(10) UNIQUE NOT NULL,
    nombre_carrera VARCHAR2(100) NOT NULL,
    descripcion VARCHAR2(500),
    duracion_ciclos NUMBER,
    estado VARCHAR2(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'INACTIVA'))
);

-- Tabla de Materias/Cursos
CREATE TABLE materias (
    id_materia NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_materia VARCHAR2(10) UNIQUE NOT NULL,
    nombre_materia VARCHAR2(100) NOT NULL,
    descripcion VARCHAR2(500),
    creditos NUMBER(2),
    horas_semanales NUMBER(2),
    id_carrera NUMBER,
    ciclo_recomendado NUMBER(2),
    estado VARCHAR2(20) DEFAULT 'ACTIVA' CHECK (estado IN ('ACTIVA', 'INACTIVA')),
    CONSTRAINT fk_materia_carrera FOREIGN KEY (id_carrera) REFERENCES carreras(id_carrera)
);

-- Tabla de Prerrequisitos
CREATE TABLE prerrequisitos (
    id_prerrequisito NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_materia NUMBER NOT NULL,
    id_materia_prereq NUMBER NOT NULL,
    CONSTRAINT fk_prereq_materia FOREIGN KEY (id_materia) REFERENCES materias(id_materia),
    CONSTRAINT fk_prereq_materia_req FOREIGN KEY (id_materia_prereq) REFERENCES materias(id_materia),
    CONSTRAINT uk_prerrequisito UNIQUE (id_materia, id_materia_prereq)
);

-- Tabla de Docentes
CREATE TABLE docentes (
    id_docente NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombres VARCHAR2(100) NOT NULL,
    apellidos VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    especialidad VARCHAR2(100),
    fecha_contratacion DATE,
    estado VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado IN ('ACTIVO', 'INACTIVO'))
);

-- Tabla de Periodos Académicos
CREATE TABLE periodos_academicos (
    id_periodo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_periodo VARCHAR2(20) UNIQUE NOT NULL,
    nombre_periodo VARCHAR2(50) NOT NULL, -- Ej: "Ciclo I - 2025"
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    estado VARCHAR2(20) DEFAULT 'ACTIVO' CHECK (estado IN ('PLANIFICADO', 'ACTIVO', 'FINALIZADO'))
);

-- Tabla de Grupos/Secciones
CREATE TABLE grupos (
    id_grupo NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_materia NUMBER NOT NULL,
    id_periodo NUMBER NOT NULL,
    id_docente NUMBER,
    numero_grupo VARCHAR2(5) NOT NULL, -- Ej: "01", "02"
    cupo_maximo NUMBER(3) DEFAULT 30,
    cupo_actual NUMBER(3) DEFAULT 0,
    horario VARCHAR2(200), -- Ej: "Lun-Mie 08:00-10:00"
    aula VARCHAR2(20),
    estado VARCHAR2(20) DEFAULT 'ABIERTO' CHECK (estado IN ('ABIERTO', 'CERRADO', 'CANCELADO')),
    CONSTRAINT fk_grupo_materia FOREIGN KEY (id_materia) REFERENCES materias(id_materia),
    CONSTRAINT fk_grupo_periodo FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id_periodo),
    CONSTRAINT fk_grupo_docente FOREIGN KEY (id_docente) REFERENCES docentes(id_docente),
    CONSTRAINT uk_grupo UNIQUE (id_materia, id_periodo, numero_grupo)
);

-- Tabla de Inscripciones
CREATE TABLE inscripciones (
    id_inscripcion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno NUMBER NOT NULL,
    id_grupo NUMBER NOT NULL,
    fecha_inscripcion DATE DEFAULT SYSDATE,
    estado VARCHAR2(20) DEFAULT 'INSCRITO' CHECK (estado IN ('INSCRITO', 'APROBADO', 'REPROBADO', 'RETIRADO')),
    nota_final NUMBER(4,2) CHECK (nota_final >= 0 AND nota_final <= 10),
    CONSTRAINT fk_inscripcion_alumno FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno),
    CONSTRAINT fk_inscripcion_grupo FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo),
    CONSTRAINT uk_inscripcion UNIQUE (id_alumno, id_grupo)
);

-- Tabla de Evaluaciones/Notas Parciales
CREATE TABLE evaluaciones (
    id_evaluacion NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_inscripcion NUMBER NOT NULL,
    tipo_evaluacion VARCHAR2(50), -- Ej: "Parcial 1", "Laboratorio", "Proyecto"
    nota NUMBER(4,2) CHECK (nota >= 0 AND nota <= 10),
    porcentaje NUMBER(5,2), -- Peso de la evaluación
    fecha_evaluacion DATE,
    observaciones VARCHAR2(500),
    CONSTRAINT fk_eval_inscripcion FOREIGN KEY (id_inscripcion) REFERENCES inscripciones(id_inscripcion) ON DELETE CASCADE
);

-- Tabla de Pagos (opcional)
CREATE TABLE pagos (
    id_pago NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_alumno NUMBER NOT NULL,
    id_periodo NUMBER NOT NULL,
    concepto VARCHAR2(100) NOT NULL, -- Ej: "Colegiatura", "Inscripción"
    monto NUMBER(10,2) NOT NULL,
    fecha_pago DATE DEFAULT SYSDATE,
    metodo_pago VARCHAR2(50),
    estado VARCHAR2(20) DEFAULT 'PENDIENTE' CHECK (estado IN ('PENDIENTE', 'PAGADO', 'VENCIDO')),
    CONSTRAINT fk_pago_alumno FOREIGN KEY (id_alumno) REFERENCES alumnos(id_alumno),
    CONSTRAINT fk_pago_periodo FOREIGN KEY (id_periodo) REFERENCES periodos_academicos(id_periodo)
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_alumnos_carnet ON alumnos(carnet);
CREATE INDEX idx_alumnos_estado ON alumnos(estado_academico);
CREATE INDEX idx_inscripciones_alumno ON inscripciones(id_alumno);
CREATE INDEX idx_inscripciones_grupo ON inscripciones(id_grupo);
CREATE INDEX idx_grupos_periodo ON grupos(id_periodo);
CREATE INDEX idx_evaluaciones_inscripcion ON evaluaciones(id_inscripcion);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar usuario administrador
INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
VALUES ('admin', '$2b$10$OeZg0HGzKPHJMnBqXAi1l.K/fZQJ.v8J6vN2Z7zY5qJ9mT6f0IhUS', 'ADMIN');

INSERT INTO administradores (id_usuario, nombres, apellidos, email, cargo)
VALUES (1, 'Juan', 'Pérez', 'admin@universidad.edu', 'Director Académico');

-- Insertar usuario alumno
INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
VALUES ('alumno1', '$2b$10$wKRlMPR5FvLb5tX4C3Sh2eJ9kL2mN8oP1qR5sT6uV7wX8yZ9aB0bC', 'ALUMNO');

INSERT INTO alumnos (id_usuario, carnet, nombres, apellidos, email, carrera)
VALUES (2, '2024001', 'Carlos', 'González', 'carlos@universidad.edu', 'Ingeniería en Sistemas');

-- Insertar carrera
INSERT INTO carreras (codigo_carrera, nombre_carrera, descripcion, duracion_ciclos)
VALUES ('ISC', 'Ingeniería en Sistemas Computacionales', 'Programa académico enfocado en tecnología', 8);

-- Insertar materias
INSERT INTO materias (codigo_materia, nombre_materia, creditos, horas_semanales, id_carrera, ciclo_recomendado)
VALUES ('ISC101', 'Programación I', 3, 4, 1, 1);

INSERT INTO materias (codigo_materia, nombre_materia, creditos, horas_semanales, id_carrera, ciclo_recomendado)
VALUES ('ISC102', 'Matemática Discreta', 3, 3, 1, 1);

-- Insertar docentes
INSERT INTO docentes (nombres, apellidos, email, especialidad)
VALUES ('María', 'López', 'maria@universidad.edu', 'Programación');

INSERT INTO docentes (nombres, apellidos, email, especialidad)
VALUES ('Luis', 'Martínez', 'luis@universidad.edu', 'Matemática');

-- Insertar un periodo académico
INSERT INTO periodos_academicos (codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin, estado)
VALUES ('2025-1', 'Ciclo I - 2025', DATE '2025-01-15', DATE '2025-06-30', 'ACTIVO');

-- Insertar grupos
INSERT INTO grupos (id_materia, id_periodo, id_docente, numero_grupo, horario, aula, cupo_maximo)
VALUES (1, 1, 1, '01', 'Lun-Mie 08:00-10:00', 'A-101', 30);

INSERT INTO grupos (id_materia, id_periodo, id_docente, numero_grupo, horario, aula, cupo_maximo)
VALUES (2, 1, 2, '01', 'Mar-Jue 10:00-12:00', 'A-102', 30);

COMMIT;
