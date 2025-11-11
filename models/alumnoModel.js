const db = require('../config/database');

// Obtener información del alumno
async function getAlumnoInfo(id_usuario) {
  try {
    const alumno = await db.fetchOne(
      `SELECT a.*, c.nombre_carrera
       FROM alumnos a
       LEFT JOIN carreras c ON a.carrera = c.nombre_carrera
       WHERE a.id_usuario = :id_usuario`,
      { id_usuario }
    );
    return alumno;
  } catch (err) {
    console.error('Error obteniendo info alumno:', err);
    throw err;
  }
}

// Obtener inscripciones del alumno
async function getInscripciones(id_alumno, id_periodo = null) {
  try {
    let query = `
      SELECT 
        i.id_inscripcion,
        m.codigo_materia,
        m.nombre_materia,
        g.numero_grupo,
        d.nombres || ' ' || d.apellidos as docente,
        g.horario,
        g.aula,
        i.estado,
        i.nota_final
      FROM inscripciones i
      JOIN grupos g ON i.id_grupo = g.id_grupo
      JOIN materias m ON g.id_materia = m.id_materia
      LEFT JOIN docentes d ON g.id_docente = d.id_docente
    `;

    let params = { id_alumno };

    if (id_periodo) {
      query += ` WHERE i.id_alumno = :id_alumno AND g.id_periodo = :id_periodo`;
      params.id_periodo = id_periodo;
    } else {
      query += ` WHERE i.id_alumno = :id_alumno`;
    }

    query += ` ORDER BY m.codigo_materia`;

    const inscripciones = await db.fetchQuery(query, params);
    return inscripciones;
  } catch (err) {
    console.error('Error obteniendo inscripciones:', err);
    throw err;
  }
}

// Obtener calificaciones del alumno
async function getCalificaciones(id_alumno) {
  try {
    const calificaciones = await db.fetchQuery(
      `
      SELECT 
        m.codigo_materia,
        m.nombre_materia,
        i.nota_final,
        i.estado,
        d.nombres || ' ' || d.apellidos as docente
      FROM inscripciones i
      JOIN grupos g ON i.id_grupo = g.id_grupo
      JOIN materias m ON g.id_materia = m.id_materia
      LEFT JOIN docentes d ON g.id_docente = d.id_docente
      WHERE i.id_alumno = :id_alumno
      ORDER BY m.codigo_materia
      `,
      { id_alumno }
    );
    return calificaciones;
  } catch (err) {
    console.error('Error obteniendo calificaciones:', err);
    throw err;
  }
}

// Obtener materias disponibles para inscribirse
async function getMateriasDisponibles(id_periodo) {
  try {
    const materias = await db.fetchQuery(
      `
      SELECT 
        g.id_grupo,
        m.codigo_materia,
        m.nombre_materia,
        m.creditos,
        c.nombre_carrera,
        d.nombres || ' ' || d.apellidos as docente,
        g.horario,
        g.aula,
        g.cupo_maximo - g.cupo_actual as cupo_disponible
      FROM grupos g
      JOIN materias m ON g.id_materia = m.id_materia
      JOIN carreras c ON m.id_carrera = c.id_carrera
      LEFT JOIN docentes d ON g.id_docente = d.id_docente
      WHERE g.id_periodo = :id_periodo 
        AND g.estado = 'ABIERTO'
        AND g.cupo_actual < g.cupo_maximo
      ORDER BY m.codigo_materia
      `,
      { id_periodo }
    );
    return materias;
  } catch (err) {
    console.error('Error obteniendo materias disponibles:', err);
    throw err;
  }
}

// Inscribirse en una materia
async function inscribirseMateria(id_alumno, id_grupo) {
  let connection;
  try {
    connection = await db.getConnection();

    // Verificar si ya está inscrito
    const existente = await db.fetchOne(
      `SELECT id_inscripcion FROM inscripciones WHERE id_alumno = :id_alumno AND id_grupo = :id_grupo`,
      { id_alumno, id_grupo }
    );

    if (existente) {
      throw new Error('Ya está inscrito en esta materia');
    }

    // Verificar cupo
    const grupo = await db.fetchOne(
      `SELECT cupo_maximo, cupo_actual FROM grupos WHERE id_grupo = :id_grupo`,
      { id_grupo }
    );

    if (grupo.cupo_actual >= grupo.cupo_maximo) {
      throw new Error('No hay cupo disponible en este grupo');
    }

    // Insertar inscripción
    await connection.execute(
      `INSERT INTO inscripciones (id_alumno, id_grupo) VALUES (:id_alumno, :id_grupo)`,
      { id_alumno, id_grupo }
    );

    // Actualizar cupo
    await connection.execute(
      `UPDATE grupos SET cupo_actual = cupo_actual + 1 WHERE id_grupo = :id_grupo`,
      { id_grupo }
    );

    await connection.commit();
    console.log(`✅ Inscripción exitosa: Alumno ${id_alumno} en grupo ${id_grupo}`);
    return { success: true, message: 'Inscripción exitosa' };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error inscribiéndose:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

// Retirarse de una materia
async function retirarseMateria(id_inscripcion) {
  let connection;
  try {
    connection = await db.getConnection();

    // Obtener id_grupo
    const inscripcion = await db.fetchOne(
      `SELECT id_grupo FROM inscripciones WHERE id_inscripcion = :id_inscripcion`,
      { id_inscripcion }
    );

    if (!inscripcion) {
      throw new Error('Inscripción no encontrada');
    }

    // Cambiar estado a RETIRADO
    await connection.execute(
      `UPDATE inscripciones SET estado = 'RETIRADO' WHERE id_inscripcion = :id_inscripcion`,
      { id_inscripcion }
    );

    // Liberar cupo
    await connection.execute(
      `UPDATE grupos SET cupo_actual = cupo_actual - 1 WHERE id_grupo = :id_grupo`,
      { id_grupo: inscripcion.id_grupo }
    );

    await connection.commit();
    console.log(`✅ Retiro exitoso de inscripción ${id_inscripcion}`);
    return { success: true, message: 'Se ha retirado de la materia' };
  } catch (err) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error retirándose:', err);
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
}

module.exports = {
  getAlumnoInfo,
  getInscripciones,
  getCalificaciones,
  getMateriasDisponibles,
  inscribirseMateria,
  retirarseMateria
};
