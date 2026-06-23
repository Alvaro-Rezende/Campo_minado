const jogoRepository = require('../repositories/jogoRepository');
const usuarioRepository = require('../repositories/usuarioRepository');
const { gerarTabuleiro, calcularPremio, posicaoValida } = require('../modules/tabuleiro');

async function iniciarJogo(idUsuario, valorAposta) {
  if (!idUsuario || !valorAposta) {
    throw { status: 400, message: 'ID do usuário e valor da aposta são obrigatórios.' };
  }

  if (isNaN(valorAposta) || valorAposta <= 0) {
    throw { status: 400, message: 'O valor da aposta deve ser maior que zero.' };
  }

  // Verificar se usuário existe
  const usuario = await usuarioRepository.buscarPorId(idUsuario);
  if (!usuario) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  // Verificar se usuário já tem partida em andamento
  const partidaAtiva = await jogoRepository.buscarEmAndamentoPorUsuario(idUsuario);
  if (partidaAtiva) {
    throw {
      status: 409,
      message: 'Você possui uma partida em andamento. Conclua-a antes de iniciar uma nova.',
    };
  }

  // Validar saldo suficiente
  const saldoAtual = parseFloat(usuario.saldo);
  if (saldoAtual < valorAposta) {
    throw { status: 400, message: 'Saldo insuficiente para realizar a aposta.' };
  }

  // Debitar aposta do saldo
  await usuarioRepository.debitarSaldo(idUsuario, valorAposta);

  // Criar tabuleiro
  const tabuleiro = gerarTabuleiro();

  // Criar jogo
  const jogo = await jogoRepository.criar(idUsuario, valorAposta, tabuleiro);

  return { gameId: jogo.id };
}

async function revelarPosicao(gameId, linha, coluna) {
  if (!gameId) {
    throw { status: 400, message: 'ID do jogo é obrigatório.' };
  }

  // Validar coordenadas
  if (!posicaoValida(linha, coluna)) {
    throw {
      status: 400,
      message: 'Posição inválida. Linha e coluna devem estar entre 0 e 4.',
    };
  }

  const jogo = await jogoRepository.buscarPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado.' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Este jogo já foi encerrado.' };
  }

  // Verificar se posição já foi revelada
  const posicoesReveladas = jogo.posicoes_reveladas;
  const jaRevelada = posicoesReveladas.some(
    (pos) => pos.linha === linha && pos.coluna === coluna
  );

  if (jaRevelada) {
    throw {
      status: 400,
      message: 'Posição já revelada. Por favor, escolha outra posição.',
    };
  }

  // Verificar conteúdo da posição
  const tabuleiro = jogo.tabuleiro;
  const conteudo = tabuleiro[linha][coluna];

  // Registrar posição revelada
  const novasPosicoesReveladas = [...posicoesReveladas, { linha, coluna, conteudo }];

  if (conteudo === 'BOMBA') {
    // Jogador perdeu
    await jogoRepository.atualizarJogo(
      gameId,
      novasPosicoesReveladas,
      jogo.diamantes_encontrados,
      0,
      'PERDIDO'
    );

    return {
      resultado: 'BOMBA',
      status: 'PERDIDO',
    };
  }

  // Diamante encontrado
  const novosDiamantes = jogo.diamantes_encontrados + 1;
  const novoPremio = calcularPremio(parseFloat(jogo.valor_aposta), novosDiamantes);

  await jogoRepository.atualizarJogo(
    gameId,
    novasPosicoesReveladas,
    novosDiamantes,
    novoPremio,
    'EM_ANDAMENTO'
  );

  return {
    resultado: 'DIAMANTE',
    diamantesEncontrados: novosDiamantes,
    premioAtual: novoPremio,
  };
}

async function cashout(gameId) {
  if (!gameId) {
    throw { status: 400, message: 'ID do jogo é obrigatório.' };
  }

  const jogo = await jogoRepository.buscarPorId(gameId);
  if (!jogo) {
    throw { status: 404, message: 'Jogo não encontrado.' };
  }

  if (jogo.status !== 'EM_ANDAMENTO') {
    throw { status: 400, message: 'Este jogo já foi encerrado.' };
  }

  if (jogo.diamantes_encontrados === 0) {
    throw { status: 400, message: 'Você precisa encontrar pelo menos um diamante para sacar.' };
  }

  const premioFinal = parseFloat(jogo.premio_atual);

  // Finalizar jogo
  await jogoRepository.finalizarJogo(gameId, premioFinal, 'GANHO');

  // Creditar saldo ao usuário
  await usuarioRepository.creditarSaldo(jogo.id_usuario, premioFinal);

  return {
    message: 'Saque realizado com sucesso!',
    premioFinal,
    diamantesEncontrados: jogo.diamantes_encontrados,
  };
}

module.exports = { iniciarJogo, revelarPosicao, cashout };
