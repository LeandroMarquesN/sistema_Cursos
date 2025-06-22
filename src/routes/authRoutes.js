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

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existente = await buscarPorEmail(email);
        if (existente) {
            return res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await criarUsuario({ nome, email, senha: senhaHash, tipo });

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            user: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                tipo: novoUsuario.tipo
            }
        });
    } catch (err) {
        console.error('Erro ao registrar usuário:', err);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
});

module.exports = router;
