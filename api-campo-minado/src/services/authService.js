const usuarioRepository = require('../repositories/usuarioRepository');
const { validarSenha } = require('../modules/validarSenha');
const bcrypt = require('bcrypt');

async function registrar(nome, email, dataNascimento, senha, confirmacaoSenha) {
  if (!nome || !email || !dataNascimento || !senha || !confirmacaoSenha) {
    throw { status: 400, message: 'Todos os campos são obrigatórios.' };
  }

  if (senha !== confirmacaoSenha) {
    throw { status: 400, message: 'A senha e a confirmação de senha não coincidem.' };
  }

  const errosSenha = validarSenha(senha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  const usuarioExistente = await usuarioRepository.buscarPorEmail(email);
  if (usuarioExistente) {
    throw { status: 409, message: 'E-mail já cadastrado.' };
  }

  const saltRounds = 10;
  const senhaHash = await bcrypt.hash(senha, saltRounds);
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

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
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

  const errosSenha = validarSenha(novaSenha);
  if (errosSenha.length > 0) {
    throw { status: 400, message: errosSenha.join(' ') };
  }

  const registro = await usuarioRepository.buscarSenhaPorId(id);
  if (!registro) {
    throw { status: 404, message: 'Usuário não encontrado.' };
  }

  const senhaAtualValida = await bcrypt.compare(novaSenha, registro.senha);
  if (senhaAtualValida) {
    throw { status: 400, message: 'A nova senha não pode ser igual à senha atual.' };
  }

  const saltRounds = 10;
  const novaSenhaHash = await bcrypt.hash(novaSenha, saltRounds);
  await usuarioRepository.atualizarSenha(id, novaSenhaHash);

  return { message: 'Senha atualizada com sucesso.' };
}

module.exports = { registrar, login, redefinirSenha };