const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
require('./src/config/db'); // Conexão com o banco

const app = express(); // ⬅️ Cria a instância do app AQUI

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (como HTML, CSS, JS)
// Ajuste conforme a pasta onde estão seus HTMLs
app.use(express.static(path.join(__dirname, 'src/pages')));

// Rotas da API
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const cursoRoutes = require('./src/routes/cursoRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cursos', cursoRoutes);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
