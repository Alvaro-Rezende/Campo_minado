const db = require('../config/database');

async function criar(idUsuario, valorAposta, tabuleiro) {
  const result = await db.query(
    `INSERT INTO jogos (id_usuario, valor_aposta, tabuleiro, posicoes_reveladas, diamantes_encontrados, premio_atual, status)
     VALUES ($1, $2, $3, '[]', 0, 0, 'EM_ANDAMENTO')
     RETURNING *`,
    [idUsuario, valorAposta, JSON.stringify(tabuleiro)]
  );
  return result.rows[0];
}

async function buscarPorId(id) {
  const result = await db.query(
    'SELECT * FROM jogos WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function buscarEmAndamentoPorUsuario(idUsuario) {
  const result = await db.query(
    `SELECT * FROM jogos WHERE id_usuario = $1 AND status = 'EM_ANDAMENTO'`,
    [idUsuario]
  );
  return result.rows[0] || null;
}

async function atualizarJogo(id, posicoesReveladas, diamantesEncontrados, premioAtual, status) {
  const result = await db.query(
    `UPDATE jogos
     SET posicoes_reveladas = $1,
         diamantes_encontrados = $2,
         premio_atual = $3,
         status = $4,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $5
     RETURNING *`,
    [JSON.stringify(posicoesReveladas), diamantesEncontrados, premioAtual, status, id]
  );
  return result.rows[0] || null;
}

async function finalizarJogo(id, premioFinal, status) {
  const result = await db.query(
    `UPDATE jogos
     SET premio_atual = $1,
         status = $2,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $3
     RETURNING *`,
    [premioFinal, status, id]
  );
  return result.rows[0] || null;
}

module.exports = {
  criar,
  buscarPorId,
  buscarEmAndamentoPorUsuario,
  atualizarJogo,
  finalizarJogo,
};
