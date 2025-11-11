const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('../config/database');

// Login
async function login(req, res) {
  const { nombre_usuario, contrasena } = req.body;

  try {
    if (!nombre_usuario || !contrasena) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    // Buscar usuario en BD
    const usuario = await db.fetchOne(
      `SELECT id_usuario, nombre_usuario, contrasena, tipo_usuario, estado 
       FROM usuarios 
       WHERE nombre_usuario = :nombre_usuario AND estado = 'ACTIVO'`,
      { nombre_usuario }
    );

    if (!usuario) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Verificar contraseña (Oracle devuelve las columnas en MAYÚSCULAS)
    const esValida = await bcrypt.compare(contrasena, usuario.CONTRASENA);

    if (!esValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }

    // Actualizar último acceso
    await db.executeQuery(
      `UPDATE usuarios SET ultimo_acceso = SYSDATE WHERE id_usuario = :id`,
      { id: usuario.ID_USUARIO }
    );

    // Guardar en sesión
    req.session.usuario = {
      id: usuario.ID_USUARIO,
      nombre_usuario: usuario.NOMBRE_USUARIO,
      tipo_usuario: usuario.TIPO_USUARIO
    };

    console.log(`✅ Login exitoso: ${usuario.NOMBRE_USUARIO} (${usuario.TIPO_USUARIO})`);

    // Determinar redirección según tipo de usuario
    let redirectUrl = '/usuario/dashboard';
    if (usuario.TIPO_USUARIO === 'ADMIN') {
      redirectUrl = '/admin/dashboard';
    } else if (usuario.TIPO_USUARIO === 'ALUMNO') {
      redirectUrl = '/alumno/dashboard';
    } else if (usuario.TIPO_USUARIO === 'DOCENTE') {
      redirectUrl = '/docente/dashboard';
    }

    // Responder con JSON si es AJAX, sino redirigir
    if (req.headers['content-type'] === 'application/json') {
      res.json({ 
        success: true, 
        redirect: redirectUrl,
        usuario: {
          nombre: usuario.NOMBRE_USUARIO,
          tipo: usuario.TIPO_USUARIO
        }
      });
    } else {
      res.redirect(redirectUrl);
    }
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error en el servidor. Intente nuevamente.' });
  }
}

// Logout
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('❌ Error al desloguear:', err);
      res.status(500).send('Error al cerrar sesión');
    } else {
      res.redirect('/login');
    }
  });
}

// Registrar usuario (solo admin)
async function registrarUsuario(req, res) {
  const { nombre_usuario, contrasena, tipo_usuario } = req.body;

  try {
    if (!nombre_usuario || !contrasena || !tipo_usuario) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Hashear contraseña
    const contrasenaHasheada = await bcrypt.hash(contrasena, 10);

    // Insertar en BD
    const result = await db.executeQuery(
      `INSERT INTO usuarios (nombre_usuario, contrasena, tipo_usuario) 
       VALUES (:nombre_usuario, :contrasena, :tipo_usuario)`,
      {
        nombre_usuario,
        contrasena: contrasenaHasheada,
        tipo_usuario
      }
    );

    console.log(`✅ Usuario creado: ${nombre_usuario}`);
    res.status(201).json({ success: true, message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('❌ Error registrando usuario:', err);
    if (err.errorNum === 1) {
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      res.status(500).json({ error: 'Error al registrar usuario' });
    }
  }
}

module.exports = {
  login,
  logout,
  registrarUsuario
};
