const db = require('../config/db');

function buscarPorEmail(email) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return resolve(null);
            resolve(results[0]);
        });
    });
}

// Refatorado: agora recebe um objeto e retorna os dados inseridos
function criarUsuario({ nome, email, senha, tipo }) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users (nome, email, senha, tipo, criado_em) VALUES (?, ?, ?, ?, NOW())';
        db.query(sql, [nome, email, senha, tipo], (err, result) => {
            if (err) return reject(err);

            // Retorna os dados do usuário recém-cadastrado
            resolve({
                id: result.insertId,
                nome,
                email,
                tipo
            });
        });
    });
}

module.exports = { buscarPorEmail, criarUsuario };
