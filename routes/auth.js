const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../controllers/authController');

// Vista login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/usuario/login.html'));
});

// POST login
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

// Registrar (protegido por admin)
router.post('/registrar', authController.registrarUsuario);

module.exports = router;
