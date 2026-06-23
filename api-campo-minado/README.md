# API Campo Minado 💣

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

- Node.js (v24.15.0)
- Express.js
- PostgreSQL
- dotenv
- cors
- nodemon

## Integrantes

- (Adicione os nomes do grupo aqui)

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/usuario/api-campo-minado.git
cd api-campo-minado
```

Instale as dependências:

```bash
npm install
```

---

## Configuração

Crie um arquivo `.env` na raiz do projeto (baseado no `.env.example`):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Configurar o Banco de Dados

1. Acesse o PostgreSQL e execute o script de criação:

```bash
psql -U postgres -f src/config/schema.sql
```

Ou copie e execute manualmente o conteúdo de `src/config/schema.sql` no seu cliente PostgreSQL (DBeaver, pgAdmin, etc.).

---

## Executando a aplicação

Modo desenvolvimento (com hot reload):

```bash
npm run dev
```

Modo produção:

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## Endpoints

### Autenticação

#### Cadastro de usuário
```
POST /auth/register
```
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}
```

#### Login
```
POST /auth/login
```
```json
{
  "email": "joao@email.com",
  "senha": "Senha@123"
}
```

#### Redefinir senha
```
PATCH /auth/reset-password
```
```json
{
  "id": 1,
  "novaSenha": "NovaSenha@456"
}
```

---

### Usuários

#### Buscar perfil
```
GET /users/{id}
```

#### Dashboard de estatísticas
```
GET /users/dashboard/{id}
```

#### Atualizar saldo
```
PUT /users/{id}
```
```json
{
  "saldo": 500.00
}
```

#### Excluir usuário
```
DELETE /users/{id}
```

---

### Jogos

#### Iniciar partida
```
POST /games/start
```
```json
{
  "idUser": 1,
  "valorAposta": 100
}
```

#### Revelar posição
```
POST /games/{gameId}/reveal
```
```json
{
  "linha": 2,
  "coluna": 3
}
```
> Linha e coluna são índices de **0 a 4**.

#### Sacar prêmio
```
POST /games/{gameId}/cashout
```

---

## Regras do Jogo

- Tabuleiro **5x5** com **5 bombas** e **20 diamantes**.
- Fórmula do prêmio: `valorApostado × (1 + (diamantes × 0.33))`
- Ao revelar uma bomba, o jogo encerra com prêmio **zero**.
- O usuário pode sacar a qualquer momento antes de revelar uma bomba.
- Não é possível iniciar nova partida com uma em andamento.
