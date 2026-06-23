const authService = require('../services/authService');

async function register(req, res) {
  try {
    const { nome, email, dataNascimento, senha, confirmacaoSenha } = req.body;
    const usuario = await authService.registrar(nome, email, dataNascimento, senha, confirmacaoSenha);
    return res.status(201).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    const dados = await authService.login(email, senha);
    return res.status(200).json(dados);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function resetPassword(req, res) {
  try {
    const { id, novaSenha } = req.body;
    const resultado = await authService.redefinirSenha(id, novaSenha);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

module.exports = { register, login, resetPassword };
