const express = require('express');
const router = express.Router();
const path = require('path');
const db = require('../config/database');

// ============ VISTAS HTML ============

// Dashboard Docente
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/docente/dashboard.html'));
});

// Mis Materias
router.get('/mis-materias', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/docente/mis-materias.html'));
});

// Calificaciones
router.get('/calificaciones', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/docente/calificaciones.html'));
});

// ============ APIs ============

// ---- INFORMACIÓN DEL DOCENTE ----
router.get('/api/info', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener información del docente
    const docente = await db.fetchOne(
      `SELECT d.*, 
              (SELECT COUNT(DISTINCT g.id_grupo) FROM grupos g WHERE g.id_docente = d.id_docente) as TOTAL_MATERIAS,
              (SELECT COUNT(*) FROM inscripciones i 
               JOIN grupos g ON i.id_grupo = g.id_grupo 
               WHERE g.id_docente = d.id_docente AND i.estado = 'INSCRITO') as TOTAL_ALUMNOS,
              (SELECT AVG(i.nota_final) FROM inscripciones i 
               JOIN grupos g ON i.id_grupo = g.id_grupo 
               WHERE g.id_docente = d.id_docente AND i.nota_final IS NOT NULL) as PROMEDIO_GENERAL,
              (SELECT COUNT(*) FROM inscripciones i 
               JOIN grupos g ON i.id_grupo = g.id_grupo 
               WHERE g.id_docente = d.id_docente AND i.nota_final < 6 AND i.nota_final IS NOT NULL) as ALUMNOS_RIESGO
       FROM docentes d
       WHERE d.id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    if (!docente) {
      return res.status(404).json({ success: false, error: 'Docente no encontrado' });
    }
    
    res.json({ success: true, docente });
  } catch (err) {
    console.error('Error obteniendo info del docente:', err);
    res.status(500).json({ success: false, error: 'Error al obtener información' });
  }
});

// ---- MIS MATERIAS ----
router.get('/api/mis-materias', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_docente
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    if (!docente) {
      return res.status(404).json({ success: false, error: 'Docente no encontrado' });
    }
    
    // Obtener materias asignadas
    const materias = await db.fetchQuery(
      `SELECT 
         g.id_grupo,
         g.numero_grupo,
         g.horario,
         g.aula,
         g.cupo_maximo,
         m.id_materia,
         m.codigo_materia,
         m.nombre_materia,
         m.creditos,
                  (SELECT COUNT(*) FROM inscripciones WHERE id_grupo = g.id_grupo) as TOTAL_ALUMNOS,
         (SELECT AVG(nota_final) FROM inscripciones WHERE id_grupo = g.id_grupo AND nota_final IS NOT NULL) as PROMEDIO_GRUPO
       FROM grupos g
       JOIN materias m ON g.id_materia = m.id_materia
       WHERE g.id_docente = :id_docente
       ORDER BY m.nombre_materia`,
      { id_docente: docente.ID_DOCENTE }
    );
    
    res.json({ success: true, materias });
  } catch (err) {
    console.error('Error obteniendo materias:', err);
    res.status(500).json({ success: false, error: 'Error al obtener materias' });
  }
});

// ---- MATERIAS CON ALUMNOS ----
router.get('/api/materias-alumnos', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    if (!docente) {
      return res.status(404).json({ success: false, error: 'Docente no encontrado' });
    }
    
    // Obtener materias
    const materias = await db.fetchQuery(
      `SELECT 
         g.id_grupo,
         g.numero_grupo,
         g.horario,
         g.aula,
         m.codigo_materia,
         m.nombre_materia,
         m.creditos,
         (SELECT AVG(nota_final) FROM inscripciones WHERE id_grupo = g.id_grupo AND nota_final IS NOT NULL) as PROMEDIO_GRUPO
       FROM grupos g
       JOIN materias m ON g.id_materia = m.id_materia
       WHERE g.id_docente = :id_docente
       ORDER BY m.nombre_materia`,
      { id_docente: docente.ID_DOCENTE }
    );
    
    // Para cada materia, obtener sus alumnos
    for (let materia of materias) {
      const alumnos = await db.fetchQuery(
        `SELECT 
           i.id_inscripcion,
           a.carnet,
           a.nombres || ' ' || a.apellidos as NOMBRE_COMPLETO,
           a.email,
           i.nota_p1,
           i.nota_p2,
           i.nota_p3,
           i.nota_p4,
           i.nota_final
         FROM inscripciones i
         JOIN alumnos a ON i.id_alumno = a.id_alumno
         WHERE i.id_grupo = :id_grupo
         ORDER BY a.apellidos, a.nombres`,
        { id_grupo: materia.ID_GRUPO }
      );
      
      materia.alumnos = alumnos;
    }
    
    res.json({ success: true, materias });
  } catch (err) {
    console.error('Error obteniendo materias con alumnos:', err);
    res.status(500).json({ success: false, error: 'Error al obtener materias' });
  }
});

// ---- ALUMNOS DE UN GRUPO ----
router.get('/api/alumnos-grupo/:id_grupo', async (req, res) => {
  try {
    const { id_grupo } = req.params;
    
    const alumnos = await db.fetchQuery(
      `SELECT 
         i.id_inscripcion,
         a.carnet,
         a.nombres || ' ' || a.apellidos as NOMBRE_COMPLETO,
         a.email,
         i.nota_final
       FROM inscripciones i
       JOIN alumnos a ON i.id_alumno = a.id_alumno
       WHERE i.id_grupo = :id_grupo AND i.estado = 'ACTIVO'
       ORDER BY a.apellidos, a.nombres`,
      { id_grupo }
    );
    
    res.json({ success: true, alumnos });
  } catch (err) {
    console.error('Error obteniendo alumnos del grupo:', err);
    res.status(500).json({ success: false, error: 'Error al obtener alumnos' });
  }
});

// ---- GUARDAR CALIFICACIÓN ----
router.post('/api/guardar-calificacion', async (req, res) => {
  try {
    const { id_inscripcion, nota_final } = req.body;
    
    if (!id_inscripcion || nota_final === undefined) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' });
    }
    
    if (nota_final < 0 || nota_final > 10) {
      return res.status(400).json({ success: false, error: 'La nota debe estar entre 0 y 10' });
    }
    
    await db.execute(
      `UPDATE inscripciones SET nota_final = :nota_final WHERE id_inscripcion = :id_inscripcion`,
      { nota_final, id_inscripcion }
    );
    
    console.log(`✅ Calificación guardada: Inscripción ${id_inscripcion} = ${nota_final}`);
    res.json({ success: true, message: 'Calificación guardada exitosamente' });
  } catch (err) {
    console.error('Error guardando calificación:', err);
    res.status(500).json({ success: false, error: 'Error al guardar calificación' });
  }
});

// ---- PREDICCIONES DE RENDIMIENTO ----
router.get('/api/predicciones', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    if (!docente) {
      return res.status(404).json({ success: false, error: 'Docente no encontrado' });
    }
    
    // Obtener alumnos con sus promedios y generar predicciones
    const predicciones = await db.fetchQuery(
      `SELECT 
         a.nombres || ' ' || a.apellidos as NOMBRE_ALUMNO,
         m.nombre_materia,
         i.nota_final as PROMEDIO_ACTUAL,
         CASE 
           WHEN i.nota_final < 4 THEN 'ALTO_RIESGO'
           WHEN i.nota_final >= 4 AND i.nota_final < 6 THEN 'RIESGO_MODERADO'
           WHEN i.nota_final >= 6 AND i.nota_final < 7 THEN 'RENDIMIENTO_BAJO'
           ELSE 'BUEN_RENDIMIENTO'
         END as PREDICCION,
         CASE 
           WHEN i.nota_final < 4 THEN 'Se recomienda atención inmediata y refuerzo académico intensivo'
           WHEN i.nota_final >= 4 AND i.nota_final < 6 THEN 'Requiere apoyo adicional y seguimiento continuo'
           WHEN i.nota_final >= 6 AND i.nota_final < 7 THEN 'Mantener seguimiento, puede mejorar con práctica adicional'
           ELSE 'Excelente desempeño, continuar motivando'
         END as RECOMENDACION
       FROM inscripciones i
       JOIN alumnos a ON i.id_alumno = a.id_alumno
       JOIN grupos g ON i.id_grupo = g.id_grupo
       JOIN materias m ON g.id_materia = m.id_materia
       WHERE g.id_docente = :id_docente 
         AND i.nota_final IS NOT NULL
       ORDER BY 
         CASE 
           WHEN i.nota_final < 4 THEN 1
           WHEN i.nota_final >= 4 AND i.nota_final < 6 THEN 2
           WHEN i.nota_final >= 6 AND i.nota_final < 7 THEN 3
           ELSE 4
         END,
         i.nota_final ASC`,
      { id_docente: docente.ID_DOCENTE }
    );
    
    res.json({ success: true, predicciones });
  } catch (err) {
    console.error('Error obteniendo predicciones:', err);
    res.status(500).json({ success: false, error: 'Error al obtener predicciones' });
  }
});

// ---- ALUMNOS DISPONIBLES PARA INSCRIBIR ----
router.get('/api/alumnos-disponibles', async (req, res) => {
  try {
    const alumnos = await db.fetchQuery(
      `SELECT 
         id_alumno as ID_ALUMNO,
         carnet as CARNET,
         nombres as NOMBRES,
         apellidos as APELLIDOS,
         email as EMAIL
       FROM alumnos
       ORDER BY apellidos, nombres`
    );
    
    res.json({ success: true, alumnos });
  } catch (err) {
    console.error('Error obteniendo alumnos disponibles:', err);
    res.status(500).json({ success: false, error: 'Error al obtener alumnos' });
  }
});

// ---- INSCRIBIR ALUMNO A MATERIA ----
router.post('/api/inscribir-alumno', async (req, res) => {
  let connection;
  try {
    const { id_grupo, id_alumno } = req.body;
    
    if (!id_grupo || !id_alumno) {
      return res.status(400).json({ success: false, error: 'Datos incompletos' });
    }
    
    // Verificar que el grupo pertenece al docente
    const id_usuario = req.session.usuario.id;
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    const grupo = await db.fetchOne(
      `SELECT g.*, 
              (SELECT COUNT(*) FROM inscripciones WHERE id_grupo = g.id_grupo) as CUPO_ACTUAL
       FROM grupos g
       WHERE g.id_grupo = :id_grupo AND g.id_docente = :id_docente`,
      { id_grupo, id_docente: docente.ID_DOCENTE }
    );
    
    if (!grupo) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para este grupo' });
    }
    
    if (grupo.CUPO_ACTUAL >= grupo.CUPO_MAXIMO) {
      return res.status(400).json({ success: false, error: 'El grupo está lleno (cupo máximo alcanzado)' });
    }
    
    // Verificar si el alumno ya está inscrito
    const inscripcionExistente = await db.fetchOne(
      `SELECT id_inscripcion FROM inscripciones 
       WHERE id_grupo = :id_grupo AND id_alumno = :id_alumno`,
      { id_grupo, id_alumno }
    );
    
    if (inscripcionExistente) {
      return res.status(400).json({ success: false, error: 'El alumno ya está inscrito en esta materia' });
    }
    
    connection = await db.getConnection();
    
    // Insertar inscripción (id_inscripcion es auto-generado, el período viene del grupo)
    await connection.execute(
      `INSERT INTO inscripciones (id_alumno, id_grupo, fecha_inscripcion, estado)
       VALUES (:id_alumno, :id_grupo, SYSDATE, 'INSCRITO')`,
      { id_alumno, id_grupo }
    );
    
    await connection.commit();
    
    console.log(`✅ Alumno ${id_alumno} inscrito en grupo ${id_grupo}`);
    res.json({ success: true, message: 'Alumno inscrito exitosamente' });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error inscribiendo alumno:', err);
    res.status(500).json({ success: false, error: 'Error al inscribir alumno' });
  } finally {
    if (connection) {
      await connection.close();
    }
  }
});

// ---- GUARDAR NOTAS POR PERÍODO ----
router.post('/api/guardar-notas-periodo', async (req, res) => {
  let connection;
  try {
    const { id_inscripcion, nota_p1, nota_p2, nota_p3, nota_p4 } = req.body;
    
    if (!id_inscripcion) {
      return res.status(400).json({ success: false, error: 'ID de inscripción requerido' });
    }
    
    // Validar notas (si se proporcionan)
    const notas = [nota_p1, nota_p2, nota_p3, nota_p4].filter(n => n !== null && n !== undefined);
    for (let nota of notas) {
      if (nota < 0 || nota > 10) {
        return res.status(400).json({ success: false, error: 'Las notas deben estar entre 0 y 10' });
      }
    }
    
    // Calcular nota final (promedio de las notas ingresadas)
    let nota_final = null;
    if (notas.length > 0) {
      nota_final = notas.reduce((a, b) => a + b, 0) / notas.length;
    }
    
    connection = await db.getConnection();
    
    await connection.execute(
      `UPDATE inscripciones 
       SET nota_p1 = :nota_p1,
           nota_p2 = :nota_p2,
           nota_p3 = :nota_p3,
           nota_p4 = :nota_p4,
           nota_final = :nota_final
       WHERE id_inscripcion = :id_inscripcion`,
      { 
        nota_p1: nota_p1 || null, 
        nota_p2: nota_p2 || null, 
        nota_p3: nota_p3 || null, 
        nota_p4: nota_p4 || null,
        nota_final: nota_final,
        id_inscripcion 
      }
    );
    
    await connection.commit();
    
    console.log(`✅ Notas guardadas: Inscripción ${id_inscripcion} - Final: ${nota_final?.toFixed(2)}`);
    res.json({ success: true, message: 'Notas guardadas exitosamente', nota_final });
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error guardando notas:', err);
    res.status(500).json({ success: false, error: 'Error al guardar notas' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error cerrando conexión:', err);
      }
    }
  }
});

// ---- RETIRAR ALUMNO DE MATERIA ----
router.delete('/api/retirar-alumno/:id_inscripcion', async (req, res) => {
  try {
    const { id_inscripcion } = req.params;
    
    // Verificar que la inscripción pertenece a un grupo del docente
    const id_usuario = req.session.usuario.id;
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    const inscripcion = await db.fetchOne(
      `SELECT i.* FROM inscripciones i
       JOIN grupos g ON i.id_grupo = g.id_grupo
       WHERE i.id_inscripcion = :id_inscripcion AND g.id_docente = :id_docente`,
      { id_inscripcion, id_docente: docente.ID_DOCENTE }
    );
    
    if (!inscripcion) {
      return res.status(403).json({ success: false, error: 'No tienes permiso para esta operación' });
    }
    
    await db.execute(
      `DELETE FROM inscripciones WHERE id_inscripcion = :id_inscripcion`,
      { id_inscripcion }
    );
    
    console.log(`✅ Alumno retirado: Inscripción ${id_inscripcion}`);
    res.json({ success: true, message: 'Alumno retirado exitosamente' });
  } catch (err) {
    console.error('Error retirando alumno:', err);
    res.status(500).json({ success: false, error: 'Error al retirar alumno' });
  }
});

// ---- OBTENER TODAS LAS CALIFICACIONES ----
router.get('/api/calificaciones-todas', async (req, res) => {
  try {
    const id_usuario = req.session.usuario.id;
    
    // Obtener id_docente
    const docente = await db.fetchOne(
      `SELECT id_docente FROM docentes WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    
    if (!docente) {
      return res.status(403).json({ success: false, error: 'No tienes permiso de docente' });
    }
    
    // Obtener todas las inscripciones de los grupos del docente
    const calificaciones = await db.fetchQuery(
      `SELECT i.id_inscripcion,
              i.nota_p1, i.nota_p2, i.nota_p3, i.nota_p4, i.nota_final,
              a.id_alumno, a.carnet, a.nombres, a.apellidos, a.email,
              m.id_materia, m.nombre_materia, m.codigo_materia,
              g.id_grupo, g.numero_grupo
       FROM inscripciones i
       JOIN alumnos a ON i.id_alumno = a.id_alumno
       JOIN grupos g ON i.id_grupo = g.id_grupo
       JOIN materias m ON g.id_materia = m.id_materia
       WHERE g.id_docente = :id_docente AND i.estado = 'INSCRITO'
       ORDER BY a.apellidos, a.nombres, m.nombre_materia`,
      { id_docente: docente.ID_DOCENTE }
    );
    
    res.json({ success: true, calificaciones });
  } catch (err) {
    console.error('Error obteniendo calificaciones:', err);
    res.status(500).json({ success: false, error: 'Error al obtener calificaciones' });
  }
});

module.exports = router;
