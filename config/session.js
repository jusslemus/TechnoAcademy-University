const session = require('express-session');

const sessionConfig = session.session({
  secret: process.env.SESSION_SECRET || 'clave_temporal_cambiar',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Cambiar a true en producción con HTTPS
    httpOnly: true,
    maxAge: 3600000 // 1 hora
  }
});

module.exports = sessionConfig;
