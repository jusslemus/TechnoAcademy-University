const express = require('express');
const router = express.Router();
const path = require('path');

// Dashboard Usuario
router.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/usuario/dashboard.html'));
});

module.exports = router;
