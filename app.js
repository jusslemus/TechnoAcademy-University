require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');

// Middleware de autenticación
const { isAuthenticated, isAdmin, isAlumno, isDocente } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Inicializar BD (no bloquear si hay error)
db.initializeDB().catch(err => {
  console.error('❌ Advertencia: Error inicializando BD:', err.message);
  console.error('   Verifica que Oracle esté corriendo y las credenciales sean correctas');
});

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave_temporal_cambiar_en_produccion',
  resave: false,
  saveUninitialized: true,
 cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000 // 1 hora
  }
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'Servidor funcionando correctamente' });
});

// Rutas públicas
app.use('/', require('./routes/auth'));

// Rutas protegidas - Admin
app.use('/admin', isAuthenticated, isAdmin, require('./routes/admin'));

// Rutas protegidas - Alumno
app.use('/alumno', isAuthenticated, isAlumno, require('./routes/alumno'));

// Rutas protegidas - Docente
app.use('/docente', isAuthenticated, isDocente, require('./routes/docente'));

// Rutas protegidas - Usuario general
app.use('/usuario', isAuthenticated, require('./routes/usuario'));

// Página de inicio
app.get('/', (req, res) => {
  if (req.session && req.session.usuario) {
    const tipo = req.session.usuario.tipo_usuario.toLowerCase();
    // Redirigir según tipo de usuario
    if (tipo === 'admin') {
      res.redirect('/admin/dashboard');
    } else if (tipo === 'alumno') {
      res.redirect('/alumno/dashboard');
    } else if (tipo === 'docente') {
      res.redirect('/docente/dashboard');
    } else {
      res.redirect('/usuario/dashboard');
    }
  } else {
    res.redirect('/login');
  }
});

// Error 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Error en el servidor' 
      : err.message
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`
  ╔═══════════════════════════════════════════╗
  ║  🎓 TECHNOACADEMY UNIVERSITY              ║
  ║  Sistema de Registro Académico            ║
  ║                                           ║
  ║  🚀 Servidor ejecutándose en:             ║
  ║  http://localhost:${PORT}                  ║
  ║                                           ║
  ║  📝 Accede a: http://localhost:${PORT}/login    ║
  ╚═══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📍 SIGTERM recibido, cerrando servidor...');
  server.close(async () => {
    await db.closePool();
    process.exit(0);
  });
});

module.exports = app;
