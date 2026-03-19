const express = require('express');
const router = express.Router();
const path = require('path');

// ============ VISTAS HTML ============
router.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, '../views/docente/dashboard.html')));
router.get('/mis-materias', (req, res) => res.sendFile(path.join(__dirname, '../views/docente/mis-materias.html')));
router.get('/calificaciones', (req, res) => res.sendFile(path.join(__dirname, '../views/docente/calificaciones.html')));

// ============ APIs CON DATOS FALSOS ============

router.get('/api/info', (req, res) => res.json({ success: true, docente: {
  ID_DOCENTE: 1, NOMBRES: 'María', APELLIDOS: 'López',
  EMAIL: 'maria@universidad.edu', ESPECIALIDAD: 'Programación',
  TOTAL_MATERIAS: 2, TOTAL_ALUMNOS: 43, PROMEDIO_GENERAL: 7.8, ALUMNOS_RIESGO: 3
}}));

router.get('/api/mis-materias', (req, res) => res.json({ success: true, materias: [
  { ID_GRUPO: 1, NUMERO_GRUPO: '01', HORARIO: 'Lun-Mie 08:00-10:00', AULA: 'A-101', CODIGO_MATERIA: 'ISC101', NOMBRE_MATERIA: 'Programación I', CREDITOS: 3, TOTAL_ALUMNOS: 18, PROMEDIO_GRUPO: 7.9 },
  { ID_GRUPO: 2, NUMERO_GRUPO: '01', HORARIO: 'Mar-Jue 10:00-12:00', AULA: 'A-102', CODIGO_MATERIA: 'ISC102', NOMBRE_MATERIA: 'Matemática Discreta', CREDITOS: 3, TOTAL_ALUMNOS: 25, PROMEDIO_GRUPO: 7.2 }
]}));

router.get('/api/materias-alumnos', (req, res) => res.json({ success: true, materias: [
  { ID_GRUPO: 1, NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', PROMEDIO_GRUPO: 7.9, alumnos: [
    { ID_INSCRIPCION: 1, CARNET: '2024001', NOMBRE_COMPLETO: 'Carlos González', EMAIL: 'carlos@universidad.edu', NOTA_P1: 8.0, NOTA_P2: 7.5, NOTA_P3: 8.5, NOTA_P4: 9.0, NOTA_FINAL: 8.25 },
    { ID_INSCRIPCION: 2, CARNET: '2024002', NOMBRE_COMPLETO: 'Ana Martínez', EMAIL: 'ana@universidad.edu', NOTA_P1: 7.0, NOTA_P2: 8.0, NOTA_P3: 7.5, NOTA_P4: 8.0, NOTA_FINAL: 7.625 }
  ]},
  { ID_GRUPO: 2, NOMBRE_MATERIA: 'Matemática Discreta', CODIGO_MATERIA: 'ISC102', PROMEDIO_GRUPO: 7.2, alumnos: [
    { ID_INSCRIPCION: 3, CARNET: '2024003', NOMBRE_COMPLETO: 'Pedro Ramírez', EMAIL: 'pedro@universidad.edu', NOTA_P1: 6.0, NOTA_P2: 7.0, NOTA_P3: 6.5, NOTA_P4: 7.5, NOTA_FINAL: 6.75 }
  ]}
]}));

router.get('/api/alumnos-grupo/:id', (req, res) => res.json({ success: true, alumnos: [
  { ID_INSCRIPCION: 1, CARNET: '2024001', NOMBRE_COMPLETO: 'Carlos González', EMAIL: 'carlos@universidad.edu', NOTA_FINAL: 8.25 },
  { ID_INSCRIPCION: 2, CARNET: '2024002', NOMBRE_COMPLETO: 'Ana Martínez', EMAIL: 'ana@universidad.edu', NOTA_FINAL: 7.625 }
]}));

router.post('/api/guardar-calificacion', (req, res) => res.json({ success: true, message: 'Calificación guardada (modo demo)' }));
router.post('/api/guardar-notas-periodo', (req, res) => res.json({ success: true, message: 'Notas guardadas (modo demo)', nota_final: 7.5 }));

router.get('/api/predicciones', (req, res) => res.json({ success: true, predicciones: [
  { NOMBRE_ALUMNO: 'Carlos González', NOMBRE_MATERIA: 'Programación I', PROMEDIO_ACTUAL: 8.25, PREDICCION: 'APROBARA', RIESGO: 'BAJO' },
  { NOMBRE_ALUMNO: 'Ana Martínez', NOMBRE_MATERIA: 'Programación I', PROMEDIO_ACTUAL: 7.625, PREDICCION: 'APROBARA', RIESGO: 'BAJO' },
  { NOMBRE_ALUMNO: 'Pedro Ramírez', NOMBRE_MATERIA: 'Matemática Discreta', PROMEDIO_ACTUAL: 5.5, PREDICCION: 'EN RIESGO', RIESGO: 'ALTO' }
]}));

router.get('/api/alumnos-disponibles', (req, res) => res.json({ success: true, alumnos: [
  { ID_ALUMNO: 1, CARNET: '2024001', NOMBRES: 'Carlos', APELLIDOS: 'González', EMAIL: 'carlos@universidad.edu' },
  { ID_ALUMNO: 2, CARNET: '2024002', NOMBRES: 'Ana', APELLIDOS: 'Martínez', EMAIL: 'ana@universidad.edu' },
  { ID_ALUMNO: 3, CARNET: '2024003', NOMBRES: 'Pedro', APELLIDOS: 'Ramírez', EMAIL: 'pedro@universidad.edu' }
]}));

router.post('/api/inscribir-alumno', (req, res) => res.json({ success: true, message: 'Alumno inscrito (modo demo)' }));
router.delete('/api/retirar-alumno/:id', (req, res) => res.json({ success: true, message: 'Alumno retirado (modo demo)' }));

router.get('/api/calificaciones-todas', (req, res) => res.json({ success: true, calificaciones: [
  { ID_INSCRIPCION: 1, NOTA_P1: 8.0, NOTA_P2: 7.5, NOTA_P3: 8.5, NOTA_P4: 9.0, NOTA_FINAL: 8.25, CARNET: '2024001', NOMBRES: 'Carlos', APELLIDOS: 'González', NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', NUMERO_GRUPO: '01' },
  { ID_INSCRIPCION: 2, NOTA_P1: 7.0, NOTA_P2: 8.0, NOTA_P3: 7.5, NOTA_P4: 8.0, NOTA_FINAL: 7.625, CARNET: '2024002', NOMBRES: 'Ana', APELLIDOS: 'Martínez', NOMBRE_MATERIA: 'Programación I', CODIGO_MATERIA: 'ISC101', NUMERO_GRUPO: '01' }
]}));

module.exports = router;