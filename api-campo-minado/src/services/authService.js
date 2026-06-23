const usuarioRepository = require('../repositories/usuarioRepository');
const { validarSenha } = require('../modules/validarSenha');

/**
 * Hash simples de senha usando base64 + salt.
 * Em produção, recomenda-se usar bcrypt ou argon2.
 */
function hashSenha(senha) {
  const salt = 'campo_minado_salt_2024';
  return Buffer.from(senha + salt).toString('base64');
}

function verificarSenha(senha, hash) {
  return hashSenha(senha) === hash;
}

async function registrar(nome, email, dataNascimento, senha, confirmacaoSenha) {
  // Validar campos obrigatórios
  if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
    throw { status: 400, message: 'Todos os campos são obrigatórios.' };
  }

  // Validar confirmação de senha
  if (senha !== confirmacaoSenha) {
    throw { status: 400, message: 'A senha e a confirmação de senha não coincidem.' };
  }

  // Validar requisitos da senha
  const errosSenha = validarSenha(senha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  // Verificar e-mail duplicado
  const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
  if (usuarioExistente) {
    throw { status: 409, message: 'E-mail já cadastrado.' };
  }

  const senhaHash = hashSenha(senha);
  const usuario = await usuarioRepository.criar(nome, email, dataNascimento, senhaHash);
  return usuario;
}

async function login(email, senha) {
  if (!email || !senha) {
    throw { status: 400, message: 'E-mail e senha são obrigatórios.' };
  }

  const usuario = await usuarioRepository.buscarPorEmail(email);
  if (!usuario) {
    throw { status: 401, message: 'E-mail ou senha inválidos.' };
  }

  if (!verificarSenha(senha, usuario.senha)) {
    throw { status: 401, message: 'E-mail ou senha inválidos.' };
  }

  return {
    nome: usuario.nome,
    email: usuario.email,
    dataNascimento: usuario.data_nascimento,
  };
}

async function redefinirSenha(id, novaSenha) {
  if (!id || !novaSenha) {
    throw { status: 400, message: 'ID e nova senha são obrigatórios.' };
  }

  // Validar requisitos da nova senha
  const errosSenha = validarSenha(novaSenha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  // Buscar senha atual
  const registro = await usuarioRepository.buscarSenhaPorId(id);
  if (!registro) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  // Verificar se nova senha é igual à atual
  if (verificarSenha(novaSenha, registro.senha)) {
    throw { status: 400, message: 'A nova senha não pode ser igual à senha atual.' };
  }

  const novaSenhaHash = hashSenha(novaSenha);
  await usuarioRepository.atualizarSenha(id, novaSenhaHash);

  return { message: 'Senha atualizada com sucesso.' };
}

module.exports = { registrar, login, redefinirSenha };
