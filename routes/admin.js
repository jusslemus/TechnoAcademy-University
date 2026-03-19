const express = require('express');
const router = express.Router();
const path = require('path');

// ============ VISTAS HTML ============
router.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/dashboard.html')));
router.get('/usuarios', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/usuarios.html')));
router.get('/alumnos', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/alumnos.html')));
router.get('/docentes', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/docentes.html')));
router.get('/carreras', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/carreras.html')));
router.get('/materias', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/materias.html')));
router.get('/periodos', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/periodos.html')));
router.get('/notas', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/notas.html')));
router.get('/pagos', (req, res) => res.sendFile(path.join(__dirname, '../views/admin/pagos.html')));

// ============ APIs CON DATOS FALSOS ============

router.get('/api/usuarios', (req, res) => res.json([
  { ID_USUARIO: 1, NOMBRE_USUARIO: 'admin', TIPO_USUARIO: 'ADMIN', ESTADO: 'ACTIVO', FECHA_CREACION: '2024-01-01' },
  { ID_USUARIO: 2, NOMBRE_USUARIO: 'alumno', TIPO_USUARIO: 'ALUMNO', ESTADO: 'ACTIVO', FECHA_CREACION: '2024-01-15' },
  { ID_USUARIO: 3, NOMBRE_USUARIO: 'docente', TIPO_USUARIO: 'DOCENTE', ESTADO: 'ACTIVO', FECHA_CREACION: '2024-01-10' }
]));

router.post('/api/usuarios/crear', (req, res) => res.json({ success: true, id_usuario: 4 }));
router.put('/api/usuarios/:id', (req, res) => res.json({ success: true, message: 'Usuario editado (modo demo)' }));
router.delete('/api/usuarios/:id', (req, res) => res.json({ success: true, message: 'Usuario eliminado (modo demo)' }));

router.get('/api/alumnos', (req, res) => res.json([
  { ID_ALUMNO: 1, CARNET: '2024001', NOMBRES: 'Carlos', APELLIDOS: 'González', EMAIL: 'carlos@universidad.edu', CARRERA: 'Ingeniería en Sistemas', ESTADO_ACADEMICO: 'ACTIVO' },
  { ID_ALUMNO: 2, CARNET: '2024002', NOMBRES: 'Ana', APELLIDOS: 'Martínez', EMAIL: 'ana@universidad.edu', CARRERA: 'Ingeniería en Sistemas', ESTADO_ACADEMICO: 'ACTIVO' },
  { ID_ALUMNO: 3, CARNET: '2024003', NOMBRES: 'Pedro', APELLIDOS: 'Ramírez', EMAIL: 'pedro@universidad.edu', CARRERA: 'Administración', ESTADO_ACADEMICO: 'ACTIVO' }
]));

router.post('/api/alumnos/crear', (req, res) => res.json({ success: true, message: 'Alumno creado (modo demo)', id_usuario: 5 }));
router.put('/api/alumnos/:id', (req, res) => res.json({ success: true, message: 'Alumno editado (modo demo)' }));
router.delete('/api/alumnos/:id', (req, res) => res.json({ success: true, message: 'Alumno eliminado (modo demo)' }));

router.get('/api/docentes', (req, res) => res.json([
  { ID_DOCENTE: 1, NOMBRES: 'María', APELLIDOS: 'López', EMAIL: 'maria@universidad.edu', ESPECIALIDAD: 'Programación', ESTADO: 'ACTIVO' },
  { ID_DOCENTE: 2, NOMBRES: 'Luis', APELLIDOS: 'Martínez', EMAIL: 'luis@universidad.edu', ESPECIALIDAD: 'Matemática', ESTADO: 'ACTIVO' },
  { ID_DOCENTE: 3, NOMBRES: 'Ana', APELLIDOS: 'Rodríguez', EMAIL: 'ana.r@universidad.edu', ESPECIALIDAD: 'Física', ESTADO: 'ACTIVO' }
]));

router.post('/api/docentes/crear', (req, res) => res.json({ success: true, message: 'Docente creado (modo demo)', id_usuario: 6 }));
router.put('/api/docentes/:id', (req, res) => res.json({ success: true, message: 'Docente editado (modo demo)' }));
router.delete('/api/docentes/:id', (req, res) => res.json({ success: true, message: 'Docente eliminado (modo demo)' }));

router.get('/api/carreras', (req, res) => res.json([
  { ID_CARRERA: 1, CODIGO_CARRERA: 'ISC', NOMBRE_CARRERA: 'Ingeniería en Sistemas Computacionales', DURACION_CICLOS: 8, ESTADO: 'ACTIVA' },
  { ID_CARRERA: 2, CODIGO_CARRERA: 'ADM', NOMBRE_CARRERA: 'Administración de Empresas', DURACION_CICLOS: 8, ESTADO: 'ACTIVA' },
  { ID_CARRERA: 3, CODIGO_CARRERA: 'CON', NOMBRE_CARRERA: 'Contaduría Pública', DURACION_CICLOS: 8, ESTADO: 'ACTIVA' }
]));

router.post('/api/carreras/crear', (req, res) => res.json({ success: true, message: 'Carrera creada (modo demo)' }));
router.put('/api/carreras/:id', (req, res) => res.json({ success: true, message: 'Carrera editada (modo demo)' }));
router.delete('/api/carreras/:id', (req, res) => res.json({ success: true, message: 'Carrera eliminada (modo demo)' }));

router.get('/api/materias', (req, res) => res.json([
  { ID_MATERIA: 1, CODIGO_MATERIA: 'ISC101', NOMBRE_MATERIA: 'Programación I', CREDITOS: 3, HORAS_SEMANALES: 4, NOMBRE_CARRERA: 'Ingeniería en Sistemas', CICLO_RECOMENDADO: 1, ESTADO: 'ACTIVA' },
  { ID_MATERIA: 2, CODIGO_MATERIA: 'ISC102', NOMBRE_MATERIA: 'Matemática Discreta', CREDITOS: 3, HORAS_SEMANALES: 3, NOMBRE_CARRERA: 'Ingeniería en Sistemas', CICLO_RECOMENDADO: 1, ESTADO: 'ACTIVA' },
  { ID_MATERIA: 3, CODIGO_MATERIA: 'ISC103', NOMBRE_MATERIA: 'Física General', CREDITOS: 4, HORAS_SEMANALES: 5, NOMBRE_CARRERA: 'Ingeniería en Sistemas', CICLO_RECOMENDADO: 2, ESTADO: 'ACTIVA' }
]));

router.post('/api/materias/crear', (req, res) => res.json({ success: true, message: 'Materia creada (modo demo)' }));
router.put('/api/materias/:id', (req, res) => res.json({ success: true, message: 'Materia editada (modo demo)' }));
router.delete('/api/materias/:id', (req, res) => res.json({ success: true, message: 'Materia eliminada (modo demo)' }));

router.get('/api/periodos', (req, res) => res.json([
  { ID_PERIODO: 1, CODIGO_PERIODO: '2024-1', NOMBRE_PERIODO: 'Ciclo I - 2024', FECHA_INICIO: '2024-01-15', FECHA_FIN: '2024-06-30', ESTADO: 'FINALIZADO' },
  { ID_PERIODO: 2, CODIGO_PERIODO: '2024-2', NOMBRE_PERIODO: 'Ciclo II - 2024', FECHA_INICIO: '2024-07-15', FECHA_FIN: '2024-12-15', ESTADO: 'FINALIZADO' },
  { ID_PERIODO: 3, CODIGO_PERIODO: '2025-1', NOMBRE_PERIODO: 'Ciclo I - 2025', FECHA_INICIO: '2025-01-15', FECHA_FIN: '2025-06-30', ESTADO: 'ACTIVO' }
]));

router.post('/api/periodos/crear', (req, res) => res.json({ success: true, message: 'Período creado (modo demo)' }));
router.put('/api/periodos/:id', (req, res) => res.json({ success: true, message: 'Período editado (modo demo)' }));
router.delete('/api/periodos/:id', (req, res) => res.json({ success: true, message: 'Período eliminado (modo demo)' }));

router.get('/api/grupos', (req, res) => res.json([
  { ID_GRUPO: 1, NOMBRE_MATERIA: 'Programación I', NUMERO_GRUPO: '01', HORARIO: 'Lun-Mie 08:00-10:00', AULA: 'A-101', CUPO_MAXIMO: 30, CUPO_ACTUAL: 18, NOMBRE_DOCENTE: 'María López' },
  { ID_GRUPO: 2, NOMBRE_MATERIA: 'Matemática Discreta', NUMERO_GRUPO: '01', HORARIO: 'Mar-Jue 10:00-12:00', AULA: 'A-102', CUPO_MAXIMO: 30, CUPO_ACTUAL: 25, NOMBRE_DOCENTE: 'Luis Martínez' }
]));

router.get('/api/notas/grupo/:id', (req, res) => res.json({ message: 'Notas del grupo (modo demo)' }));
router.put('/api/notas/:id', (req, res) => res.json({ success: true, message: 'Nota actualizada (modo demo)' }));

router.get('/api/pagos', (req, res) => res.json([
  { ID_PAGO: 1, NOMBRE_ALUMNO: 'Carlos González', CONCEPTO: 'Colegiatura Ciclo I', MONTO: 450.00, ESTADO: 'PAGADO', FECHA_PAGO: '2024-01-15' },
  { ID_PAGO: 2, NOMBRE_ALUMNO: 'Ana Martínez', CONCEPTO: 'Inscripción', MONTO: 50.00, ESTADO: 'PAGADO', FECHA_PAGO: '2024-01-10' },
  { ID_PAGO: 3, NOMBRE_ALUMNO: 'Pedro Ramírez', CONCEPTO: 'Colegiatura Ciclo II', MONTO: 450.00, ESTADO: 'PENDIENTE', FECHA_PAGO: null }
]));

router.post('/api/pagos/registrar', (req, res) => res.json({ success: true, message: 'Pago registrado (modo demo)' }));

module.exports = router;