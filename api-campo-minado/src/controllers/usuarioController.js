const usuarioService = require('../services/usuarioService');

async function buscarPorId(req, res) {
  try {
    const { id } = req.params;
    const usuario = await usuarioService.buscarPorId(parseInt(id));
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function dashboard(req, res) {
  try {
    const { id } = req.params;
    const stats = await usuarioService.buscarDashboard(parseInt(id));
    return res.status(200).json(stats);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function atualizarSaldo(req, res) {
  try {
    const { id } = req.params;
    const { saldo } = req.body;
    const usuario = await usuarioService.atualizarSaldo(parseInt(id), saldo);
    return res.status(200).json(usuario);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;
    const resultado = await usuarioService.excluir(parseInt(id));
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

module.exports = { buscarPorId, dashboard, atualizarSaldo, excluir };
