// controllers/authController.js
// Login local sin base de datos - Modo portafolio

// Usuarios hardcodeados para demostración
const USUARIOS = [
  {
    id: 1,
    nombre_usuario: 'admin',
    contrasena: 'admin',
    tipo_usuario: 'ADMIN',
    nombre: 'Administrador'
  },
  {
    id: 2,
    nombre_usuario: 'alumno',
    contrasena: 'alumno',
    tipo_usuario: 'ALUMNO',
    nombre: 'Carlos González'
  },
  {
    id: 3,
    nombre_usuario: 'docente',
    contrasena: 'docente',
    tipo_usuario: 'DOCENTE',
    nombre: 'María López'
  }
];

exports.login = async (req, res) => {
  try {
    const username = req.body.username || req.body.nombre_usuario || req.body.user;
    const password = req.body.password || req.body.contrasena || req.body.pass;
    // Buscar usuario en la lista local
    const usuario = USUARIOS.find(
      u => u.nombre_usuario === username && u.contrasena === password
    );

    if (!usuario) {
      return res.status(401).json({
        success: false,
        error: 'Usuario o contraseña incorrectos'
      });
    }

    // Crear sesión
    req.session.usuario = {
      id: usuario.id,
      nombre_usuario: usuario.nombre_usuario,
      tipo_usuario: usuario.tipo_usuario,
      nombre: usuario.nombre
    };

    // Redirigir según tipo
    const tipo = usuario.tipo_usuario.toLowerCase();
    const redirects = {
      admin: '/admin/dashboard',
      alumno: '/alumno/dashboard',
      docente: '/docente/dashboard'
    };

    res.json({
      success: true,
      redirect: redirects[tipo] || '/usuario/dashboard'
    });

  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ success: false, error: 'Error en el servidor' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
};

exports.registrarUsuario = (req, res) => {
  res.json({
    success: true,
    message: 'Registro desactivado en modo portafolio'
  });
};