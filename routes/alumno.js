const express = require('express');
const router = express.Router();
const path = require('path');
const alumnoModel = require('../models/alumnoModel');
const db = require('../config/database');

// ============ VISTAS HTML ============

// Dashboard Alumno
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/dashboard.html'));
});

// Mis Inscripciones
router.get('/inscripciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/inscripciones.html'));
});

// Materias Disponibles
router.get('/materias', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/materias.html'));
});

// Mis Calificaciones
router.get('/calificaciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/calificaciones.html'));
});

// Mi Horario
router.get('/horario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/horario.html'));
});

// Mis Pagos
router.get('/pagos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/alumno/pagos.html'));
});

// ============ APIs ============

// ---- INFORMACIÓN DEL ALUMNO ----
router.get('/api/info', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    const alumno = await alumnoModel.getAlumnoInfo(id_usuario);
    
    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    res.json(alumno);
  } catch (err) {
    console.error('Error obteniendo info del alumno:', err);
    res.status(500).json({ error: 'Error al obtener información' });
  }
});

// ---- INSCRIPCIONES ----
router.get('/api/inscripciones', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_alumno del usuario
    const alumno = await db.fetchOne(
      `SELECT id_alumno FROM alumnos WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const inscripciones = await alumnoModel.getInscripciones(alumno.ID_ALUMNO);
    res.json(inscripciones);
  } catch (err) {
    console.error('Error obteniendo inscripciones:', err);
    res.status(500).json({ error: 'Error al obtener inscripciones' });
  }
});

router.post('/api/inscripciones/crear', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    const { id_grupo } = req.body;

    if (!id_grupo) {
      return res.status(400).json({ error: 'ID de grupo requerido' });
    }

    // Obtener id_alumno
    const alumno = await db.fetchOne(
      `SELECT id_alumno FROM alumnos WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    await alumnoModel.inscribirseMateria(alumno.ID_ALUMNO, id_grupo);
    res.json({ success: true, message: 'Inscripción exitosa' });
  } catch (err) {
    console.error('Error en inscripción:', err);
    if (err.message.includes('cupo')) {
      res.status(400).json({ error: 'No hay cupo disponible' });
    } else {
      res.status(500).json({ error: 'Error al inscribirse' });
    }
  }
});

router.delete('/api/inscripciones/:id_inscripcion', async (req, res) => {
  try {
    const { id_inscripcion } = req.params;

    await alumnoModel.retirarseMateria(id_inscripcion);
    res.json({ success: true, message: 'Retiro exitoso' });
  } catch (err) {
    console.error('Error al retirarse:', err);
    res.status(500).json({ error: 'Error al retirarse' });
  }
});

// ---- MATERIAS DISPONIBLES ----
router.get('/api/materias/:id_periodo', async (req, res) => {
  try {
    const { id_periodo } = req.params;
    
    const materias = await alumnoModel.getMateriasDisponibles(id_periodo);
    res.json(materias);
  } catch (err) {
    console.error('Error obteniendo materias disponibles:', err);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
});

// ---- CALIFICACIONES ----
router.get('/api/calificaciones', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_alumno
    const alumno = await db.fetchOne(
      `SELECT id_alumno FROM alumnos WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const calificaciones = await alumnoModel.getCalificaciones(alumno.ID_ALUMNO);
    res.json(calificaciones);
  } catch (err) {
    console.error('Error obteniendo calificaciones:', err);
    res.status(500).json({ error: 'Error al obtener calificaciones' });
  }
});

// ---- HORARIO ----
router.get('/api/horario', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_alumno
    const alumno = await db.fetchOne(
      `SELECT id_alumno FROM alumnos WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    // Obtener grupos en los que está inscrito
    const horario = await db.fetchQuery(
      `SELECT 
         m.nombre_materia,
         m.codigo_materia,
         g.numero_grupo,
         g.horario,
         g.aula,
         d.nombres || ' ' || d.apellidos as docente
       FROM inscripciones i
       JOIN grupos g ON i.id_grupo = g.id_grupo
       JOIN materias m ON g.id_materia = m.id_materia
       LEFT JOIN docentes d ON g.id_docente = d.id_docente
       WHERE i.id_alumno = :id_alumno
       ORDER BY g.horario`,
      { id_alumno: alumno.ID_ALUMNO }
    );

    res.json(horario);
  } catch (err) {
    console.error('Error obteniendo horario:', err);
    res.status(500).json({ error: 'Error al obtener horario' });
  }
});

// ---- PAGOS ----
router.get('/api/pagos', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_alumno
    const alumno = await db.fetchOne(
      `SELECT id_alumno FROM alumnos WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );

    if (!alumno) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const pagos = await db.fetchQuery(
      `SELECT * FROM pagos WHERE id_alumno = :id_alumno ORDER BY fecha_vencimiento DESC`,
      { id_alumno: alumno.ID_ALUMNO }
    );

    res.json(pagos);
  } catch (err) {
    console.error('Error obteniendo pagos:', err);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
});

// ---- PERÍODOS ACADÉMICOS ----
router.get('/api/periodos', async (req, res) => {
  try {
    const periodos = await db.fetchQuery(
      `SELECT id_periodo, nombre_periodo FROM periodos_academicos WHERE estado = 'ACTIVO' ORDER BY fecha_inicio DESC`
    );
    res.json(periodos);
  } catch (err) {
    console.error('Error obteniendo períodos:', err);
    res.status(500).json({ error: 'Error al obtener períodos' });
  }
});

module.exports = router;
