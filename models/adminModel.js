const db = require('../config/database');

// ============ USUARIOS ============

// Obtener todos los usuarios
async function getUsuarios() {
  try {
    const usuarios = await db.fetchQuery(
      `SELECT id_usuario, nombre_usuario, tipo_usuario, estado, fecha_creacion, ultimo_acceso
       FROM usuarios ORDER BY fecha_creacion DESC`
    );
    return usuarios;
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    throw err;
  }
}

// Obtener usuario por ID
async function getUsuarioById(id_usuario) {
  try {
    const usuario = await db.fetchOne(
      `SELECT * FROM usuarios WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    return usuario;
  } catch (err) {
    console.error('Error obteniendo usuario:', err);
    throw err;
  }
}

// Crear usuario
async function crearUsuario(datos) {
  const bcrypt = require('bcryptjs');
  try {
    const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);
    
    await db.executeQuery(
      `INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
       VALUES (:nombre_usuario, :contrasena, :tipo_usuario)`,
      {
        nombre_usuario: datos.nombre_usuario,
        contrasena: contrasenaHasheada,
        tipo_usuario: datos.tipo_usuario
      }
    );

    console.log(`✅ Usuario creado: ${datos.nombre_usuario}`);
    return { success: true, message: 'Usuario creado exitosamente' };
  } catch (err) {
    console.error('Error creando usuario:', err);
    throw err;
  }
}

// Editar usuario
async function editarUsuario(id_usuario, datos) {
  const bcrypt = require('bcryptjs');
  try {
    let query = `UPDATE usuarios SET `;
    let params = { id_usuario };
    let updates = [];

    if (datos.nombre_usuario) {
      updates.push(`nombre_usuario = :nombre_usuario`);
      params.nombre_usuario = datos.nombre_usuario;
    }
    
    if (datos.contrasena) {
      const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);
      updates.push(`contrasena = :contrasena`);
      params.contrasena = contrasenaHasheada;
    }
    
    if (datos.tipo_usuario) {
      updates.push(`tipo_usuario = :tipo_usuario`);
      params.tipo_usuario = datos.tipo_usuario;
    }

    if (updates.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    query += updates.join(', ') + ` WHERE id_usuario = :id_usuario`;

    await db.executeQuery(query, params);
    console.log(`✅ Usuario editado: ${id_usuario}`);
    return { success: true, message: 'Usuario editado exitosamente' };
  } catch (err) {
    console.error('Error editando usuario:', err);
    throw err;
  }
}

// Eliminar usuario
async function eliminarUsuario(id_usuario) {
  try {
    await db.executeQuery(
      `DELETE FROM usuarios WHERE id_usuario = :id_usuario`,
      { id_usuario }
    );
    console.log(`✅ Usuario eliminado: ${id_usuario}`);
    return { success: true, message: 'Usuario eliminado exitosamente' };
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    throw err;
  }
}

// ============ ALUMNOS ============

// Obtener todos los alumnos
async function getAlumnos() {
  try {
    const alumnos = await db.fetchQuery(
      `SELECT a.id_alumno, a.carnet, a.nombres, a.apellidos, a.email, a.telefono,
              a.fecha_nacimiento, a.direccion, a.carrera, a.estado_academico as estado, 
              a.fecha_ingreso, a.id_usuario, u.nombre_usuario
       FROM alumnos a
       LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
       ORDER BY a.carnet`
    );
    return alumnos;
  } catch (err) {
    console.error('Error obteniendo alumnos:', err);
    throw err;
  }
}

// Crear alumno (con usuario)
async function crearAlumno(datos) {
  const bcrypt = require('bcryptjs');
  let connection;
  
  try {
    connection = await db.getConnection();
    
    // 1. Crear usuario
    const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);
    const resultUsuario = await connection.execute(
      `INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
       VALUES (:nombre_usuario, :contrasena, 'ALUMNO')
       RETURNING id_usuario INTO :id_usuario`,
      {
        nombre_usuario: datos.nombre_usuario,
        contrasena: contrasenaHasheada,
        id_usuario: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
      },
      { autoCommit: false }
    );
    
    const id_usuario = resultUsuario.outBinds.id_usuario[0];
    
    // 2. Crear alumno
    await connection.execute(
      `INSERT INTO alumnos (id_usuario, carnet, nombres, apellidos, email, telefono, 
                           fecha_nacimiento, direccion, carrera)
       VALUES (:id_usuario, :carnet, :nombres, :apellidos, :email, :telefono, 
               :fecha_nacimiento, :direccion, :carrera)`,
      {
        id_usuario: id_usuario,
        carnet: datos.carnet,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono || null,
        fecha_nacimiento: datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento) : null,
        direccion: datos.direccion || null,
        carrera: datos.carrera || null
      },
      { autoCommit: false }
    );
    
    await connection.commit();
    console.log(`✅ Alumno creado: ${datos.carnet} - ${datos.nombres} ${datos.apellidos}`);
    return { success: true, id_usuario };
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Error en rollback:', rollbackErr);
      }
    }
    console.error('Error creando alumno:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error cerrando conexión:', closeErr);
      }
    }
  }
}

// Editar alumno
async function editarAlumno(id_alumno, datos) {
  try {
    const campos = [];
    const params = { id_alumno: parseInt(id_alumno) };
    
    if (datos.carnet) {
      campos.push('carnet = :carnet');
      params.carnet = datos.carnet;
    }
    if (datos.nombres) {
      campos.push('nombres = :nombres');
      params.nombres = datos.nombres;
    }
    if (datos.apellidos) {
      campos.push('apellidos = :apellidos');
      params.apellidos = datos.apellidos;
    }
    if (datos.email) {
      campos.push('email = :email');
      params.email = datos.email;
    }
    if (datos.telefono !== undefined) {
      campos.push('telefono = :telefono');
      params.telefono = datos.telefono || null;
    }
    if (datos.fecha_nacimiento !== undefined) {
      campos.push('fecha_nacimiento = :fecha_nacimiento');
      params.fecha_nacimiento = datos.fecha_nacimiento ? new Date(datos.fecha_nacimiento) : null;
    }
    if (datos.direccion !== undefined) {
      campos.push('direccion = :direccion');
      params.direccion = datos.direccion || null;
    }
    if (datos.carrera !== undefined) {
      campos.push('carrera = :carrera');
      params.carrera = datos.carrera || null;
    }
    if (datos.estado) {
      campos.push('estado_academico = :estado');
      params.estado = datos.estado;
    }
    
    if (campos.length === 0) {
      throw new Error('No hay campos para actualizar');
    }
    
    const query = `UPDATE alumnos SET ${campos.join(', ')} WHERE id_alumno = :id_alumno`;
    
    await db.executeQuery(query, params);
    console.log(`✅ Alumno editado: ${id_alumno}`);
  } catch (err) {
    console.error('Error editando alumno:', err);
    throw err;
  }
}

// Eliminar alumno
async function eliminarAlumno(id_alumno) {
  let connection;
  
  try {
    connection = await db.getConnection();
    
    // 1. Obtener id_usuario del alumno
    const alumno = await connection.execute(
      `SELECT id_usuario FROM alumnos WHERE id_alumno = :id_alumno`,
      { id_alumno: parseInt(id_alumno) }
    );
    
    if (alumno.rows.length === 0) {
      throw new Error('Alumno no encontrado');
    }
    
    const id_usuario = alumno.rows[0][0];
    
    // 2. Eliminar alumno
    await connection.execute(
      `DELETE FROM alumnos WHERE id_alumno = :id_alumno`,
      { id_alumno: parseInt(id_alumno) },
      { autoCommit: false }
    );
    
    // 3. Eliminar usuario
    await connection.execute(
      `DELETE FROM usuarios WHERE id_usuario = :id_usuario`,
      { id_usuario: id_usuario },
      { autoCommit: false }
    );
    
    await connection.commit();
    console.log(`✅ Alumno eliminado: ${id_alumno}`);
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Error en rollback:', rollbackErr);
      }
    }
    console.error('Error eliminando alumno:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error cerrando conexión:', closeErr);
      }
    }
  }
}

// ============ CARRERAS ============

// Obtener todas las carreras
async function getCarreras() {
  try {
    const carreras = await db.fetchQuery(
      `SELECT id_carrera, codigo_carrera, nombre_carrera, descripcion, duracion_ciclos, estado
       FROM carreras ORDER BY codigo_carrera`
    );
    return carreras;
  } catch (err) {
    console.error('Error obteniendo carreras:', err);
    throw err;
  }
}

// Crear carrera
async function crearCarrera(datos) {
  try {
    await db.executeQuery(
      `INSERT INTO carreras (codigo_carrera, nombre_carrera, descripcion, duracion_ciclos)
       VALUES (:codigo_carrera, :nombre_carrera, :descripcion, :duracion_ciclos)`,
      {
        codigo_carrera: datos.codigo_carrera,
        nombre_carrera: datos.nombre_carrera,
        descripcion: datos.descripcion || null,
        duracion_ciclos: datos.duracion_ciclos || 8
      }
    );
    console.log(`✅ Carrera creada: ${datos.codigo_carrera}`);
    return { success: true, message: 'Carrera creada exitosamente' };
  } catch (err) {
    console.error('Error creando carrera:', err);
    throw err;
  }
}

// Editar carrera
async function editarCarrera(id_carrera, datos) {
  try {
    let query = `UPDATE carreras SET `;
    let params = { id_carrera };
    let updates = [];

    if (datos.nombre_carrera) {
      updates.push(`nombre_carrera = :nombre_carrera`);
      params.nombre_carrera = datos.nombre_carrera;
    }
    if (datos.codigo_carrera) {
      updates.push(`codigo_carrera = :codigo_carrera`);
      params.codigo_carrera = datos.codigo_carrera;
    }
    if (datos.descripcion !== undefined) {
      updates.push(`descripcion = :descripcion`);
      params.descripcion = datos.descripcion;
    }

    if (updates.length === 0) throw new Error('No hay campos para actualizar');

    query += updates.join(', ') + ` WHERE id_carrera = :id_carrera`;
    await db.executeQuery(query, params);
    console.log(`✅ Carrera editada: ${id_carrera}`);
    return { success: true, message: 'Carrera editada exitosamente' };
  } catch (err) {
    console.error('Error editando carrera:', err);
    throw err;
  }
}

// Eliminar carrera
async function eliminarCarrera(id_carrera) {
  try {
    await db.executeQuery(
      `DELETE FROM carreras WHERE id_carrera = :id_carrera`,
      { id_carrera }
    );
    console.log(`✅ Carrera eliminada: ${id_carrera}`);
    return { success: true, message: 'Carrera eliminada exitosamente' };
  } catch (err) {
    console.error('Error eliminando carrera:', err);
    throw err;
  }
}

// ============ MATERIAS ============

// Obtener todas las materias
async function getMaterias() {
  try {
    const materias = await db.fetchQuery(
      `SELECT m.id_materia, m.codigo_materia, m.nombre_materia, m.creditos, m.horas_semanales,
              c.nombre_carrera, m.ciclo_recomendado, m.estado
       FROM materias m
       LEFT JOIN carreras c ON m.id_carrera = c.id_carrera
       ORDER BY m.codigo_materia`
    );
    return materias;
  } catch (err) {
    console.error('Error obteniendo materias:', err);
    throw err;
  }
}

// Crear materia
async function crearMateria(datos) {
  try {
    await db.executeQuery(
      `INSERT INTO materias (codigo_materia, nombre_materia, descripcion, creditos, 
                            horas_semanales, id_carrera, ciclo_recomendado)
       VALUES (:codigo_materia, :nombre_materia, :descripcion, :creditos, 
               :horas_semanales, :id_carrera, :ciclo_recomendado)`,
      {
        codigo_materia: datos.codigo_materia,
        nombre_materia: datos.nombre_materia,
        descripcion: datos.descripcion || null,
        creditos: datos.creditos || 3,
        horas_semanales: datos.horas_semanales || 3,
        id_carrera: datos.id_carrera,
        ciclo_recomendado: datos.ciclo_recomendado || 1
      }
    );
    console.log(`✅ Materia creada: ${datos.codigo_materia}`);
    return { success: true, message: 'Materia creada exitosamente' };
  } catch (err) {
    console.error('Error creando materia:', err);
    throw err;
  }
}

// Editar materia
async function editarMateria(id_materia, datos) {
  try {
    let query = `UPDATE materias SET `;
    let params = { id_materia };
    let updates = [];

    if (datos.nombre_materia) {
      updates.push(`nombre_materia = :nombre_materia`);
      params.nombre_materia = datos.nombre_materia;
    }
    if (datos.codigo_materia) {
      updates.push(`codigo_materia = :codigo_materia`);
      params.codigo_materia = datos.codigo_materia;
    }
    if (datos.creditos) {
      updates.push(`creditos = :creditos`);
      params.creditos = datos.creditos;
    }
    if (datos.horas_semanales) {
      updates.push(`horas_semanales = :horas_semanales`);
      params.horas_semanales = datos.horas_semanales;
    }

    if (updates.length === 0) throw new Error('No hay campos para actualizar');

    query += updates.join(', ') + ` WHERE id_materia = :id_materia`;
    await db.executeQuery(query, params);
    console.log(`✅ Materia editada: ${id_materia}`);
    return { success: true, message: 'Materia editada exitosamente' };
  } catch (err) {
    console.error('Error editando materia:', err);
    throw err;
  }
}

// Eliminar materia
async function eliminarMateria(id_materia) {
  try {
    await db.executeQuery(
      `DELETE FROM materias WHERE id_materia = :id_materia`,
      { id_materia }
    );
    console.log(`✅ Materia eliminada: ${id_materia}`);
    return { success: true, message: 'Materia eliminada exitosamente' };
  } catch (err) {
    console.error('Error eliminando materia:', err);
    throw err;
  }
}

// ============ PERIODOS ============

// Obtener todos los períodos
async function getPeriodos() {
  try {
    const periodos = await db.fetchQuery(
      `SELECT id_periodo, codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin, estado
       FROM periodos_academicos ORDER BY fecha_inicio DESC`
    );
    return periodos;
  } catch (err) {
    console.error('Error obteniendo períodos:', err);
    throw err;
  }
}

// Crear período
async function crearPeriodo(datos) {
  try {
    const codigo_periodo = datos.codigo_periodo || datos.nombre_periodo;
    
    await db.executeQuery(
      `INSERT INTO periodos_academicos (codigo_periodo, nombre_periodo, fecha_inicio, fecha_fin)
       VALUES (:codigo_periodo, :nombre_periodo, :fecha_inicio, :fecha_fin)`,
      {
        codigo_periodo,
        nombre_periodo: datos.nombre_periodo,
        fecha_inicio: datos.fecha_inicio,
        fecha_fin: datos.fecha_fin
      }
    );
    console.log(`✅ Período creado: ${codigo_periodo}`);
    return { success: true, message: 'Período creado exitosamente' };
  } catch (err) {
    console.error('Error creando período:', err);
    throw err;
  }
}

// Editar período
async function editarPeriodo(id_periodo, datos) {
  try {
    let query = `UPDATE periodos_academicos SET `;
    let params = { id_periodo };
    let updates = [];

    if (datos.nombre_periodo) {
      updates.push(`nombre_periodo = :nombre_periodo`);
      params.nombre_periodo = datos.nombre_periodo;
    }
    if (datos.fecha_inicio) {
      updates.push(`fecha_inicio = :fecha_inicio`);
      params.fecha_inicio = datos.fecha_inicio;
    }
    if (datos.fecha_fin) {
      updates.push(`fecha_fin = :fecha_fin`);
      params.fecha_fin = datos.fecha_fin;
    }

    if (updates.length === 0) throw new Error('No hay campos para actualizar');

    query += updates.join(', ') + ` WHERE id_periodo = :id_periodo`;
    await db.executeQuery(query, params);
    console.log(`✅ Período editado: ${id_periodo}`);
    return { success: true, message: 'Período editado exitosamente' };
  } catch (err) {
    console.error('Error editando período:', err);
    throw err;
  }
}

// Eliminar período
async function eliminarPeriodo(id_periodo) {
  try {
    await db.executeQuery(
      `DELETE FROM periodos_academicos WHERE id_periodo = :id_periodo`,
      { id_periodo }
    );
    console.log(`✅ Período eliminado: ${id_periodo}`);
    return { success: true, message: 'Período eliminado exitosamente' };
  } catch (err) {
    console.error('Error eliminando período:', err);
    throw err;
  }
}

// ============ GRUPOS ============

// Obtener todos los grupos
async function getGrupos(id_periodo = null) {
  try {
    let query = `
      SELECT g.id_grupo, m.codigo_materia, m.nombre_materia, g.numero_grupo,
             d.nombres || ' ' || d.apellidos as docente, g.horario, g.aula,
             g.cupo_maximo, g.cupo_actual, g.estado, p.nombre_periodo
      FROM grupos g
      JOIN materias m ON g.id_materia = m.id_materia
      LEFT JOIN docentes d ON g.id_docente = d.id_docente
      JOIN periodos_academicos p ON g.id_periodo = p.id_periodo
    `;

    let params = {};
    if (id_periodo) {
      query += ` WHERE g.id_periodo = :id_periodo`;
      params.id_periodo = id_periodo;
    }

    query += ` ORDER BY m.codigo_materia, g.numero_grupo`;

    const grupos = await db.fetchQuery(query, params);
    return grupos;
  } catch (err) {
    console.error('Error obteniendo grupos:', err);
    throw err;
  }
}

// Crear grupo
async function crearGrupo(datos) {
  try {
    await db.executeQuery(
      `INSERT INTO grupos (id_materia, id_periodo, id_docente, numero_grupo, horario, aula, cupo_maximo)
       VALUES (:id_materia, :id_periodo, :id_docente, :numero_grupo, :horario, :aula, :cupo_maximo)`,
      {
        id_materia: datos.id_materia,
        id_periodo: datos.id_periodo,
        id_docente: datos.id_docente || null,
        numero_grupo: datos.numero_grupo,
        horario: datos.horario || null,
        aula: datos.aula || null,
        cupo_maximo: datos.cupo_maximo || 30
      }
    );
    console.log(`✅ Grupo creado: ${datos.numero_grupo}`);
    return { success: true, message: 'Grupo creado exitosamente' };
  } catch (err) {
    console.error('Error creando grupo:', err);
    throw err;
  }
}

// ============ DOCENTES ============

// Obtener todos los docentes
async function getDocentes() {
  try {
    const docentes = await db.fetchQuery(
      `SELECT d.id_docente, d.nombres, d.apellidos, d.email, d.telefono, 
              d.especialidad, d.fecha_contratacion, d.estado, d.id_usuario,
              u.nombre_usuario, u.tipo_usuario
       FROM docentes d
       LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
       ORDER BY d.nombres, d.apellidos`
    );
    return docentes;
  } catch (err) {
    console.error('Error obteniendo docentes:', err);
    throw err;
  }
}

// Crear docente (con usuario)
async function crearDocente(datos) {
  const bcrypt = require('bcryptjs');
  let connection;
  
  try {
    connection = await db.getConnection();
    
    // 1. Crear usuario
    const contrasenaHasheada = await bcrypt.hash(datos.contrasena, 10);
    const resultUsuario = await connection.execute(
      `INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
       VALUES (:nombre_usuario, :contrasena, 'DOCENTE')
       RETURNING id_usuario INTO :id_usuario`,
      {
        nombre_usuario: datos.nombre_usuario,
        contrasena: contrasenaHasheada,
        id_usuario: { dir: db.oracledb.BIND_OUT, type: db.oracledb.NUMBER }
      },
      { autoCommit: false }
    );
    
    const id_usuario = resultUsuario.outBinds.id_usuario[0];
    
    // 2. Crear docente
    await connection.execute(
      `INSERT INTO docentes (id_usuario, nombres, apellidos, email, telefono, especialidad, fecha_contratacion)
       VALUES (:id_usuario, :nombres, :apellidos, :email, :telefono, :especialidad, :fecha_contratacion)`,
      {
        id_usuario: id_usuario,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        email: datos.email,
        telefono: datos.telefono || null,
        especialidad: datos.especialidad || null,
        fecha_contratacion: datos.fecha_contratacion ? new Date(datos.fecha_contratacion) : new Date()
      },
      { autoCommit: false }
    );
    
    await connection.commit();
    console.log(`✅ Docente creado: ${datos.nombres} ${datos.apellidos}`);
    return { success: true, message: 'Docente creado exitosamente', id_usuario };
  } catch (err) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Error en rollback:', rollbackErr);
      }
    }
    console.error('Error creando docente:', err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (closeErr) {
        console.error('Error cerrando conexión:', closeErr);
      }
    }
  }
}

// Editar docente
async function editarDocente(id_docente, datos) {
  try {
    let updates = [];
    let params = { id_docente };

    if (datos.nombres) {
      updates.push(`nombres = :nombres`);
      params.nombres = datos.nombres;
    }
    if (datos.apellidos) {
      updates.push(`apellidos = :apellidos`);
      params.apellidos = datos.apellidos;
    }
    if (datos.email) {
      updates.push(`email = :email`);
      params.email = datos.email;
    }
    if (datos.telefono !== undefined) {
      updates.push(`telefono = :telefono`);
      params.telefono = datos.telefono;
    }
    if (datos.especialidad !== undefined) {
      updates.push(`especialidad = :especialidad`);
      params.especialidad = datos.especialidad;
    }
    if (datos.fecha_contratacion) {
      updates.push(`fecha_contratacion = :fecha_contratacion`);
      params.fecha_contratacion = datos.fecha_contratacion;
    }
    if (datos.estado) {
      updates.push(`estado = :estado`);
      params.estado = datos.estado;
    }

    if (updates.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const query = `UPDATE docentes SET ${updates.join(', ')} WHERE id_docente = :id_docente`;
    await db.executeQuery(query, params);
    
    console.log(`✅ Docente editado: ${id_docente}`);
    return { success: true, message: 'Docente editado exitosamente' };
  } catch (err) {
    console.error('Error editando docente:', err);
    throw err;
  }
}

// Eliminar docente
async function eliminarDocente(id_docente) {
  try {
    await db.executeQuery(
      `DELETE FROM docentes WHERE id_docente = :id_docente`,
      { id_docente }
    );
    console.log(`✅ Docente eliminado: ${id_docente}`);
    return { success: true, message: 'Docente eliminado exitosamente' };
  } catch (err) {
    console.error('Error eliminando docente:', err);
    throw err;
  }
}

module.exports = {
  getUsuarios,
  getUsuarioById,
  crearUsuario,
  editarUsuario,
  eliminarUsuario,
  getAlumnos,
  crearAlumno,
  editarAlumno,
  eliminarAlumno,
  getCarreras,
  crearCarrera,
  editarCarrera,
  eliminarCarrera,
  getMaterias,
  crearMateria,
  editarMateria,
  eliminarMateria,
  getPeriodos,
  crearPeriodo,
  editarPeriodo,
  eliminarPeriodo,
  getGrupos,
  crearGrupo,
  getDocentes,
  crearDocente,
  editarDocente,
  eliminarDocente
};
