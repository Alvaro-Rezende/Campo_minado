const jogoService = require('../services/jogoService');

async function iniciarJogo(req, res) {
  try {
    const { idUser, valorAposta } = req.body;
    const resultado = await jogoService.iniciarJogo(idUser, valorAposta);
    return res.status(201).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function revelarPosicao(req, res) {
  try {
    const { gameId } = req.params;
    const { linha, coluna } = req.body;
    const resultado = await jogoService.revelarPosicao(parseInt(gameId), linha, coluna);
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

async function cashout(req, res) {
  try {
    const { gameId } = req.params;
    const resultado = await jogoService.cashout(parseInt(gameId));
    return res.status(200).json(resultado);
  } catch (err) {
    return res.status(err.status || 500).json({ message: err.message || 'Erro interno do servidor.' });
  }
}

module.exports = { iniciarJogo, revelarPosicao, cashout };
