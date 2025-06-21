const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Conexão com MySQL

// Rota para cadastrar curso
router.post('/', (req, res) => {
    const { nome, descricao } = req.body;

    const sql = 'INSERT INTO cursos (nome, descricao) VALUES (?, ?)';
    db.query(sql, [nome, descricao], (err, result) => {
        if (err) {
            console.error('Erro ao inserir curso:', err);
            return res.status(500).json({ erro: 'Erro ao cadastrar curso' });
        }
        res.status(201).json({ mensagem: 'Curso cadastrado com sucesso!', id: result.insertId });
    });
});

// Rota para listar cursos
router.get('/', (req, res) => {
    const sql = 'SELECT * FROM cursos';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao buscar cursos:', err);
            return res.status(500).json({ erro: 'Erro ao buscar cursos' });
        }
        res.status(200).json(results);
    });
});

module.exports = router;
