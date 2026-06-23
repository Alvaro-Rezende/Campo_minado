-- Script de criação do banco de dados para API Campo Minado
-- Execute este script no PostgreSQL antes de iniciar a aplicação

CREATE DATABASE campo_minado;

\c campo_minado;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  data_nascimento DATE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  saldo NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de jogos
CREATE TABLE IF NOT EXISTS jogos (
  id SERIAL PRIMARY KEY,
  id_usuario INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  valor_aposta NUMERIC(10, 2) NOT NULL,
  tabuleiro JSONB NOT NULL,
  posicoes_reveladas JSONB NOT NULL DEFAULT '[]',
  diamantes_encontrados INTEGER NOT NULL DEFAULT 0,
  premio_atual NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  status VARCHAR(20) NOT NULL DEFAULT 'EM_ANDAMENTO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index para busca rápida de jogos em andamento por usuário
CREATE INDEX IF NOT EXISTS idx_jogos_usuario_status ON jogos(id_usuario, status);
