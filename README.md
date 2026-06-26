# API Campo Minado

API REST desenvolvida em Node.js para uma plataforma de apostas baseada no jogo Campo Minado.

## Tecnologias Utilizadas

- Node.js (v24.15.0)
- Express.js
- PostgreSQL
- bcrypt (Criptografia de senhas)
- dotenv
- cors
- nodemon

## Integrantes

- Álvaro Rezende Martimiano
- João Luiz Rezende
- Luiza Cardoso da Locha

---

## Instalação

Clone o repositório:

git clone https://github.com/Alvaro-Rezende/api-campo-minado.git
cd api-campo-minado

Instale as dependências:

npm install

---

## Configuração de Ambiente e Banco de Dados

Crie um arquivo .env na raiz do projeto contendo as seguintes variáveis:

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=campo_minado
DB_USER=postgres
DB_PASSWORD=postgres

# Server Configuration
PORT=3000
NODE_ENV=development

### Configuração no GitHub Codespaces / Linux

Para ambientes virtuais como o Codespaces, inicie e configure o PostgreSQL executando os comandos abaixo no terminal:

1. Inicie o serviço do banco de dados:
sudo service postgresql start

2. Acesse o modo Super Administrador (root) para evitar conflitos de senha:
sudo su

3. Defina a senha do banco como "postgres":
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

4. Execute o script para criar o banco de dados e as tabelas:
sudo -u postgres psql -f src/config/schema.sql

5. Saia do modo Super Administrador:
exit

---

## Executando a aplicação

Modo desenvolvimento (com hot reload):

npm run dev

A API estará disponível em: http://localhost:3000

> Nota para testes no Postman via Codespaces: Lembre-se de alterar a visibilidade da porta 3000 para "Public" na aba "Portas" do VS Code e utilizar o endereço encaminhado gerado pelo GitHub.

---

## Endpoints

### Autenticação

#### Cadastro de usuário
POST /auth/register

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-01",
  "senha": "Senha@123",
  "confirmacaoSenha": "Senha@123"
}

#### Login
POST /auth/login

{
  "email": "joao@email.com",
  "senha": "Senha@123"
}

#### Redefinir senha
PATCH /auth/reset-password

{
  "id": 1,
  "novaSenha": "NovaSenha@456"
}

---

### Usuários

#### Buscar perfil
GET /users/{id}

#### Dashboard de estatísticas
GET /users/dashboard

*(Diferente das demais rotas, esta rota não recebe o parâmetro de ID na URL para evitar conflitos internos no roteamento).*

#### Atualizar saldo
PUT /users/{id}

{
  "saldo": 500.00
}

#### Excluir usuário
DELETE /users/{id}

---

### Jogos

#### Iniciar partida
POST /games/start

{
  "idUser": 1,
  "valorAposta": 100
}

#### Revelar posição
POST /games/{gameId}/reveal

{
  "linha": 2,
  "coluna": 3
}
> Linha e coluna são índices numéricos de 0 a 4.

#### Sacar prêmio
POST /games/{gameId}/cashout

---

## Regras do Jogo

- Tabuleiro 5x5 com 5 bombas e 20 diamantes.
- Fórmula do prêmio: valorApostado × (1 + (diamantes × 0.33))
- Ao revelar uma bomba, o jogo encerra com prêmio zero.
- O usuário pode sacar a qualquer momento antes de revelar uma bomba, somando o valor final ao seu saldo.
- O banco de dados aplica exclusão em cascata (ON DELETE CASCADE), ou seja, excluir um usuário deleta automaticamente todas as suas partidas.
- Não é possível iniciar uma nova partida se o usuário possuir uma em andamento.
