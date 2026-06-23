require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const jogoRoutes = require('./routes/jogoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/auth', authRoutes);
app.use('/users', usuarioRoutes);
app.use('/games', jogoRoutes);

// Rota raiz de verificação
app.get('/', (req, res) => {
  res.json({ message: 'API Campo Minado - Online 💣' });
});

// Middleware de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
