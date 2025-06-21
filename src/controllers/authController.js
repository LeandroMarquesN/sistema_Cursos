const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { buscarPorEmail, criarUsuario } = require('../models/User');

// LOGIN
exports.login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
        const user = await buscarPorEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
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

// CADASTRO
exports.cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const usuarioExistente = await buscarPorEmail(email);
        if (usuarioExistente) {
            return res.status(400).json({ error: 'E-mail já está cadastrado.' });
        }

        const senhaHash = await bcrypt.hash(senha, 10);
        const novoUsuario = await criarUsuario({ nome, email, senha: senhaHash, tipo });

        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                tipo: novoUsuario.tipo
            }
        });
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
    }
};
