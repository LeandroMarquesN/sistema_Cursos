const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth'); // Proteção por token
const db = require('../config/db');

// Listar todos os cursos
router.get('/', verificarToken, (req, res) => {
    db.query('SELECT * FROM cursos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Erro ao buscar cursos' });
        res.json(results);
    });
});

// Criar novo curso
router.post('/', verificarToken, (req, res) => {
    const { nome, descricao } = req.body;
    if (!nome || !descricao) {
        return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
    }

    const sql = 'INSERT INTO cursos (nome, descricao) VALUES (?, ?)';
    db.query(sql, [nome, descricao], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erro ao criar curso' });
        res.status(201).json({ message: 'Curso criado com sucesso!', id: result.insertId });
    });
});

module.exports = router;
