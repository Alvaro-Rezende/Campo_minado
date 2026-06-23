const db = require('../config/database');

async function criar(nome, email, dataNascimento, senhaHash) {
  const result = await db.query(
    `INSERT INTO usuarios (nome, email, data_nascimento, senha)
     VALUES ($1, $2, $3, $4)
     RETURNING id, nome, email, data_nascimento, saldo`,
    [nome, email, dataNascimento, senhaHash]
  );
  return result.rows[0];
}

async function buscarPorEmail(email) {
  const result = await db.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function buscarPorId(id) {
  const result = await db.query(
    'SELECT id, nome, email, data_nascimento, saldo FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function buscarSenhaPorId(id) {
  const result = await db.query(
    'SELECT senha FROM usuarios WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
}

async function atualizarSaldo(id, saldo) {
  const result = await db.query(
    `UPDATE usuarios SET saldo = $1 WHERE id = $2
     RETURNING id, nome, email, saldo`,
    [saldo, id]
  );
  return result.rows[0] || null;
}

async function creditarSaldo(id, valor) {
  const result = await db.query(
    `UPDATE usuarios SET saldo = saldo + $1 WHERE id = $2
     RETURNING id, nome, email, saldo`,
    [valor, id]
  );
  return result.rows[0] || null;
}

async function debitarSaldo(id, valor) {
  const result = await db.query(
    `UPDATE usuarios SET saldo = saldo - $1 WHERE id = $2
     RETURNING id, nome, email, saldo`,
    [valor, id]
  );
  return result.rows[0] || null;
}

async function atualizarSenha(id, novaSenhaHash) {
  await db.query(
    'UPDATE usuarios SET senha = $1 WHERE id = $2',
    [novaSenhaHash, id]
  );
}

async function excluir(id) {
  const result = await db.query(
    'DELETE FROM usuarios WHERE id = $1 RETURNING id',
    [id]
  );
  return result.rows[0] || null;
}

async function buscarEstatisticas(idUsuario) {
  const result = await db.query(
    `SELECT
       COUNT(*) FILTER (WHERE status <> 'EM_ANDAMENTO') AS "totalJogos",
       COUNT(*) FILTER (WHERE status = 'GANHO') AS "vitorias",
       COUNT(*) FILTER (WHERE status = 'PERDIDO') AS "derrotas",
       COALESCE(SUM(premio_atual) FILTER (WHERE status = 'GANHO'), 0) AS "valorGanho",
       COALESCE(SUM(valor_aposta) FILTER (WHERE status = 'PERDIDO'), 0) AS "valorPerdido"
     FROM jogos
     WHERE id_usuario = $1`,
    [idUsuario]
  );
  return result.rows[0];
}

module.exports = {
  criar,
  buscarPorEmail,
  buscarPorId,
  buscarSenhaPorId,
  atualizarSaldo,
  creditarSaldo,
  debitarSaldo,
  atualizarSenha,
  excluir,
  buscarEstatisticas,
};
