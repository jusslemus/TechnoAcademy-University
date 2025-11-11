// Verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.redirect('/login');
  }
}

// Verificar si es ADMIN
function isAdmin(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo_usuario === 'ADMIN') {
    next();
  } else {
    res.status(403).send('Acceso denegado. Solo administradores.');
  }
}

// Verificar si es ALUMNO
function isAlumno(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo_usuario === 'ALUMNO') {
    next();
  } else {
    res.status(403).send('Acceso denegado. Solo alumnos.');
  }
}

// Verificar si es DOCENTE
function isDocente(req, res, next) {
  if (req.session && req.session.usuario && req.session.usuario.tipo_usuario === 'DOCENTE') {
    next();
  } else {
    res.status(403).send('Acceso denegado. Solo docentes.');
  }
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isAlumno,
  isDocente
};
