/**
 * Módulo responsável pela lógica do tabuleiro do Campo Minado.
 * Tabuleiro 5x5 com diamantes e bombas distribuídos aleatoriamente.
 */

const LINHAS = 5;
const COLUNAS = 5;
const TOTAL_CELULAS = LINHAS * COLUNAS; // 25
const TOTAL_BOMBAS = 5; // 5 bombas, 20 diamantes

/**
 * Gera um novo tabuleiro 5x5 com posicionamento aleatório de bombas e diamantes.
 * Retorna uma matriz de strings: 'DIAMANTE' ou 'BOMBA'.
 */
function gerarTabuleiro() {
  const celulas = Array(TOTAL_CELULAS).fill('DIAMANTE');

  // Seleciona posições aleatórias para as bombas
  const indicesBombas = new Set();
  while (indicesBombas.size < TOTAL_BOMBAS) {
    indicesBombas.add(Math.floor(Math.random() * TOTAL_CELULAS));
  }

  indicesBombas.forEach((idx) => {
    celulas[idx] = 'BOMBA';
  });

  // Converte array linear em matriz 5x5
  const tabuleiro = [];
  for (let i = 0; i < LINHAS; i++) {
    tabuleiro.push(celulas.slice(i * COLUNAS, i * COLUNAS + COLUNAS));
  }

  return tabuleiro;
}

/**
 * Calcula o prêmio acumulado com base na fórmula:
 * premio = valorApostado × (1 + (quantidadeDiamantes × 0.33))
 */
function calcularPremio(valorAposta, diamantesEncontrados) {
  return parseFloat((valorAposta * (1 + diamantesEncontrados * 0.33)).toFixed(2));
}

/**
 * Verifica se uma posição (linha, coluna) é válida no tabuleiro.
 */
function posicaoValida(linha, coluna) {
  return (
    Number.isInteger(linha) &&
    Number.isInteger(coluna) &&
    linha >= 0 &&
    linha < LINHAS &&
    coluna >= 0 &&
    coluna < COLUNAS
  );
}

module.exports = { gerarTabuleiro, calcularPremio, posicaoValida };
