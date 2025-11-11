const express = require('express');
const router = express.Router();
const path = require('path');
const adminModel = require('../models/adminModel');

// ============ VISTAS HTML ============

// Dashboard Admin
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/dashboard.html'));
});

// Usuarios (deprecated - mantener por compatibilidad)
router.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/usuarios.html'));
});

// Alumnos
router.get('/alumnos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/alumnos.html'));
});

// Docentes
router.get('/docentes', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/docentes.html'));
});

// Carreras
router.get('/carreras', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/carreras.html'));
});

// Materias
router.get('/materias', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/materias.html'));
});

// Períodos Académicos
router.get('/periodos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/periodos.html'));
});

// Grupos (deshabilitado por ahora)
// router.get('/grupos', (req, res) => {
//   res.sendFile(path.join(__dirname, '../views/admin/grupos.html'));
// });

// Notas
router.get('/notas', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/notas.html'));
});

// Pagos
router.get('/pagos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/admin/pagos.html'));
});

// ============ APIs ============

// ---- USUARIOS ----
router.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await adminModel.getUsuarios();
    res.json(usuarios);
  } catch (err) {
    console.error('Error obteniendo usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

router.post('/api/usuarios/crear', async (req, res) => {
  try {
    const { nombre_usuario, contrasena, tipo_usuario } = req.body;
    
    if (!nombre_usuario || !contrasena || !tipo_usuario) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    const resultado = await adminModel.crearUsuario({
      nombre_usuario,
      contrasena,
      tipo_usuario
    });

    res.json({ success: true, id_usuario: resultado.id_usuario });
  } catch (err) {
    console.error('Error creando usuario:', err);
    if (err.errorNum === 1) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  }
});

router.put('/api/usuarios/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nombre_usuario, contrasena, tipo_usuario } = req.body;

    if (!nombre_usuario && !contrasena && !tipo_usuario) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarUsuario(id_usuario, { nombre_usuario, contrasena, tipo_usuario });
    res.json({ success: true, message: 'Usuario editado exitosamente' });
  } catch (err) {
    console.error('Error editando usuario:', err);
    res.status(500).json({ error: 'Error al editar usuario' });
  }
});

