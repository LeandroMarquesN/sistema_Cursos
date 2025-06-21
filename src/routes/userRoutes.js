const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota de exemplo
router.get('/test', userController.test);

module.exports = router;
