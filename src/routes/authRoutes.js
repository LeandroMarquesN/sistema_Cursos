const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const bcrypt = require('bcryptjs');
const { criarUsuario, buscarPorEmail } = require('../models/User');

// Rota de login delegada ao controller
router.post('/login', authController.login);

// Rota de cadastro 
router.post('/register', async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    try {
        const senhaHash = await bcrypt.hash(senha, 10);

        // Usando o objeto para criar usuário, conforme User.js refatorado
        const novoUsuario = await criarUsuario({
            nome,
            email,
            senha: senhaHash,
            tipo
        });

        res.status(201).json({ message: 'Usuário criado com sucesso', user: novoUsuario });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
