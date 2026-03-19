const express = require('express');
const router = express.Router();
const path = require('path');

// ============ VISTAS HTML ============
router.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/dashboard.html')));
router.get('/inscripciones', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/inscripciones.html')));
router.get('/materias', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/materias.html')));
router.get('/mis-materias', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/materias.html')));
router.get('/calificaciones', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/calificaciones.html')));
router.get('/pagos', (req, res) => res.sendFile(path.join(__dirname, '../views/alumno/pagos.html')));

// ============ APIs CON DATOS FALSOS ============

router.get('/api/info', (req, res) => {
  res.json({ success: true, alumno: {
    ID_ALUMNO: 1, CARNET: '2024001', NOMBRES: 'Carlos', APELLIDOS: 'González',
    EMAIL: 'carlos@universidad.edu', CARRERA: 'Ingeniería en Sistemas',
    ESTADO_ACADEMICO: 'ACTIVO', FECHA_INGRESO: '2024-01-15'
  }});
});

router.get('/api/mis-materias', (req, res) => {
  res.json({ success: true, materias: [
    { ID_INSCRIPCION: 1, NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', CREDITOS: 3, HORARIO: 'Lun-Mie 08:00-10:00', AULA: 'A-101', NOMBRE_DOCENTE: 'María López', ESTADO: 'INSCRITO' },
    { ID_INSCRIPCION: 2, NOMBRE_MATERIA: 'Matemática Discreta', CODIGO_MATERIA: 'ISC102', CREDITOS: 3, HORARIO: 'Mar-Jue 10:00-12:00', AULA: 'A-102', NOMBRE_DOCENTE: 'Luis Martínez', ESTADO: 'INSCRITO' },
    { ID_INSCRIPCION: 3, NOMBRE_MATERIA: 'Física General', CODIGO_MATERIA: 'ISC103', CREDITOS: 4, HORARIO: 'Vie 07:00-10:00', AULA: 'B-201', NOMBRE_DOCENTE: 'Ana Rodríguez', ESTADO: 'INSCRITO' }
  ]});
});

router.get('/api/inscripciones', (req, res) => {
  res.json([
    { ID_INSCRIPCION: 1, NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', NUMERO_GRUPO: '01', HORARIO: 'Lun-Mie 08:00-10:00', ESTADO: 'INSCRITO', FECHA_INSCRIPCION: '2024-01-20' },
    { ID_INSCRIPCION: 2, NOMBRE_MATERIA: 'Matemática Discreta', CODIGO_MATERIA: 'ISC102', NUMERO_GRUPO: '01', HORARIO: 'Mar-Jue 10:00-12:00', ESTADO: 'INSCRITO', FECHA_INSCRIPCION: '2024-01-20' },
    { ID_INSCRIPCION: 3, NOMBRE_MATERIA: 'Física General', CODIGO_MATERIA: 'ISC103', NUMERO_GRUPO: '02', HORARIO: 'Vie 07:00-10:00', ESTADO: 'INSCRITO', FECHA_INSCRIPCION: '2024-01-21' }
  ]);
});

router.post('/api/inscripciones/crear', (req, res) => {
  res.json({ success: true, message: 'Inscripción exitosa (modo demo)' });
});

router.delete('/api/inscripciones/:id', (req, res) => {
  res.json({ success: true, message: 'Retiro exitoso (modo demo)' });
});

router.get('/api/materias/:id_periodo', (req, res) => {
  res.json([
    { ID_GRUPO: 1, NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', CREDITOS: 3, HORARIO: 'Lun-Mie 08:00-10:00', AULA: 'A-101', CUPO_MAXIMO: 30, CUPO_ACTUAL: 18, NOMBRE_DOCENTE: 'María López' },
    { ID_GRUPO: 2, NOMBRE_MATERIA: 'Matemática Discreta', CODIGO_MATERIA: 'ISC102', CREDITOS: 3, HORARIO: 'Mar-Jue 10:00-12:00', AULA: 'A-102', CUPO_MAXIMO: 30, CUPO_ACTUAL: 25, NOMBRE_DOCENTE: 'Luis Martínez' },
    { ID_GRUPO: 3, NOMBRE_MATERIA: 'Física General', CODIGO_MATERIA: 'ISC103', CREDITOS: 4, HORARIO: 'Vie 07:00-10:00', AULA: 'B-201', CUPO_MAXIMO: 25, CUPO_ACTUAL: 10, NOMBRE_DOCENTE: 'Ana Rodríguez' }
  ]);
});

router.get('/api/calificaciones', (req, res) => {
  res.json([
    { NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', CREDITOS: 3, NOTA_FINAL: 8.5, ESTADO: 'APROBADO', NOMBRE_PERIODO: 'Ciclo I - 2024' },
    { NOMBRE_MATERIA: 'Matemática Discreta', CODIGO_MATERIA: 'ISC102', CREDITOS: 3, NOTA_FINAL: 7.2, ESTADO: 'APROBADO', NOMBRE_PERIODO: 'Ciclo I - 2024' },
    { NOMBRE_MATERIA: 'Física General', CODIGO_MATERIA: 'ISC103', CREDITOS: 4, NOTA_FINAL: 6.0, ESTADO: 'APROBADO', NOMBRE_PERIODO: 'Ciclo I - 2024' }
  ]);
});

router.get('/api/pagos', (req, res) => {
  res.json([
    { ID_PAGO: 1, CONCEPTO: 'Colegiatura Ciclo I', MONTO: 450.00, ESTADO: 'PAGADO', FECHA_PAGO: '2024-01-15', METODO_PAGO: 'Transferencia', NOMBRE_PERIODO: 'Ciclo I - 2024' },
    { ID_PAGO: 2, CONCEPTO: 'Inscripción', MONTO: 50.00, ESTADO: 'PAGADO', FECHA_PAGO: '2024-01-10', METODO_PAGO: 'Efectivo', NOMBRE_PERIODO: 'Ciclo I - 2024' },
    { ID_PAGO: 3, CONCEPTO: 'Colegiatura Ciclo II', MONTO: 450.00, ESTADO: 'PENDIENTE', FECHA_PAGO: null, METODO_PAGO: null, NOMBRE_PERIODO: 'Ciclo II - 2024' }
  ]);
});

router.post('/api/pagar', (req, res) => {
  res.json({ success: true, message: 'Pago procesado exitosamente (modo demo)' });
});

router.get('/api/periodos', (req, res) => {
  res.json([
    { ID_PERIODO: 1, NOMBRE_PERIODO: 'Ciclo I - 2024' },
    { ID_PERIODO: 2, NOMBRE_PERIODO: 'Ciclo II - 2024' },
    { ID_PERIODO: 3, NOMBRE_PERIODO: 'Ciclo I - 2025' }
  ]);
});

module.exports = router;