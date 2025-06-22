const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buscarPorEmail, criarUsuario } = require('../models/User');

// LOGIN
exports.login = async (req, res) => {
    const { email, senha, tipo } = req.body;

    if (!email || !senha || !tipo) {
        return res.status(400).json({ error: 'E-mail, senha e tipo são obrigatórios.' });
    }

    try {
        const user = await buscarPorEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        // Valida tipo de usuário
        if (user.tipo !== tipo) {
            return res.status(403).json({ error: 'Acesso negado para este tipo de usuário.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ error: 'Senha incorreta.' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, tipo: user.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        return res.status(200).json({
            token,
            nome: user.nome,
            tipo: user.tipo
        });
    } catch (err) {
        console.error('Erro no login:', err);
        return res.status(500).json({ error: 'Erro no servidor.' });
    }
};