router.delete('/api/usuarios/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;
    await adminModel.eliminarUsuario(id_usuario);
    res.json({ success: true, message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error eliminando usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// ---- CARRERAS ----
router.get('/api/carreras', async (req, res) => {
  try {
    const carreras = await adminModel.getCarreras();
    res.json(carreras);
  } catch (err) {
    console.error('Error obteniendo carreras:', err);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
});

router.post('/api/carreras/crear', async (req, res) => {
  try {
    const { nombre_carrera, codigo_carrera, duracion_semestres, descripcion } = req.body;
    
    if (!nombre_carrera || !codigo_carrera || !duracion_semestres) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    await adminModel.crearCarrera({
      nombre_carrera,
      codigo_carrera,
      duracion_semestres,
      descripcion
    });

    res.json({ success: true, message: 'Carrera creada exitosamente' });
  } catch (err) {
    console.error('Error creando carrera:', err);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
});

router.put('/api/carreras/:id_carrera', async (req, res) => {
  try {
    const { id_carrera } = req.params;
    const { nombre_carrera, codigo_carrera, duracion_semestres, descripcion } = req.body;

    if (!nombre_carrera && !codigo_carrera && !duracion_semestres && !descripcion) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarCarrera(id_carrera, { nombre_carrera, codigo_carrera, duracion_semestres, descripcion });
    res.json({ success: true, message: 'Carrera editada exitosamente' });
  } catch (err) {
    console.error('Error editando carrera:', err);
    res.status(500).json({ error: 'Error al editar carrera' });
  }
});

router.delete('/api/carreras/:id_carrera', async (req, res) => {
  try {
    const { id_carrera } = req.params;
    await adminModel.eliminarCarrera(id_carrera);
    res.json({ success: true, message: 'Carrera eliminada exitosamente' });
  } catch (err) {
    console.error('Error eliminando carrera:', err);
    res.status(500).json({ error: 'Error al eliminar carrera' });
  }
});

// ---- MATERIAS ----
router.get('/api/materias', async (req, res) => {
  try {
    const materias = await adminModel.getMaterias();
    res.json(materias);
  } catch (err) {
    console.error('Error obteniendo materias:', err);
    res.status(500).json({ error: 'Error al obtener materias' });
  }
});

router.post('/api/materias/crear', async (req, res) => {
  try {
    const { nombre_materia, codigo_materia, creditos, horas_teoricas, horas_practicas } = req.body;
    
    if (!nombre_materia || !codigo_materia || !creditos) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    await adminModel.crearMateria({
      nombre_materia,
      codigo_materia,
      creditos,
      horas_teoricas: horas_teoricas || 0,
      horas_practicas: horas_practicas || 0
    });

    res.json({ success: true, message: 'Materia creada exitosamente' });
  } catch (err) {
    console.error('Error creando materia:', err);
    res.status(500).json({ error: 'Error al crear materia' });
  }
});

router.put('/api/materias/:id_materia', async (req, res) => {
  try {
    const { id_materia } = req.params;
    const { nombre_materia, codigo_materia, creditos, horas_teoricas, horas_practicas, id_carrera } = req.body;

    if (!nombre_materia && !codigo_materia && !creditos && !horas_teoricas && !horas_practicas && !id_carrera) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarMateria(id_materia, { nombre_materia, codigo_materia, creditos, horas_teoricas, horas_practicas, id_carrera });
    res.json({ success: true, message: 'Materia editada exitosamente' });
  } catch (err) {
    console.error('Error editando materia:', err);
    res.status(500).json({ error: 'Error al editar materia' });
  }
});

router.delete('/api/materias/:id_materia', async (req, res) => {
  try {
    const { id_materia } = req.params;
    await adminModel.eliminarMateria(id_materia);
    res.json({ success: true, message: 'Materia eliminada exitosamente' });
  } catch (err) {
    console.error('Error eliminando materia:', err);
    res.status(500).json({ error: 'Error al eliminar materia' });
  }
});

// ---- PERÍODOS ACADÉMICOS ----
router.get('/api/periodos', async (req, res) => {
  try {
    const periodos = await adminModel.getPeriodos();
    res.json(periodos);
  } catch (err) {
    console.error('Error obteniendo períodos:', err);
    res.status(500).json({ error: 'Error al obtener períodos' });
  }
});

router.post('/api/periodos/crear', async (req, res) => {
  try {
    const { nombre_periodo, fecha_inicio, fecha_fin, fecha_inicio_inscripcion, fecha_fin_inscripcion } = req.body;
    
    if (!nombre_periodo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    await adminModel.crearPeriodo({
      nombre_periodo,
      fecha_inicio,
      fecha_fin,
      fecha_inicio_inscripcion,
      fecha_fin_inscripcion
    });

    res.json({ success: true, message: 'Período creado exitosamente' });
  } catch (err) {
    console.error('Error creando período:', err);
    res.status(500).json({ error: 'Error al crear período' });
  }
});

router.put('/api/periodos/:id_periodo', async (req, res) => {
  try {
    const { id_periodo } = req.params;
    const { nombre_periodo, fecha_inicio, fecha_fin } = req.body;

    if (!nombre_periodo && !fecha_inicio && !fecha_fin) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarPeriodo(id_periodo, { nombre_periodo, fecha_inicio, fecha_fin });
    res.json({ success: true, message: 'Período editado exitosamente' });
  } catch (err) {
    console.error('Error editando período:', err);
    res.status(500).json({ error: 'Error al editar período' });
  }
});

router.delete('/api/periodos/:id_periodo', async (req, res) => {
  try {
    const { id_periodo } = req.params;
    await adminModel.eliminarPeriodo(id_periodo);
    res.json({ success: true, message: 'Período eliminado exitosamente' });
  } catch (err) {
    console.error('Error eliminando período:', err);
    res.status(500).json({ error: 'Error al eliminar período' });
  }
});

// ---- GRUPOS ----
// Solo lectura - no crear/editar/eliminar de momento
router.get('/api/grupos', async (req, res) => {
  try {
    const grupos = await adminModel.getGrupos();
    res.json(grupos);
  } catch (err) {
    console.error('Error obteniendo grupos:', err);
    res.status(500).json({ error: 'Error al obtener grupos' });
  }
});

// ---- ALUMNOS ----
router.get('/api/alumnos', async (req, res) => {
  try {
    const alumnos = await adminModel.getAlumnos();
    res.json(alumnos);
  } catch (err) {
    console.error('Error obteniendo alumnos:', err);
    res.status(500).json({ error: 'Error al obtener alumnos' });
  }
});

router.post('/api/alumnos/crear', async (req, res) => {
  try {
    const { nombre_usuario, contrasena, carnet, nombres, apellidos, email, telefono, fecha_nacimiento, direccion, carrera } = req.body;
    
    if (!nombre_usuario || !contrasena || !carnet || !nombres || !apellidos || !email) {
      return res.status(400).json({ error: 'Campos requeridos: nombre_usuario, contrasena, carnet, nombres, apellidos, email' });
    }

    const resultado = await adminModel.crearAlumno({
      nombre_usuario,
      contrasena,
      carnet,
      nombres,
      apellidos,
      email,
      telefono,
      fecha_nacimiento,
      direccion,
      carrera
    });

    res.json({ success: true, message: 'Alumno creado exitosamente', id_usuario: resultado.id_usuario });
  } catch (err) {
    console.error('Error creando alumno:', err);
    if (err.errorNum === 1) {
      res.status(400).json({ error: 'El carnet, usuario o email ya existe' });
    } else {
      res.status(500).json({ error: 'Error al crear alumno' });
    }
  }
});

router.put('/api/alumnos/:id_alumno', async (req, res) => {
  try {
    const { id_alumno } = req.params;
    const { carnet, nombres, apellidos, email, telefono, fecha_nacimiento, direccion, carrera, estado } = req.body;

    if (!carnet && !nombres && !apellidos && !email && !telefono && !fecha_nacimiento && !direccion && !carrera && !estado) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarAlumno(id_alumno, { carnet, nombres, apellidos, email, telefono, fecha_nacimiento, direccion, carrera, estado });
    res.json({ success: true, message: 'Alumno editado exitosamente' });
  } catch (err) {
    console.error('Error editando alumno:', err);
    res.status(500).json({ error: 'Error al editar alumno' });
  }
});

router.delete('/api/alumnos/:id_alumno', async (req, res) => {
  try {
    const { id_alumno } = req.params;
    await adminModel.eliminarAlumno(id_alumno);
    res.json({ success: true, message: 'Alumno eliminado exitosamente' });
  } catch (err) {
    console.error('Error eliminando alumno:', err);
    res.status(500).json({ error: 'Error al eliminar alumno' });
  }
});

// ---- DOCENTES ----
router.get('/api/docentes', async (req, res) => {
  try {
    const docentes = await adminModel.getDocentes();
    res.json(docentes);
  } catch (err) {
    console.error('Error obteniendo docentes:', err);
    res.status(500).json({ error: 'Error al obtener docentes' });
  }
});

router.post('/api/docentes/crear', async (req, res) => {
  try {
    const { nombre_usuario, contrasena, nombres, apellidos, email, telefono, especialidad, fecha_contratacion } = req.body;
    
    if (!nombre_usuario || !contrasena || !nombres || !apellidos || !email) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    const resultado = await adminModel.crearDocente({
      nombre_usuario,
      contrasena,
      nombres,
      apellidos,
      email,
      telefono,
      especialidad,
      fecha_contratacion
    });

    res.json({ success: true, message: 'Docente creado exitosamente', id_usuario: resultado.id_usuario });
  } catch (err) {
    console.error('Error creando docente:', err);
    if (err.errorNum === 1) {
      res.status(400).json({ error: 'El usuario o email ya existe' });
    } else {
      res.status(500).json({ error: 'Error al crear docente' });
    }
  }
});

router.put('/api/docentes/:id_docente', async (req, res) => {
  try {
    const { id_docente } = req.params;
    const { nombres, apellidos, email, telefono, especialidad, fecha_contratacion, estado } = req.body;

    if (!nombres && !apellidos && !email && !telefono && !especialidad && !fecha_contratacion && !estado) {
      return res.status(400).json({ error: 'Al menos un campo es requerido' });
    }

    await adminModel.editarDocente(id_docente, { nombres, apellidos, email, telefono, especialidad, fecha_contratacion, estado });
    res.json({ success: true, message: 'Docente editado exitosamente' });
  } catch (err) {
    console.error('Error editando docente:', err);
    res.status(500).json({ error: 'Error al editar docente' });
  }
});

router.delete('/api/docentes/:id_docente', async (req, res) => {
  try {
    const { id_docente } = req.params;
    await adminModel.eliminarDocente(id_docente);
    res.json({ success: true, message: 'Docente eliminado exitosamente' });
  } catch (err) {
    console.error('Error eliminando docente:', err);
    res.status(500).json({ error: 'Error al eliminar docente' });
  }
});

// ---- NOTAS ----
router.get('/api/notas/grupo/:id_grupo', async (req, res) => {
  try {
    const { id_grupo } = req.params;
    // Aquí implementaremos la lógica para obtener notas por grupo
    res.json({ message: 'Notas del grupo' });
  } catch (err) {
    console.error('Error obteniendo notas:', err);
    res.status(500).json({ error: 'Error al obtener notas' });
  }
});

router.put('/api/notas/:id_evaluacion', async (req, res) => {
  try {
    const { id_evaluacion } = req.params;
    const { nota_final, estado } = req.body;
    // Aquí implementaremos la lógica para actualizar notas
    res.json({ success: true, message: 'Nota actualizada' });
  } catch (err) {
    console.error('Error actualizando nota:', err);
    res.status(500).json({ error: 'Error al actualizar nota' });
  }
});

// ---- PAGOS ----
router.get('/api/pagos', async (req, res) => {
  try {
    // Aquí implementaremos la lógica para obtener pagos
    res.json({ message: 'Pagos del sistema' });
  } catch (err) {
    console.error('Error obteniendo pagos:', err);
    res.status(500).json({ error: 'Error al obtener pagos' });
  }
});

router.post('/api/pagos/registrar', async (req, res) => {
  try {
    const { id_alumno, monto, metodo_pago, numero_referencia } = req.body;
    
    if (!id_alumno || !monto) {
      return res.status(400).json({ error: 'Campos requeridos' });
    }

    // Aquí implementaremos la lógica para registrar pagos
    res.json({ success: true, message: 'Pago registrado exitosamente' });
  } catch (err) {
    console.error('Error registrando pago:', err);
    res.status(500).json({ error: 'Error al registrar pago' });
  }
});

module.exports = router;
