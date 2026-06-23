const usuarioRepository = require('../repositories/usuarioRepository');

async function buscarPorId(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }
  return {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    saldo: parseFloat(usuario.saldo),
  };
}

async function buscarDashboard(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  const stats = await usuarioRepository.buscarEstatisticas(id);
  return {
    totalJogos: parseInt(stats.totalJogos),
    vitorias: parseInt(stats.vitorias),
    derrotas: parseInt(stats.derrotas),
    valorGanho: parseFloat(stats.valorGanho),
    valorPerdido: parseFloat(stats.valorPerdido),
  };
}

async function atualizarSaldo(id, saldo) {
  if (saldo === undefined || saldo === null) {
    throw { status: 400, message: 'O campo saldo é obrigatório.' };
  }

  if (isNaN(saldo) || saldo < 0) {
    throw { status: 400, message: 'Não é permitido cadastrar saldo negativo.' };
  }

  // Limitar a duas casas decimais
  const saldoFormatado = parseFloat(parseFloat(saldo).toFixed(2));

  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  const atualizado = await usuarioRepository.atualizarSaldo(id, saldoFormatado);
  return {
    id: atualizado.id,
    nome: atualizado.nome,
    email: atualizado.email,
    saldo: parseFloat(atualizado.saldo),
  };
}

async function excluir(id) {
  const usuario = await usuarioRepository.buscarPorId(id);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  await usuarioRepository.excluir(id);
  return { message: 'Usuário excluído com sucesso.' };
}

module.exports = { buscarPorId, buscarDashboard, atualizarSaldo, excluir };
